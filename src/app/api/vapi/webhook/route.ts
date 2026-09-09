import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { initMongoDB } from '@/app/db/initDb';
import { ContactRequestModel } from '@/app/db/models/ContactRequest';

type AnyRecord = Record<string, unknown>;

function record(value: unknown): AnyRecord {
    return value && typeof value === 'object' && !Array.isArray(value) ? value as AnyRecord : {};
}

function text(value: unknown, max = 30_000) {
    return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function numberValue(value: unknown) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}

function secureEqual(a: string, b: string) {
    const left = Buffer.from(a);
    const right = Buffer.from(b);
    return left.length === right.length && timingSafeEqual(left, right);
}

function authorized(req: NextRequest) {
    const expected = process.env.VAPI_WEBHOOK_SECRET || '';
    if (!expected) return false;
    const bearer = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';
    const supplied = bearer || req.headers.get('x-vapi-secret') || '';
    return secureEqual(supplied, expected);
}

function normalizePhone(value: string) {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
    return value.slice(0, 30);
}

function firstText(...values: unknown[]) {
    for (const value of values) {
        const result = text(value, 4_000);
        if (result) return result;
    }
    return '';
}

function durationSeconds(message: AnyRecord, call: AnyRecord) {
    const direct = numberValue(message.durationSeconds) || numberValue(call.durationSeconds);
    if (direct > 0) return Math.round(direct);

    const startedAt = Date.parse(text(message.startedAt) || text(call.startedAt));
    const endedAt = Date.parse(text(message.endedAt) || text(call.endedAt));
    if (Number.isFinite(startedAt) && Number.isFinite(endedAt) && endedAt > startedAt) {
        return Math.round((endedAt - startedAt) / 1000);
    }
    return 0;
}

export async function POST(req: NextRequest) {
    if (!authorized(req)) return NextResponse.json({ ok: false }, { status: 401 });

    let body: AnyRecord;
    try {
        body = record(await req.json());
    } catch {
        return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
    }

    const message = record(body.message);
    if (text(message.type) !== 'end-of-call-report') {
        return NextResponse.json({ ok: true, ignored: true });
    }

    const call = record(message.call);
    const artifact = record(message.artifact);
    const analysis = record(message.analysis);
    const structured = record(analysis.structuredData);
    const customer = record(call.customer);

    const vapiCallId = firstText(call.id, message.callId, body.callId);
    if (!vapiCallId) return NextResponse.json({ ok: false, error: 'Missing Vapi call id' }, { status: 400 });

    const transcript = firstText(artifact.transcript, message.transcript, call.transcript);
    const summary = firstText(analysis.summary, structured.summary, message.summary, transcript.slice(0, 2_200));
    const phone = normalizePhone(firstText(customer.number, customer.phoneNumber, message.customerNumber));

    const name = firstText(structured.name, structured.customerName, customer.name) || 'Phone caller';
    const email = firstText(structured.email, structured.customerEmail).toLowerCase();
    const location = firstText(structured.location, structured.city, structured.zip, structured.zipCode);
    const service = firstText(structured.service, structured.projectType);
    const approximateArea = firstText(structured.approximateArea, structured.area, structured.squareFeet, structured.sqft);
    const existingFlooring = firstText(structured.existingFlooring, structured.existingFloor);
    const demolition = firstText(structured.demolition, structured.removalNeeded, structured.removal);
    const materialSupply = firstText(structured.materialSupply, structured.material, structured.materials);
    const recording = firstText(record(artifact.recording).url, artifact.recording, message.recordingUrl);

    try {
        await initMongoDB();

        const existing = await ContactRequestModel.findOne({ vapiCallId });
        const values = {
            name,
            phone,
            email,
            location,
            service,
            message: summary || transcript || 'Vapi phone call completed.',
            consent: false,
            leadSource: 'Henry Vapi Phone Assistant',
            sourceType: 'vapi_phone_assistant',
            vapiCallId,
            callSummary: summary,
            callTranscript: transcript,
            recordingUrl: recording,
            callDurationSeconds: durationSeconds(message, call),
            approximateArea,
            existingFlooring,
            demolition,
            materialSupply,
        };

        const doc = existing
            ? await ContactRequestModel.findByIdAndUpdate(existing._id, { $set: values }, { new: true })
            : await ContactRequestModel.create(values);

        return NextResponse.json({ ok: true, leadId: doc ? String(doc._id) : null, created: !existing });
    } catch (error) {
        console.error('vapi.end_of_call_failed', {
            errorType: error instanceof Error ? error.name : 'UnknownError',
            vapiCallId,
        });
        return NextResponse.json({ ok: false, error: 'Unable to save Vapi call' }, { status: 500 });
    }
}
