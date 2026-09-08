import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { initMongoDB } from '@/app/db/initDb';
import { ContactRequestModel } from '@/app/db/models/ContactRequest';
import { sendTelegramLeadNotification } from '@/lib/telegram';

type AssistantIntakePayload = {
    name?: unknown;
    phone?: unknown;
    email?: unknown;
    location?: unknown;
    service?: unknown;
    summary?: unknown;
    transcript?: unknown;
    callSid?: unknown;
    recordingUrl?: unknown;
    recordingSid?: unknown;
    durationSeconds?: unknown;
    leadSource?: unknown;
    approximateArea?: unknown;
    existingFlooring?: unknown;
    demolition?: unknown;
    materialSupply?: unknown;
};

function text(value: unknown, max = 4_000) {
    return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function authorized(req: NextRequest) {
    const expected = process.env.ASSISTANT_WEBHOOK_SECRET || '';
    if (!expected) return false;
    const bearer = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';
    const supplied = bearer || req.headers.get('x-assistant-secret') || '';
    const a = Buffer.from(supplied);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
}

function normalizePhone(value: string) {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
    return value.slice(0, 30);
}

export async function POST(req: NextRequest) {
    if (!authorized(req)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    let body: AssistantIntakePayload;
    try {
        body = (await req.json()) as AssistantIntakePayload;
    } catch {
        return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
    }

    const summary = text(body.summary);
    const transcript = text(body.transcript, 30_000);
    const phone = normalizePhone(text(body.phone, 30));
    const callSid = text(body.callSid, 120);
    const recordingUrl = text(body.recordingUrl, 1_000);
    const durationNumber = Number(body.durationSeconds || 0);
    const callDurationSeconds = Number.isFinite(durationNumber) && durationNumber > 0 ? Math.round(durationNumber) : 0;

    if (!summary && !transcript) {
        return NextResponse.json({ success: false, error: 'summary or transcript is required' }, { status: 400 });
    }

    try {
        await initMongoDB();

        // If the voice platform retries the tool call, update the existing call instead
        // of creating a duplicate lead whenever a Twilio CallSid is available.
        const existing = callSid ? await ContactRequestModel.findOne({ callSid }) : null;
        const values = {
            name: text(body.name, 120) || 'Phone caller',
            phone,
            email: text(body.email, 254).toLowerCase(),
            location: text(body.location, 120),
            service: text(body.service, 80) || 'LVP Flooring',
            message: summary || transcript.slice(0, 4_000),
            consent: false,
            leadSource: text(body.leadSource, 120) || 'Henry AI Phone Assistant',
            approximateArea: text(body.approximateArea, 80),
            existingFlooring: text(body.existingFlooring, 80),
            demolition: text(body.demolition, 40),
            materialSupply: text(body.materialSupply, 120),
            sourceType: 'phone_assistant',
            callSid,
            callSummary: summary,
            callTranscript: transcript,
            recordingUrl,
            recordingSid: text(body.recordingSid, 120),
            callDurationSeconds,
        };

        const doc = existing
            ? await ContactRequestModel.findByIdAndUpdate(existing._id, { $set: values }, { new: true })
            : await ContactRequestModel.create(values);

        if (!doc) throw new Error('Unable to save phone lead');

        try {
            await sendTelegramLeadNotification(doc.toObject());
        } catch (error) {
            console.error('assistant.telegram_notification_failed', { errorType: error instanceof Error ? error.name : 'UnknownError', leadId: String(doc._id) });
        }

        return NextResponse.json({ success: true, leadId: String(doc._id) }, { status: existing ? 200 : 201 });
    } catch (error) {
        console.error('assistant.intake_failed', { errorType: error instanceof Error ? error.name : 'UnknownError' });
        return NextResponse.json({ success: false, error: 'Unable to save call intake' }, { status: 500 });
    }
}
