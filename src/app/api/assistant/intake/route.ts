import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { initMongoDB } from '@/app/db/initDb';
import { ContactRequestModel } from '@/app/db/models/ContactRequest';

type AssistantIntakePayload = {
    name?: unknown;
    callerName?: unknown;
    phone?: unknown;
    customerNumber?: unknown;
    email?: unknown;
    location?: unknown;
    city?: unknown;
    address?: unknown;
    service?: unknown;
    projectType?: unknown;
    intent?: unknown;
    route?: unknown;
    summary?: unknown;
    description?: unknown;
    message?: unknown;
    transcript?: unknown;
    timeline?: unknown;
    callSid?: unknown;
    callId?: unknown;
    vapiCallId?: unknown;
    recordingUrl?: unknown;
    recordingSid?: unknown;
    durationSeconds?: unknown;
    leadSource?: unknown;
    approximateArea?: unknown;
    existingFlooring?: unknown;
    demolition?: unknown;
    materialSupply?: unknown;
    provider?: unknown;
};

function text(value: unknown, max = 4_000) {
    return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function secretsMatch(supplied: string, expected: string) {
    if (!supplied || !expected) return false;
    const a = Buffer.from(supplied);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
}

function authorized(req: NextRequest) {
    const bearer = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';
    const supplied = bearer || req.headers.get('x-assistant-secret') || '';

    // Keep backward compatibility with the original assistant secret, while also
    // allowing Vapi to reuse the same Bearer credential already configured for
    // the main Vapi webhook.
    return [process.env.ASSISTANT_WEBHOOK_SECRET || '', process.env.VAPI_WEBHOOK_SECRET || ''].some((expected) =>
        secretsMatch(supplied, expected),
    );
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

    const summary = text(body.summary) || text(body.description) || text(body.message);
    const transcript = text(body.transcript, 30_000);
    const phone = normalizePhone(text(body.phone, 30) || text(body.customerNumber, 30));
    const callSid = text(body.callSid, 120);
    const vapiCallId = text(body.vapiCallId, 120) || text(body.callId, 120);
    const recordingUrl = text(body.recordingUrl, 1_000);
    const durationNumber = Number(body.durationSeconds || 0);
    const callDurationSeconds = Number.isFinite(durationNumber) && durationNumber > 0 ? Math.round(durationNumber) : 0;
    const location = text(body.location, 120) || text(body.address, 120) || text(body.city, 120);
    const service = text(body.service, 80) || text(body.projectType, 80) || text(body.intent, 80) || 'LVP Flooring';
    const callerName = text(body.name, 120) || text(body.callerName, 120) || 'Phone caller';
    const timeline = text(body.timeline, 300);
    const route = text(body.route, 80);

    if (!summary && !transcript) {
        return NextResponse.json({ success: false, error: 'summary, description, message, or transcript is required' }, { status: 400 });
    }

    try {
        await initMongoDB();

        // Vapi can retry a tool call. Prefer its call id for dedupe, then fall back
        // to a Twilio CallSid if one is provided.
        const existing = vapiCallId
            ? await ContactRequestModel.findOne({ vapiCallId })
            : callSid
              ? await ContactRequestModel.findOne({ callSid })
              : null;

        const callSummary = [summary, timeline ? `Timeline: ${timeline}` : '', route ? `Route: ${route}` : '']
            .filter(Boolean)
            .join('\n');

        const values = {
            name: callerName,
            phone,
            email: text(body.email, 254).toLowerCase(),
            location,
            service,
            message: callSummary || transcript.slice(0, 4_000),
            consent: false,
            leadSource: text(body.leadSource, 120) || 'Henry Vapi Phone Assistant',
            approximateArea: text(body.approximateArea, 80),
            existingFlooring: text(body.existingFlooring, 80),
            demolition: text(body.demolition, 40),
            materialSupply: text(body.materialSupply, 120),
            sourceType: 'vapi_phone_assistant',
            callSid,
            vapiCallId,
            callSummary,
            callTranscript: transcript,
            recordingUrl,
            recordingSid: text(body.recordingSid, 120),
            callDurationSeconds,
        };

        const doc = existing
            ? await ContactRequestModel.findByIdAndUpdate(existing._id, { $set: values }, { new: true })
            : await ContactRequestModel.create(values);

        if (!doc) throw new Error('Unable to save phone lead');

        // Keep the tool response tiny and immediate so the assistant can move
        // directly to end_call_after_message instead of stalling on the call.
        return NextResponse.json({ success: true, saved: true, leadId: String(doc._id) }, { status: 200 });
    } catch (error) {
        console.error('assistant.intake_failed', { errorType: error instanceof Error ? error.name : 'UnknownError' });
        return NextResponse.json({ success: false, error: 'Unable to save call intake' }, { status: 500 });
    }
}
