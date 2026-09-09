// src/models/ContactRequest.ts
import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Estimate Scheduled', 'Estimate Sent', 'Won', 'Lost'] as const;

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

        leadSource: { type: String, default: '' },
        approximateArea: { type: String, default: '' },
        existingFlooring: { type: String, default: '' },
        demolition: { type: String, default: '' },
        materialSupply: { type: String, default: '' },

        utmSource: { type: String, default: '' },
        utmMedium: { type: String, default: '' },
        utmCampaign: { type: String, default: '' },
        utmTerm: { type: String, default: '' },
        utmContent: { type: String, default: '' },
        gclid: { type: String, default: '' },
        landingPage: { type: String, default: '' },

        sourceType: { type: String, default: '' },
        callSid: { type: String, default: '', index: true },
        vapiCallId: { type: String, default: '', index: true },
        callSummary: { type: String, default: '' },
        callTranscript: { type: String, default: '' },
        recordingUrl: { type: String, default: '' },
        recordingSid: { type: String, default: '' },
        callDurationSeconds: { type: Number, default: 0, min: 0 },

        status: { type: String, enum: LEAD_STATUSES, default: 'New', index: true },
        estimatedValue: { type: Number, default: 0, min: 0 },
        finalJobValue: { type: Number, default: 0, min: 0 },
        notes: { type: String, default: '' },
        statusUpdatedAt: { type: Date },
        wonAt: { type: Date },
        lostAt: { type: Date },

        ip: { type: String, default: '' },
        userAgent: { type: String, default: '' },
    },
    { timestamps: true, versionKey: false },
);

// Telegram delivery for phone calls is owned by Henry Backend now. Website forms
// remain email/CRM only, and routed phone leads can be stored here without causing
// a second Telegram notification.

export type ContactRequest = InferSchemaType<typeof contactRequestSchema>;

const cachedModel = mongoose.models.ContactRequest as Model<ContactRequest> | undefined;
const requiredSchemaPaths = [
    'consent', 'consentTimestamp', 'consentVersion', 'leadSource', 'approximateArea',
    'existingFlooring', 'demolition', 'materialSupply', 'utmSource', 'utmMedium',
    'utmCampaign', 'utmTerm', 'utmContent', 'gclid', 'landingPage', 'sourceType',
    'callSid', 'vapiCallId', 'callSummary', 'callTranscript', 'recordingUrl', 'recordingSid',
    'callDurationSeconds', 'status', 'estimatedValue', 'finalJobValue', 'notes',
    'statusUpdatedAt', 'wonAt', 'lostAt',
] as const;
const hasCurrentSchema = cachedModel && requiredSchemaPaths.every(path => cachedModel.schema.path(path)) && !cachedModel.schema.path('budget');

if (cachedModel && !hasCurrentSchema) mongoose.deleteModel('ContactRequest');

export const ContactRequestModel: Model<ContactRequest> = hasCurrentSchema
    ? cachedModel
    : mongoose.model<ContactRequest>('ContactRequest', contactRequestSchema);
