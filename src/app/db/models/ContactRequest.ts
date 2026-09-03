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

        // Marketing attribution captured from landing-page URLs.
        utmSource: { type: String, default: '' },
        utmMedium: { type: String, default: '' },
        utmCampaign: { type: String, default: '' },
        utmTerm: { type: String, default: '' },
        utmContent: { type: String, default: '' },
        gclid: { type: String, default: '' },
        landingPage: { type: String, default: '' },

        ip: { type: String, default: '' },
        userAgent: { type: String, default: '' },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export type ContactRequest = InferSchemaType<typeof contactRequestSchema>;

const cachedModel = mongoose.models.ContactRequest as
    | Model<ContactRequest>
    | undefined;

const requiredSchemaPaths = [
    'consent',
    'consentTimestamp',
    'consentVersion',
    'leadSource',
    'approximateArea',
    'existingFlooring',
    'demolition',
    'materialSupply',
    'utmSource',
    'utmMedium',
    'utmCampaign',
    'utmTerm',
    'utmContent',
    'gclid',
    'landingPage',
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
