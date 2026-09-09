import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function clean(value: unknown) {
    return typeof value === 'string' ? value.trim() : '';
}

export async function GET() {
    const botToken = clean(process.env.TELEGRAM_BOT_TOKEN);
    const secretToken = clean(process.env.TELEGRAM_WEBHOOK_SECRET);
    if (!botToken || !secretToken) {
        return NextResponse.json({ ok: false, error: 'Telegram environment variables are not configured.' }, { status: 500 });
    }

    const webhookUrl = 'https://moliora.us/api/telegram/webhook';
    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                url: webhookUrl,
                secret_token: secretToken,
                allowed_updates: ['message', 'callback_query'],
                drop_pending_updates: false,
            }),
            cache: 'no-store',
        });
        const result = await response.json();
        return NextResponse.json({ ok: response.ok && Boolean(result?.ok), webhookUrl, telegram: result }, { status: response.ok ? 200 : response.status });
    } catch (error) {
        console.error('telegram.webhook_setup_failed', { errorType: error instanceof Error ? error.name : 'UnknownError' });
        return NextResponse.json({ ok: false, error: 'Telegram webhook setup failed.' }, { status: 502 });
    }
}
