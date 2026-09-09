import { NextRequest, NextResponse } from 'next/server';
import { initMongoDB } from '@/app/db/initDb';
import { ContactRequestModel } from '@/app/db/models/ContactRequest';
import { answerTelegramCallback, sendTelegramText, sendTelegramVapiVoice, sendTelegramVoice } from '@/lib/telegram';

type TelegramUpdate = {
    message?: {
        text?: string;
        chat?: { id?: string | number };
    };
    callback_query?: {
        id?: string;
        data?: string;
        message?: { chat?: { id?: string | number } };
    };
};

function webhookAuthorized(req: NextRequest) {
    const expected = process.env.TELEGRAM_WEBHOOK_SECRET || '';
    return Boolean(expected) && req.headers.get('x-telegram-bot-api-secret-token') === expected;
}

function allowedChat(chatId: string | number) {
    const expected = (process.env.TELEGRAM_CHAT_ID || '').trim();
    return Boolean(expected) && String(chatId) === expected;
}

function escapeHtml(value: string) {
    return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] as string);
}

function dayRange(offsetDays = 0) {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(now);
    const values = Object.fromEntries(parts.map(p => [p.type, p.value]));
    const localNoon = new Date(`${values.year}-${values.month}-${values.day}T12:00:00-05:00`);
    localNoon.setUTCDate(localNoon.getUTCDate() + offsetDays);
    const target = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(localNoon);
    const t = Object.fromEntries(target.map(p => [p.type, p.value]));
    const ymd = `${t.year}-${t.month}-${t.day}`;
    const midnightUtc = (date: string) => {
        const probe = new Date(`${date}T06:00:00Z`);
        const hour = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', hour: '2-digit', hour12: false }).format(probe)) % 24;
        probe.setUTCHours(probe.getUTCHours() - hour, 0, 0, 0);
        return probe;
    };
    const start = midnightUtc(ymd);
    const nextProbe = new Date(start); nextProbe.setUTCDate(nextProbe.getUTCDate() + 1);
    const nextParts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(nextProbe);
    const n = Object.fromEntries(nextParts.map(p => [p.type, p.value]));
    return { start, end: midnightUtc(`${n.year}-${n.month}-${n.day}`), label: ymd };
}

function commandKind(text: string) {
    const q = text.toLowerCase().trim();
    const yesterday = /yesterday|вчора|вчера/.test(q);
    const voices = /voice|record|audio|голос|запис|аудио|аудіо/.test(q);
    const calls = /call|дзвін|звон/.test(q);
    const texts = /text|transcript|текст|транскрип/.test(q);
    if (!calls && !texts && !voices) return null;
    return { yesterday, voices, texts: texts || (!voices && calls) };
}

async function handleHistory(chatId: string | number, text: string) {
    const command = commandKind(text);
    if (!command) {
        await sendTelegramText(chatId, '<b>Henry history</b>\nTry: “calls today”, “texts today”, “voices today”, or “calls yesterday”.');
        return;
    }
    await initMongoDB();
    const range = dayRange(command.yesterday ? -1 : 0);
    const leads = await ContactRequestModel.find({
        createdAt: { $gte: range.start, $lt: range.end },
        sourceType: { $in: ['vapi_phone_assistant', 'phone_assistant'] },
    }).sort({ createdAt: 1 }).limit(50).lean();

    if (!leads.length) {
        await sendTelegramText(chatId, `<b>📞 Calls — ${range.label}</b>\nNo phone calls found.`);
        return;
    }

    if (command.voices) {
        const rows = leads.map((lead, index) => {
            const time = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', hour: 'numeric', minute: '2-digit' }).format(new Date(lead.createdAt));
            return `${index + 1}) <b>${escapeHtml(lead.name || 'Caller')}</b>${lead.phone ? ` • ${escapeHtml(lead.phone)}` : ''} • ${time}`;
        });
        await sendTelegramText(chatId, `<b>🎧 Voice calls — ${range.label}</b>\n${rows.join('\n')}\n\nUse the 🎧 Get voice button on the original call card to play a recording.`);
        return;
    }

    await sendTelegramText(chatId, `<b>📞 Calls — ${range.label}</b> • ${leads.length} total`);
    for (let i = 0; i < leads.length; i += 1) {
        const lead = leads[i];
        const time = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', hour: 'numeric', minute: '2-digit' }).format(new Date(lead.createdAt));
        const summary = String(lead.callSummary || lead.message || '').trim();
        const transcript = String(lead.callTranscript || '').trim();
        const body = [
            `<b>${i + 1}) ${escapeHtml(lead.name || 'Caller')}</b>`,
            lead.phone ? `<b>Phone:</b> ${escapeHtml(lead.phone)}` : '',
            `<b>Time:</b> ${time}`,
            lead.service ? `<b>Service:</b> ${escapeHtml(lead.service)}` : '',
            summary ? `<b>Summary:</b> ${escapeHtml(summary.slice(0, 1200))}` : '',
            command.texts && transcript ? `<b>Transcript:</b>\n${escapeHtml(transcript.slice(0, 2500))}${transcript.length > 2500 ? '…' : ''}` : '',
        ].filter(Boolean).join('\n');
        await sendTelegramText(chatId, body);
    }
}

