import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { initMongoDB } from '@/app/db/initDb';
import { ContactRequestModel } from '@/app/db/models/ContactRequest';

function text(value: unknown, max = 1_000) {
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

export async function POST(req: NextRequest) {
    if (!authorized(req)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    let body: Record<string, unknown> = {};
    const contentType = req.headers.get('content-type') || '';
    try {
        if (contentType.includes('application/json')) {
            body = (await req.json()) as Record<string, unknown>;
        } else {
            const form = await req.formData();
            body = Object.fromEntries(form.entries());
        }
    } catch {
        return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const leadId = text(body.leadId, 100);
    const callSid = text(body.callSid ?? body.CallSid, 120);
    const recordingUrl = text(body.recordingUrl ?? body.RecordingUrl, 1_000);
    const recordingSid = text(body.recordingSid ?? body.RecordingSid, 120);
    const durationRaw = body.durationSeconds ?? body.RecordingDuration ?? 0;
    const duration = Number(durationRaw);

    if ((!leadId && !callSid) || !recordingUrl) {
        return NextResponse.json({ success: false, error: 'leadId or callSid, plus recordingUrl, are required' }, { status: 400 });
    }

    try {
        await initMongoDB();
        const query = leadId ? { _id: leadId } : { callSid };
        const doc = await ContactRequestModel.findOneAndUpdate(
            query,
            {
                $set: {
                    recordingUrl,
                    recordingSid,
                    ...(Number.isFinite(duration) && duration > 0 ? { callDurationSeconds: Math.round(duration) } : {}),
                },
            },
            { new: true },
        );

        if (!doc) return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
        return NextResponse.json({ success: true, leadId: String(doc._id) });
    } catch (error) {
        console.error('assistant.recording_update_failed', { errorType: error instanceof Error ? error.name : 'UnknownError' });
        return NextResponse.json({ success: false, error: 'Unable to update recording' }, { status: 500 });
    }
}
