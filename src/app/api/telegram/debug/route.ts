import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function clean(value: unknown) {
    return typeof value === 'string' ? value.trim() : '';
}

export async function GET() {
    const botToken = clean(process.env.TELEGRAM_BOT_TOKEN);
    if (!botToken) return NextResponse.json({ ok: false, error: 'TELEGRAM_BOT_TOKEN missing' }, { status: 500 });

    try {
        const [meRes, webhookRes] = await Promise.all([
            fetch(`https://api.telegram.org/bot${botToken}/getMe`, { cache: 'no-store' }),
            fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`, { cache: 'no-store' }),
        ]);
        const me = await meRes.json();
        const webhook = await webhookRes.json();
        const info = webhook?.result || {};
        return NextResponse.json({
            ok: Boolean(me?.ok && webhook?.ok),
            bot: me?.ok ? {
                id: me.result?.id,
                username: me.result?.username,
                canJoinGroups: me.result?.can_join_groups,
                canReadAllGroupMessages: me.result?.can_read_all_group_messages,
            } : me,
            webhook: webhook?.ok ? {
                url: info.url,
                hasCustomCertificate: info.has_custom_certificate,
                pendingUpdateCount: info.pending_update_count,
                lastErrorDate: info.last_error_date,
                lastErrorMessage: info.last_error_message,
                maxConnections: info.max_connections,
                allowedUpdates: info.allowed_updates,
            } : webhook,
        });
    } catch (error) {
        console.error('telegram.debug_failed', { errorType: error instanceof Error ? error.name : 'UnknownError' });
        return NextResponse.json({ ok: false, error: 'Telegram diagnostics failed' }, { status: 502 });
    }
}