async function handleTranscriptCallback(chatId: string | number, callbackId: string, leadId: string) {
    await initMongoDB();
    const lead = await ContactRequestModel.findById(leadId).lean();
    if (!lead) {
        await answerTelegramCallback(callbackId, 'Lead not found.', true);
        return;
    }

    const transcript = String(lead.callTranscript || '').trim();
    await answerTelegramCallback(callbackId, transcript ? 'Sending transcript…' : 'No transcript available.', !transcript);
    if (!transcript) return;

    const header = `<b>📄 Transcript</b>\n${escapeHtml(lead.name || 'Caller')}${lead.phone ? ` • ${escapeHtml(lead.phone)}` : ''}`;
    const maxChunk = 3500;
    for (let offset = 0; offset < transcript.length; offset += maxChunk) {
        const chunk = transcript.slice(offset, offset + maxChunk);
        await sendTelegramText(chatId, `${offset === 0 ? `${header}\n\n` : ''}${escapeHtml(chunk)}${offset + maxChunk < transcript.length ? '…' : ''}`);
    }
}

export async function POST(req: NextRequest) {
    if (!webhookAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
    let update: TelegramUpdate;
    try { update = (await req.json()) as TelegramUpdate; } catch { return NextResponse.json({ ok: true }); }

    const incomingChatId = update.message?.chat?.id;
    const incomingText = update.message?.text?.trim();
    if (incomingChatId != null && incomingText) {
        if (!allowedChat(incomingChatId)) return NextResponse.json({ ok: true });
        try { await handleHistory(incomingChatId, incomingText); }
        catch (error) {
            console.error('telegram.history_failed', { errorType: error instanceof Error ? error.name : 'UnknownError' });
            await sendTelegramText(incomingChatId, 'Unable to load call history right now.');
        }
        return NextResponse.json({ ok: true });
    }

    const callback = update.callback_query;
    const callbackId = callback?.id || '';
    const data = callback?.data || '';
    const chatId = callback?.message?.chat?.id;
    if (!callbackId || !data || chatId == null || !allowedChat(chatId)) return NextResponse.json({ ok: true });

    if (data.startsWith('transcript:')) {
        const leadId = data.slice('transcript:'.length);
        try {
            await handleTranscriptCallback(chatId, callbackId, leadId);
        } catch (error) {
            console.error('telegram.transcript_callback_failed', { errorType: error instanceof Error ? error.name : 'UnknownError' });
            await answerTelegramCallback(callbackId, 'Unable to load transcript.', true);
        }
    } else if (data.startsWith('voice:')) {
        const leadId = data.slice('voice:'.length);
        try {
            await initMongoDB();
            const lead = await ContactRequestModel.findById(leadId).lean();
            if (!lead) { await answerTelegramCallback(callbackId, 'Lead not found.', true); return NextResponse.json({ ok: true }); }
            await answerTelegramCallback(callbackId, 'Sending voice…');
            const caption = `${lead.name || 'Caller'}${lead.phone ? ` • ${lead.phone}` : ''}`;
            const sent = lead.vapiCallId
                ? await sendTelegramVapiVoice(chatId, lead.vapiCallId, caption)
                : lead.recordingUrl
                    ? await sendTelegramVoice(chatId, lead.recordingUrl, caption)
                    : { ok: false, description: 'Recording is not ready yet.' };
            if (!sent.ok) await sendTelegramText(chatId, '<b>Could not send the voice recording.</b> It may still be processing, or the Vapi private API key/recording setting may need attention.');
        } catch (error) {
            console.error('telegram.voice_callback_failed', { errorType: error instanceof Error ? error.name : 'UnknownError' });
            await answerTelegramCallback(callbackId, 'Unable to load the recording.', true);
        }
    } else await answerTelegramCallback(callbackId);

    return NextResponse.json({ ok: true });
}
