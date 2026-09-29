import { NextResponse } from 'next/server';
import { googleAdsSearch } from '@/lib/googleAds';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const expected = process.env.GOOGLE_ADS_API_SECRET;
  if (!expected) {
    return NextResponse.json({ error: 'GOOGLE_ADS_API_SECRET is not configured' }, { status: 503 });
  }
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await googleAdsSearch(`
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.advertising_channel_type,
        campaign_budget.amount_micros
      FROM campaign
      ORDER BY campaign.id
    `);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error('Google Ads API error', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Google Ads API request failed' },
      { status: 500 },
    );
  }
}
