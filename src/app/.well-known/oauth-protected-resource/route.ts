import { NextResponse } from 'next/server';
import { MCP_RESOURCE, MCP_SCOPE, OAUTH_ISSUER } from '@/lib/mcpOAuth';
export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({
    resource: MCP_RESOURCE,
    authorization_servers: [OAUTH_ISSUER],
    scopes_supported: [MCP_SCOPE],
    resource_documentation: 'https://www.moliora.us',
  });
}
