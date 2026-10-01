import { NextResponse } from 'next/server';
import { canonicalResource, exchangeAuthorizationCode, MCP_RESOURCE, validChatGPTClient, validRedirectUri } from '@/lib/mcpOAuth';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  const form = await request.formData();
  const grantType = String(form.get('grant_type') || '');
  const code = String(form.get('code') || '');
  const verifier = String(form.get('code_verifier') || '');
  const clientId = String(form.get('client_id') || '');
  const redirectUri = String(form.get('redirect_uri') || '');
  const resource = String(form.get('resource') || MCP_RESOURCE);
  if (grantType !== 'authorization_code' || !code || !verifier || !validChatGPTClient(clientId) ||
      !validRedirectUri(redirectUri, clientId) || canonicalResource(resource) !== MCP_RESOURCE) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }
  const token = exchangeAuthorizationCode(code, verifier, clientId, redirectUri, resource);
  if (!token) return NextResponse.json({ error: 'invalid_grant' }, { status: 400 });
  return NextResponse.json(token, { headers: { 'Cache-Control': 'no-store' } });
}
