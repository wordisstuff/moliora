// src/models/ContactRequest.ts
import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const contactRequestSchema = new Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, default: '' },
        email: { type: String, required: true },
        location: { type: String, default: '' },
        service: { type: String, default: '' },
        budget: { type: String, default: '' },
        message: { type: String, required: true },

        // технічні поля, якщо захочеш використовувати:
        ip: { type: String, default: '' },
        userAgent: { type: String, default: '' },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export type ContactRequest = InferSchemaType<typeof contactRequestSchema>;

// щоб уникнути "OverwriteModelError" у dev при HMR
export const ContactRequestModel: Model<ContactRequest> =
    (mongoose.models.ContactRequest as Model<ContactRequest>) ||
    mongoose.model<ContactRequest>('ContactRequest', contactRequestSchema);
