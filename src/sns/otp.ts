import crypto from 'crypto';

const OTP_SECRET = process.env.OTP_SECRET || 'klaipeda';

export function generateOtpCode(): string {
    return '' + Math.floor(100000 + Math.random() * 900000); // 6 цифр
}

export function hashOtp(phone: string, code: string, salt?: string) {
    const s = salt ?? crypto.randomBytes(8).toString('hex');
    const h = crypto
        .createHmac('sha256', OTP_SECRET)
        .update(phone + ':' + code + ':' + s)
        .digest('hex');
    return `${s}:${h}`;
}

export function verifyOtpHash(phone: string, code: string, hash: string) {
    const [s, h] = hash.split(':');
    const check = crypto
        .createHmac('sha256', OTP_SECRET)
        .update(phone + ':' + code + ':' + s)
        .digest('hex');
    return crypto.timingSafeEqual(Buffer.from(h), Buffer.from(check));
}
