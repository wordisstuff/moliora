import { NextResponse } from 'next/server';
import { MCP_SCOPE, OAUTH_ISSUER } from '@/lib/mcpOAuth';
export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({
    issuer: OAUTH_ISSUER,
    authorization_response_iss_parameter_supported: true,
    authorization_endpoint: `${OAUTH_ISSUER}/oauth/authorize`,
    token_endpoint: `${OAUTH_ISSUER}/oauth/token`,
    client_id_metadata_document_supported: true,
    token_endpoint_auth_methods_supported: ['none'],
    code_challenge_methods_supported: ['S256'],
    scopes_supported: [MCP_SCOPE],
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code'],
  });
}
