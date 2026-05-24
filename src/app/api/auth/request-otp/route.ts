import { NextResponse } from 'next/server';
import OtpCode from '@/app/db/models/otpCode';
import { initMongoDB } from '@/app/db/initDb';
import { generateOtpCode, hashOtp } from '@/sns/otp';
import { sendSMS, toE164US } from '@/sns/sns';

export async function POST(req: Request) {
    try {
        const { phone } = (await req.json()) as { phone: string };
        const e164 = toE164US(phone);

        await initMongoDB();

        // 1) створити код
        const code = generateOtpCode();
        const codeHash = hashOtp(e164, code);
        const expiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 хв

        // 2) зберегти/оновити єдиний активний код
        await OtpCode.findOneAndUpdate(
            { phone: e164 },
            { codeHash, expiresAt, attempts: 0 },
            { upsert: true, new: true },
        );

        // 3) відправити SMS
        await sendSMS(
            e164,
            `mOliora: your verification code is ${code}. It expires in 20 minutes.`,
        );

        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json(
            { ok: false, error: (e as Error).message },
            { status: 400 },
        );
    }
}
