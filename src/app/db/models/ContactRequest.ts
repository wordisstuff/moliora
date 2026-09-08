// src/models/ContactRequest.ts
import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';
import { sendTelegramLeadNotification } from '@/lib/telegram';

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

        // Henry phone-assistant metadata. A call can be created before Twilio has
        // finished processing the recording; the recording webhook fills it in later.
        sourceType: { type: String, default: '' },
        callSid: { type: String, default: '', index: true },
        callSummary: { type: String, default: '' },
        callTranscript: { type: String, default: '' },
        recordingUrl: { type: String, default: '' },
        recordingSid: { type: String, default: '' },
        callDurationSeconds: { type: Number, default: 0, min: 0 },

        // Lightweight CRM fields. They live on the same lead record so attribution
        // stays connected all the way from the ad click to a won job.
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

// Every newly-created lead—website form or Henry phone assistant—gets the same
// Telegram notification. Telegram is deliberately fail-soft so a bot outage can
// never prevent a customer request from being saved.
contactRequestSchema.post('save', async function notifyTelegram(doc) {
    try {
        await sendTelegramLeadNotification(doc.toObject());
    } catch (error) {
        console.error('lead.telegram_notification_failed', {
            errorType: error instanceof Error ? error.name : 'UnknownError',
            leadId: String(doc._id),
        });
    }
});

export type ContactRequest = InferSchemaType<typeof contactRequestSchema>;

const cachedModel = mongoose.models.ContactRequest as Model<ContactRequest> | undefined;
const requiredSchemaPaths = [
    'consent', 'consentTimestamp', 'consentVersion', 'leadSource', 'approximateArea',
    'existingFlooring', 'demolition', 'materialSupply', 'utmSource', 'utmMedium',
    'utmCampaign', 'utmTerm', 'utmContent', 'gclid', 'landingPage', 'sourceType',
    'callSid', 'callSummary', 'callTranscript', 'recordingUrl', 'recordingSid',
    'callDurationSeconds', 'status', 'estimatedValue', 'finalJobValue', 'notes',
    'statusUpdatedAt', 'wonAt', 'lostAt',
] as const;
const hasCurrentSchema = cachedModel && requiredSchemaPaths.every(path => cachedModel.schema.path(path)) && !cachedModel.schema.path('budget');

if (cachedModel && !hasCurrentSchema) mongoose.deleteModel('ContactRequest');

export const ContactRequestModel: Model<ContactRequest> = hasCurrentSchema
    ? cachedModel
    : mongoose.model<ContactRequest>('ContactRequest', contactRequestSchema);
