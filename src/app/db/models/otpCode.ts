import { Schema, model, models } from 'mongoose';

export interface IOtpCode {
    phone: string; // E.164
    codeHash: string; // збережемо хеш, не сам код
    expiresAt: Date; // TTL
    attempts: number; // ліміт спроб
}

const otpSchema = new Schema<IOtpCode>(
    {
        phone: { type: String, index: true, required: true },
        codeHash: { type: String, required: true },
        expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL індекс
        attempts: { type: Number, default: 0 },
    },
    { timestamps: true, versionKey: false },
);

export default models.OtpCode || model<IOtpCode>('OtpCode', otpSchema);
