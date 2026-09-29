import { createSign } from 'crypto';

const ADS_SCOPE = 'https://www.googleapis.com/auth/adwords';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const ADS_API_VERSION = 'v25';

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function base64url(value: string | Buffer) {
  return Buffer.from(value).toString('base64url');
}

async function accessToken() {
  const email = env('GOOGLE_ADS_CLIENT_EMAIL');
  const privateKey = env('GOOGLE_ADS_PRIVATE_KEY').replace(/\\n/g, '\n');
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(JSON.stringify({
    iss: email,
    scope: ADS_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${claim}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const assertion = `${unsigned}.${signer.sign(privateKey).toString('base64url')}`;

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    cache: 'no-store',
  });

  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw new Error(`Google OAuth failed: ${JSON.stringify(data)}`);
  }
  return data.access_token as string;
}

export async function googleAdsSearch(query: string) {
  const customerId = env('GOOGLE_ADS_CUSTOMER_ID').replace(/-/g, '');
  const token = await accessToken();
  const response = await fetch(
    `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${customerId}/googleAds:searchStream`,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Google Ads API failed (${response.status}): ${JSON.stringify(data)}`);
  }
  return data;
}
