import { NextResponse } from 'next/server';
import { canonicalResource, constantTimeSecretEquals, issueAuthorizationCode, MCP_RESOURCE, MCP_SCOPE, OAUTH_ISSUER, validChatGPTClient, validRedirectUri } from '@/lib/mcpOAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = { clientId: string; redirectUri: string; state: string; challenge: string; resource: string; scope: string };

function read(url: URL): Params | null {
  const p = {
    clientId: url.searchParams.get('client_id') || '',
    redirectUri: url.searchParams.get('redirect_uri') || '',
    state: url.searchParams.get('state') || '',
    challenge: url.searchParams.get('code_challenge') || '',
    resource: url.searchParams.get('resource') || '',
    scope: url.searchParams.get('scope') || MCP_SCOPE,
  };
  if (url.searchParams.get('response_type') !== 'code' || url.searchParams.get('code_challenge_method') !== 'S256') return null;
  if (!validChatGPTClient(p.clientId) || !validRedirectUri(p.redirectUri) || canonicalResource(p.resource) !== MCP_RESOURCE || !p.challenge) return null;
  return p;
}

function page(p: Params, error = '') {
  const hidden = Object.entries(p).map(([k,v]) => `<input type="hidden" name="${k}" value="${escapeHtml(v)}">`).join('');
  return new Response(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Connect Moliora Google Ads</title><style>body{font-family:system-ui;max-width:520px;margin:60px auto;padding:20px;background:#111;color:#fff}input,button{box-sizing:border-box;width:100%;padding:14px;margin:8px 0;border-radius:10px;border:1px solid #555}button{background:#ff7a00;color:white;font-weight:700;border:0}.muted{color:#aaa}.err{color:#ff8a8a}</style></head><body><h1>Connect Moliora Google Ads</h1><p>This grants ChatGPT read-only access to your Moliora Google Ads reporting tools.</p><p class="muted">Enter the same private API secret already stored in Vercel. It is checked by Moliora and is not sent to ChatGPT.</p>${error ? `<p class="err">${escapeHtml(error)}</p>` : ''}<form method="post">${hidden}<input type="password" name="secret" autocomplete="current-password" placeholder="Moliora API secret" required><button type="submit">Authorize ChatGPT</button></form></body></html>`, { headers: { 'content-type':'text/html; charset=utf-8','cache-control':'no-store' }});
}
function escapeHtml(s:string){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c));}

export async function GET(request: Request) {
  const p = read(new URL(request.url));
  if (!p) return new Response('Invalid OAuth request', { status: 400 });
  return page(p);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const p: Params = {
    clientId:String(form.get('clientId')||''), redirectUri:String(form.get('redirectUri')||''),
    state:String(form.get('state')||''), challenge:String(form.get('challenge')||''),
    resource:String(form.get('resource')||''), scope:String(form.get('scope')||MCP_SCOPE),
  };
  if (!validChatGPTClient(p.clientId) || !validRedirectUri(p.redirectUri) || canonicalResource(p.resource) !== MCP_RESOURCE || !p.challenge) return new Response('Invalid OAuth request', { status:400 });
  const supplied = String(form.get('secret') || '');
  if (!constantTimeSecretEquals(supplied)) return page(p, 'Incorrect secret.');
  const code = issueAuthorizationCode({ clientId:p.clientId, redirectUri:p.redirectUri, codeChallenge:p.challenge, resource:p.resource, scope:p.scope });
  const redirect = new URL(p.redirectUri);
  redirect.searchParams.set('code', code);
  if (p.state) redirect.searchParams.set('state', p.state);
  redirect.searchParams.set('iss', OAUTH_ISSUER);
  return NextResponse.redirect(redirect);
}
