import type { Types } from 'mongoose';

type TelegramLead = {
    _id?: Types.ObjectId | string;
    name?: string;
    phone?: string;
    email?: string;
    location?: string;
    service?: string;
    message?: string;
    leadSource?: string;
    approximateArea?: string;
    existingFlooring?: string;
    demolition?: string;
    materialSupply?: string;
    callSummary?: string;
    callTranscript?: string;
    recordingUrl?: string;
    callDurationSeconds?: number;
};

type TelegramApiResponse<T = unknown> = {
    ok: boolean;
    result?: T;
    description?: string;
};

function escapeHtml(value: string) {
    return value.replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    })[char] as string);
}

function clean(value: unknown) {
    return typeof value === 'string' ? value.trim() : '';
}

function botToken() {
    return clean(process.env.TELEGRAM_BOT_TOKEN);
}

export function telegramConfigured() {
    return Boolean(botToken() && clean(process.env.TELEGRAM_CHAT_ID));
}

async function telegramRequest<T = unknown>(method: string, body: Record<string, unknown>): Promise<TelegramApiResponse<T>> {
    const token = botToken();
    if (!token) return { ok: false, description: 'TELEGRAM_BOT_TOKEN is not configured.' };

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(body),
            cache: 'no-store',
        });
        const json = (await response.json()) as TelegramApiResponse<T>;
        if (!response.ok || !json.ok) {
            console.error('telegram.request_failed', { method, status: response.status, description: json.description || 'Unknown Telegram error' });
        }
        return json;
    } catch (error) {
        console.error('telegram.request_failed', { method, errorType: error instanceof Error ? error.name : 'UnknownError' });
        return { ok: false, description: 'Telegram request failed.' };
    }
}

export async function answerTelegramCallback(callbackQueryId: string, text?: string, showAlert = false) {
    return telegramRequest('answerCallbackQuery', {
        callback_query_id: callbackQueryId,
        ...(text ? { text } : {}),
        show_alert: showAlert,
    });
}

export async function sendTelegramText(chatId: string | number, text: string) {
    return telegramRequest('sendMessage', {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
    });
}

function leadMessage(lead: TelegramLead) {
    const name = clean(lead.name) || 'Unknown caller';
    const phone = clean(lead.phone);
    const email = clean(lead.email);
    const location = clean(lead.location);
    const service = clean(lead.service) || 'General request';
    const source = clean(lead.leadSource) || 'mOliora';
    const summary = clean(lead.callSummary) || clean(lead.message);
    const transcript = clean(lead.callTranscript);
    const leadId = lead._id ? String(lead._id) : '';

    const rows = [
        '<b>🔔 New mOliora lead</b>',
        `<b>Source:</b> ${escapeHtml(source)}`,
        `<b>Name:</b> ${escapeHtml(name)}`,
        phone ? `<b>Phone:</b> ${escapeHtml(phone)}` : '',
        email ? `<b>Email:</b> ${escapeHtml(email)}` : '',
        location ? `<b>Location:</b> ${escapeHtml(location)}` : '',
        `<b>Service:</b> ${escapeHtml(service)}`,
        lead.approximateArea ? `<b>Area:</b> ${escapeHtml(clean(lead.approximateArea))}` : '',
        lead.existingFlooring ? `<b>Existing floor:</b> ${escapeHtml(clean(lead.existingFlooring))}` : '',
        lead.demolition ? `<b>Removal:</b> ${escapeHtml(clean(lead.demolition))}` : '',
        lead.materialSupply ? `<b>Material:</b> ${escapeHtml(clean(lead.materialSupply))}` : '',
        typeof lead.callDurationSeconds === 'number' && lead.callDurationSeconds > 0
            ? `<b>Call:</b> ${Math.round(lead.callDurationSeconds)} sec`
            : '',
        summary ? `\n<b>Summary:</b>\n${escapeHtml(summary.slice(0, 2200))}` : '',
        transcript && transcript !== summary ? `\n<b>Transcript:</b>\n${escapeHtml(transcript.slice(0, 1200))}${transcript.length > 1200 ? '…' : ''}` : '',
        leadId ? `\n<code>Lead ${escapeHtml(leadId)}</code>` : '',
    ].filter(Boolean);

    return rows.join('\n');
}

export async function sendTelegramLeadNotification(lead: TelegramLead) {
    const chatId = clean(process.env.TELEGRAM_CHAT_ID);
    if (!botToken() || !chatId) return { ok: false, skipped: true } as const;

    const leadId = lead._id ? String(lead._id) : '';
    const inline_keyboard = leadId
        ? [[{ text: '🎧 Get voice', callback_data: `voice:${leadId}` }]]
        : undefined;

    const result = await telegramRequest<{ message_id: number }>('sendMessage', {
        chat_id: chatId,
        text: leadMessage(lead),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        ...(inline_keyboard ? { reply_markup: { inline_keyboard } } : {}),
    });

    return { ok: result.ok, skipped: false, messageId: result.result?.message_id } as const;
}

async function telegramUploadVoice(chatId: string | number, bytes: ArrayBuffer, filename: string, caption?: string) {
    const token = botToken();
    if (!token) return { ok: false, description: 'TELEGRAM_BOT_TOKEN is not configured.' };

    const form = new FormData();
    form.set('chat_id', String(chatId));
    form.set('voice', new Blob([bytes], { type: 'audio/mpeg' }), filename);
    if (caption) form.set('caption', caption.slice(0, 1024));

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendVoice`, {
            method: 'POST',
            body: form,
            cache: 'no-store',
        });
        return (await response.json()) as TelegramApiResponse;
    } catch (error) {
        console.error('telegram.voice_upload_failed', { errorType: error instanceof Error ? error.name : 'UnknownError' });
        return { ok: false, description: 'Voice upload failed.' };
    }
}

export async function sendTelegramVoice(chatId: string | number, recordingUrl: string, caption?: string) {
    const url = clean(recordingUrl);
    if (!url) return { ok: false, description: 'Recording is not available yet.' };

    // First let Telegram fetch a public recording URL directly.
    const direct = await telegramRequest('sendVoice', {
        chat_id: chatId,
        voice: url,
        ...(caption ? { caption: caption.slice(0, 1024) } : {}),
    });
    if (direct.ok) return direct;

    // Twilio recording media commonly requires HTTP Basic Auth. If credentials are
    // configured, fetch the media server-side and upload the bytes to Telegram.
    const sid = clean(process.env.TWILIO_ACCOUNT_SID);
    const authToken = clean(process.env.TWILIO_AUTH_TOKEN);
    if (!sid || !authToken) return direct;

    try {
        const mediaUrl = /\.(mp3|wav)(\?|$)/i.test(url) ? url : `${url}.mp3`;
        const auth = Buffer.from(`${sid}:${authToken}`).toString('base64');
        const response = await fetch(mediaUrl, {
            headers: { authorization: `Basic ${auth}` },
            cache: 'no-store',
        });
        if (!response.ok) {
            console.error('telegram.recording_fetch_failed', { status: response.status });
            return { ok: false, description: 'Unable to fetch the call recording.' };
        }
        return telegramUploadVoice(chatId, await response.arrayBuffer(), 'moliora-call.mp3', caption);
    } catch (error) {
        console.error('telegram.recording_fetch_failed', { errorType: error instanceof Error ? error.name : 'UnknownError' });
        return { ok: false, description: 'Unable to fetch the call recording.' };
    }
}
