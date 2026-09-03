// src/models/ContactRequest.ts
import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const contactRequestSchema = new Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, default: '' },
        email: { type: String, default: '' },
        location: { type: String, default: '' },
        service: { type: String, default: '' },
        message: { type: String, required: true },
        consent: { type: Boolean, default: false },
        consentTimestamp: { type: Date },
        consentVersion: { type: String, default: '' },

        // Optional lead-source/service-specific fields. Existing general contact
        // submissions remain compatible because these are never required.
        leadSource: { type: String, default: '' },
        approximateArea: { type: String, default: '' },
        existingFlooring: { type: String, default: '' },
        demolition: { type: String, default: '' },
        materialSupply: { type: String, default: '' },

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
const cachedModel = mongoose.models.ContactRequest as
    | Model<ContactRequest>
    | undefined;

// A warm development/serverless process can already contain the model compiled
// from an older deployment. Recompile only when its schema is stale; MongoDB
// itself remains schemaless and existing documents are unaffected.
const requiredSchemaPaths = [
    'consent',
    'consentTimestamp',
    'consentVersion',
    'leadSource',
    'approximateArea',
    'existingFlooring',
    'demolition',
    'materialSupply',
] as const;
const hasCurrentSchema =
    cachedModel &&
    requiredSchemaPaths.every(path => cachedModel.schema.path(path)) &&
    !cachedModel.schema.path('budget');

if (cachedModel && !hasCurrentSchema) {
    mongoose.deleteModel('ContactRequest');
}

export const ContactRequestModel: Model<ContactRequest> = hasCurrentSchema
    ? cachedModel
    : mongoose.model<ContactRequest>('ContactRequest', contactRequestSchema);
