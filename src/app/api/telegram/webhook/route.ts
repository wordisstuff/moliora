import { NextRequest, NextResponse } from 'next/server';
import { initMongoDB } from '@/app/db/initDb';
import { ContactRequestModel } from '@/app/db/models/ContactRequest';
import { answerTelegramCallback, sendTelegramText, sendTelegramVapiVoice, sendTelegramVoice } from '@/lib/telegram';

type TelegramUpdate = {
    callback_query?: {
        id?: string;
        data?: string;
        message?: {
            chat?: { id?: string | number };
        };
    };
};

function webhookAuthorized(req: NextRequest) {
    const expected = process.env.TELEGRAM_WEBHOOK_SECRET || '';
    if (!expected) return false;
    return req.headers.get('x-telegram-bot-api-secret-token') === expected;
}

export async function POST(req: NextRequest) {
    if (!webhookAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });

    let update: TelegramUpdate;
    try {
        update = (await req.json()) as TelegramUpdate;
    } catch {
        return NextResponse.json({ ok: true });
    }

    const callback = update.callback_query;
    const callbackId = callback?.id || '';
    const data = callback?.data || '';
    const chatId = callback?.message?.chat?.id;

    if (!callbackId || !data || chatId == null) return NextResponse.json({ ok: true });

    if (data.startsWith('voice:')) {
        const leadId = data.slice('voice:'.length);
        try {
            await initMongoDB();
            const lead = await ContactRequestModel.findById(leadId).lean();
            if (!lead) {
                await answerTelegramCallback(callbackId, 'Lead not found.', true);
                return NextResponse.json({ ok: true });
            }

            await answerTelegramCallback(callbackId, 'Sending voice…');
            const caption = `${lead.name || 'Caller'}${lead.phone ? ` • ${lead.phone}` : ''}`;

            const sent = lead.vapiCallId
                ? await sendTelegramVapiVoice(chatId, lead.vapiCallId, caption)
                : lead.recordingUrl
                    ? await sendTelegramVoice(chatId, lead.recordingUrl, caption)
                    : { ok: false, description: 'Recording is not ready yet.' };

            if (!sent.ok) {
                await sendTelegramText(
                    chatId,
                    '<b>Could not send the voice recording.</b> It may still be processing, or the Vapi private API key/recording setting may need attention.',
                );
            }
        } catch (error) {
            console.error('telegram.voice_callback_failed', { errorType: error instanceof Error ? error.name : 'UnknownError' });
            await answerTelegramCallback(callbackId, 'Unable to load the recording.', true);
        }
    } else {
        await answerTelegramCallback(callbackId);
    }

    return NextResponse.json({ ok: true });
}
