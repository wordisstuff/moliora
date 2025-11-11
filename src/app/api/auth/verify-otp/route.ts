import { NextResponse } from 'next/server';
import OtpCode from '@/app/db/models/otpCode';
import { initMongoDB } from '@/app/db/initDb';

import { verifyOtpHash } from '@/sns/otp';

export async function POST(req: Request) {
    try {
        const { phone, code } = (await req.json()) as {
            phone: string;
            code: string;
        };
        await initMongoDB();

        const rec = await OtpCode.findOne({ phone });
        if (!rec)
            return NextResponse.json(
                { ok: false, error: 'Code expired.' },
                { status: 400 },
            );
        if (rec.expiresAt.getTime() < Date.now())
            return NextResponse.json(
                { ok: false, error: 'Code expired.' },
                { status: 400 },
            );
        if (rec.attempts >= 5)
            return NextResponse.json(
                { ok: false, error: 'Too many attempts.' },
                { status: 429 },
            );

        const valid = verifyOtpHash(phone, code, rec.codeHash);
        if (!valid) {
            rec.attempts += 1;
            await rec.save();
            return NextResponse.json(
                { ok: false, error: 'Invalid code.' },
                { status: 400 },
            );
        }

        // успіх: видаляємо код і видаємо короткий токен-сесію/куку
        await rec.deleteOne();

        // тут створи свою сесію (JWT/кука). Поверну плейсхолдер:
        const sessionToken = 'temp-' + Math.random().toString(36).slice(2);
        // set-cookie тощо — опусти для стислості

        return NextResponse.json({ ok: true, token: sessionToken });
    } catch (e) {
        return NextResponse.json(
            { ok: false, error: (e as Error).message },
            { status: 400 },
        );
    }
}
