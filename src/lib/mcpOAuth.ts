import { createHash, createHmac, timingSafeEqual } from 'crypto';

export const MCP_RESOURCE = 'https://www.moliora.us/mcp';
export const OAUTH_ISSUER = 'https://www.moliora.us';
export const MCP_SCOPE = 'google_ads.read';

function secret() {
  const value = process.env.GOOGLE_ADS_API_SECRET;
  if (!value) throw new Error('GOOGLE_ADS_API_SECRET is not configured');
  return value;
}

function b64(value: string | Buffer) {
  return Buffer.from(value).toString('base64url');
}

function sign(payload: Record<string, unknown>) {
  const body = b64(JSON.stringify(payload));
  const signature = createHmac('sha256', secret()).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function verify(token: string): Record<string, unknown> | null {
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  const expected = createHmac('sha256', secret()).update(body).digest();
  let actual: Buffer;
  try { actual = Buffer.from(signature, 'base64url'); } catch { return null; }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as Record<string, unknown>;
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch { return null; }
}

export function validChatGPTClient(clientId: string) {
  return /^https:\/\/chatgpt\.com\/oauth\/(?:client|[A-Za-z0-9_-]+\/client)\.json$/.test(clientId);
}

export function validRedirectUri(uri: string) {
  return uri === 'https://chatgpt.com/connector_platform_oauth_redirect' ||
    /^https:\/\/chatgpt\.com\/connector\/oauth\/[A-Za-z0-9_-]+$/.test(uri);
}

export function issueAuthorizationCode(input: {
  clientId: string; redirectUri: string; codeChallenge: string; resource: string; scope: string;
}) {
  return sign({ typ: 'code', ...input, exp: Math.floor(Date.now() / 1000) + 300 });
}

export function exchangeAuthorizationCode(code: string, verifier: string, clientId: string, redirectUri: string, resource: string) {
  const payload = verify(code);
  if (!payload || payload.typ !== 'code') return null;
  if (payload.clientId !== clientId || payload.redirectUri !== redirectUri || payload.resource !== resource) return null;
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  if (challenge !== payload.codeChallenge) return null;
  const now = Math.floor(Date.now() / 1000);
  return {
    access_token: sign({ typ: 'access', aud: MCP_RESOURCE, scope: MCP_SCOPE, iat: now, exp: now + 3600 }),
    token_type: 'Bearer',
    expires_in: 3600,
    scope: MCP_SCOPE,
  };
}

export function validAccessToken(token: string | null) {
  if (!token) return false;
  const payload = verify(token);
  return Boolean(payload && payload.typ === 'access' && payload.aud === MCP_RESOURCE &&
    typeof payload.scope === 'string' && payload.scope.split(' ').includes(MCP_SCOPE));
}

export function constantTimeSecretEquals(candidate: string) {
  const a = Buffer.from(candidate);
  const b = Buffer.from(secret());
  return a.length === b.length && timingSafeEqual(a, b);
}
