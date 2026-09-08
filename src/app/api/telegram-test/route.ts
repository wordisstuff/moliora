import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type TelegramChat = {
    id?: number;
    title?: string;
    username?: string;
    type?: string;
};

type TelegramUpdate = {
    message?: { chat?: TelegramChat };
    edited_message?: { chat?: TelegramChat };
    channel_post?: { chat?: TelegramChat };
    edited_channel_post?: { chat?: TelegramChat };
    my_chat_member?: { chat?: TelegramChat };
    chat_member?: { chat?: TelegramChat };
};

function safeChat(chat?: TelegramChat) {
    if (!chat || typeof chat.id !== 'number') return null;
    return {
        id: chat.id,
        title: chat.title || '',
        username: chat.username || '',
        type: chat.type || '',
    };
}

export async function GET(req: NextRequest) {
    const token = process.env.TELEGRAM_BOT_TOKEN || '';
    const configuredChatId = process.env.TELEGRAM_CHAT_ID || '';
    const shouldSend = req.nextUrl.searchParams.get('send') === '1';

    if (!token) {
        return NextResponse.json(
            {
                ok: false,
                error: 'TELEGRAM_BOT_TOKEN is not configured in Vercel yet.',
                next: 'Add TELEGRAM_BOT_TOKEN, redeploy, then open this URL again.',
            },
            { status: 503 },
        );
    }

    const base = `https://api.telegram.org/bot${token}`;

    try {
        const [meResponse, updatesResponse] = await Promise.all([
            fetch(`${base}/getMe`, { cache: 'no-store' }),
            fetch(`${base}/getUpdates?limit=100&timeout=0`, { cache: 'no-store' }),
        ]);

        const me = await meResponse.json() as {
            ok?: boolean;
            result?: { id?: number; username?: string; first_name?: string };
            description?: string;
        };
        const updates = await updatesResponse.json() as {
            ok?: boolean;
            result?: TelegramUpdate[];
            description?: string;
        };

        const uniqueChats = new Map<number, ReturnType<typeof safeChat>>();
        for (const update of updates.result || []) {
            const candidates = [
                update.message?.chat,
                update.edited_message?.chat,
                update.channel_post?.chat,
                update.edited_channel_post?.chat,
                update.my_chat_member?.chat,
                update.chat_member?.chat,
            ];
            for (const candidate of candidates) {
                const chat = safeChat(candidate);
                if (chat) uniqueChats.set(chat.id, chat);
            }
        }

        const chats = Array.from(uniqueChats.values()).filter(Boolean);
        const configuredNumeric = Number(configuredChatId);
        const configuredMatch = Number.isFinite(configuredNumeric)
            ? chats.find(chat => chat?.id === configuredNumeric) || null
            : null;

        let sendTest: null | {
            attempted: boolean;
            ok: boolean;
            messageId?: number;
            error?: string;
        } = null;

        if (shouldSend) {
            if (!configuredChatId) {
                sendTest = { attempted: false, ok: false, error: 'TELEGRAM_CHAT_ID is not configured.' };
            } else {
                const sendResponse = await fetch(`${base}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: configuredChatId,
                        text: '🧪 mOliora Telegram test\nHenry Assistant connection is working.',
                    }),
                    cache: 'no-store',
                });
                const sent = await sendResponse.json() as {
                    ok?: boolean;
                    result?: { message_id?: number };
                    description?: string;
                };
                sendTest = {
                    attempted: true,
                    ok: Boolean(sent.ok),
                    ...(sent.result?.message_id ? { messageId: sent.result.message_id } : {}),
                    ...(!sent.ok ? { error: sent.description || 'Telegram sendMessage failed.' } : {}),
                };
            }
        }

        return NextResponse.json({
            ok: Boolean(me.ok),
            bot: me.result
                ? {
                      id: me.result.id,
                      username: me.result.username || '',
                      name: me.result.first_name || '',
                  }
                : null,
            chatIdConfigured: configuredChatId || null,
            configuredChatFoundInRecentUpdates: configuredMatch,
            recentChats: chats,
            updatesOk: Boolean(updates.ok),
            updatesError: updates.ok ? null : updates.description || 'Unable to read updates.',
            sendTest,
            hint: shouldSend
                ? (sendTest?.ok
                    ? 'Test message sent. Check the mOliora Leads group.'
                    : 'Test message was not sent. Check sendTest.error.')
                : (chats.length
                    ? 'Telegram is configured. Add ?send=1 to this URL to send a smoke-test message.'
                    : 'No chats found yet. Send /test in the mOliora Leads group, then refresh this page. If updatesError says a webhook is active, we will diagnose via the webhook instead.'),
        });
    } catch (error) {
        return NextResponse.json(
            {
                ok: false,
                error: error instanceof Error ? error.message : 'Telegram diagnostics failed.',
            },
            { status: 500 },
        );
    }
}
