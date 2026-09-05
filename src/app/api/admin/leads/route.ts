import { NextRequest, NextResponse } from 'next/server';
import { initMongoDB } from '@/app/db/initDb';
import { ContactRequestModel, LEAD_STATUSES } from '@/app/db/models/ContactRequest';

function authorized(req: NextRequest) {
    const expected = process.env.ADMIN_CRM_KEY;
    if (!expected) return false;
    const supplied = req.headers.get('x-admin-key') || req.nextUrl.searchParams.get('key');
    return supplied === expected;
}

export async function GET(req: NextRequest) {
    if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await initMongoDB();
    const leads = await ContactRequestModel.find({ service: 'LVP Flooring' }).sort({ createdAt: -1 }).limit(250).select('-ip -userAgent').lean();
    return NextResponse.json({ leads });
}

export async function PATCH(req: NextRequest) {
    if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json() as { id?: string; status?: string; estimatedValue?: number; finalJobValue?: number; notes?: string };
    if (!body.id) return NextResponse.json({ error: 'Lead id is required.' }, { status: 400 });
    if (body.status && !LEAD_STATUSES.includes(body.status as (typeof LEAD_STATUSES)[number])) return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });

    await initMongoDB();
    const previous = await ContactRequestModel.findById(body.id).lean();
    if (!previous) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });

    const update: Record<string, unknown> = { statusUpdatedAt: new Date() };
    if (body.status) update.status = body.status;
    if (typeof body.estimatedValue === 'number' && body.estimatedValue >= 0) update.estimatedValue = body.estimatedValue;
    if (typeof body.finalJobValue === 'number' && body.finalJobValue >= 0) update.finalJobValue = body.finalJobValue;
    if (typeof body.notes === 'string') update.notes = body.notes.slice(0, 4000);
    if (body.status === 'Won' && previous.status !== 'Won') update.wonAt = new Date();
    if (body.status === 'Lost' && previous.status !== 'Lost') update.lostAt = new Date();

    const lead = await ContactRequestModel.findByIdAndUpdate(body.id, { $set: update }, { new: true }).select('-ip -userAgent').lean();
    if (!lead) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });

    // The browser sends these events to GA4 when Henry moves a lead through the CRM.
    // GCLID remains stored on the record for future Google Ads offline conversion import.
    const conversionEvent = body.status && body.status !== previous.status ? ({
        Qualified: 'qualified_lead',
        'Estimate Scheduled': 'estimate_scheduled',
        'Estimate Sent': 'estimate_sent',
        Won: 'won_job',
        Lost: 'lost_lead',
    } as Record<string, string>)[body.status] : undefined;

    return NextResponse.json({ lead, conversionEvent });
}
