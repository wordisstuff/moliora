import { googleServiceAccountAccessToken, requiredEnv } from '@/lib/googleServiceAccount';

const DATA_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
const ADMIN_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';

function propertyName() {
  const raw = requiredEnv('GA4_PROPERTY_ID').replace(/^properties\//, '');
  return `properties/${raw}`;
}

async function googleJson(url: string, init: RequestInit = {}, scopes = [DATA_SCOPE]) {
  const token = await googleServiceAccountAccessToken(scopes);
  const response = await fetch(url, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`Google Analytics API failed (${response.status}): ${JSON.stringify(data)}`);
  return data;
}

export async function ga4RunReport(args: {
  days: number;
  dimensions?: string[];
  metrics?: string[];
  limit?: number;
}) {
  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - Math.max(0, args.days - 1));

  const body = {
    dateRanges: [{ startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10) }],
    dimensions: (args.dimensions || ['eventName']).map(name => ({ name })),
    metrics: (args.metrics || ['eventCount']).map(name => ({ name })),
    limit: Math.min(Math.max(args.limit || 100, 1), 1000),
    keepEmptyRows: false,
  };

  return googleJson(
    `https://analyticsdata.googleapis.com/v1beta/${propertyName()}:runReport`,
    { method: 'POST', body: JSON.stringify(body) },
  );
}

export async function ga4RunRealtimeReport(args: {
  dimensions?: string[];
  metrics?: string[];
  limit?: number;
}) {
  const body = {
    dimensions: (args.dimensions || ['eventName']).map(name => ({ name })),
    metrics: (args.metrics || ['eventCount']).map(name => ({ name })),
    limit: Math.min(Math.max(args.limit || 100, 1), 1000),
  };

  return googleJson(
    `https://analyticsdata.googleapis.com/v1beta/${propertyName()}:runRealtimeReport`,
    { method: 'POST', body: JSON.stringify(body) },
  );
}

export async function ga4ListKeyEvents() {
  return googleJson(
    `https://analyticsadmin.googleapis.com/v1beta/${propertyName()}/keyEvents?pageSize=200`,
    { method: 'GET' },
    [ADMIN_SCOPE],
  );
}
