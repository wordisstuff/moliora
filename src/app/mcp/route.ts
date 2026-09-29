import { NextResponse } from 'next/server';
import { googleAdsSearch } from '@/lib/googleAds';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RpcRequest = { jsonrpc?: string; id?: string | number | null; method?: string; params?: { name?: string; arguments?: Record<string, unknown> } };

const protocolVersion = '2025-06-18';

const tools = [
  {
    name: 'get_campaigns',
    description: 'List Moliora Google Ads campaigns with status, channel, budget and recent performance.',
    inputSchema: {
      type: 'object',
      properties: { days: { type: 'integer', minimum: 1, maximum: 90, default: 30 } },
      additionalProperties: false,
    },
  },
  {
    name: 'get_keywords',
    description: 'List Google Ads keywords with match type, status, CPC bid and recent performance.',
    inputSchema: {
      type: 'object',
      properties: { days: { type: 'integer', minimum: 1, maximum: 90, default: 30 } },
      additionalProperties: false,
    },
  },
  {
    name: 'get_search_terms',
    description: 'Return actual Google search terms that triggered Moliora ads with recent performance.',
    inputSchema: {
      type: 'object',
      properties: { days: { type: 'integer', minimum: 1, maximum: 90, default: 30 } },
      additionalProperties: false,
    },
  },
  {
    name: 'get_account_performance',
    description: 'Return account-level Google Ads clicks, impressions, cost, conversions and conversion value.',
    inputSchema: {
      type: 'object',
      properties: { days: { type: 'integer', minimum: 1, maximum: 90, default: 30 } },
      additionalProperties: false,
    },
  },
] as const;

function rpc(id: RpcRequest['id'], result: unknown) {
  return NextResponse.json({ jsonrpc: '2.0', id: id ?? null, result });
}

function rpcError(id: RpcRequest['id'], code: number, message: string) {
  return NextResponse.json({ jsonrpc: '2.0', id: id ?? null, error: { code, message } });
}

function authorized(request: Request) {
  const secret = process.env.GOOGLE_ADS_API_SECRET;
  return Boolean(secret && request.headers.get('authorization') === `Bearer ${secret}`);
}

function daysArg(args?: Record<string, unknown>) {
  const raw = Number(args?.days ?? 30);
  return Number.isInteger(raw) && raw >= 1 && raw <= 90 ? raw : 30;
}

function dateClause(days: number) {
  return `segments.date DURING LAST_${days}_DAYS`;
}

async function callTool(name: string, args?: Record<string, unknown>) {
  const days = daysArg(args);
  let query: string;

  switch (name) {
    case 'get_campaigns':
      query = `
        SELECT campaign.id, campaign.name, campaign.status,
          campaign.advertising_channel_type, campaign_budget.amount_micros,
          metrics.impressions, metrics.clicks, metrics.cost_micros,
          metrics.conversions, metrics.conversions_value
        FROM campaign
        WHERE ${dateClause(days)}
        ORDER BY metrics.cost_micros DESC
      `;
      break;
    case 'get_keywords':
      query = `
        SELECT campaign.name, ad_group.name, ad_group_criterion.keyword.text,
          ad_group_criterion.keyword.match_type, ad_group_criterion.status,
          ad_group_criterion.effective_cpc_bid_micros,
          metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions
        FROM keyword_view
        WHERE ${dateClause(days)}
        ORDER BY metrics.cost_micros DESC
      `;
      break;
    case 'get_search_terms':
      query = `
        SELECT campaign.name, ad_group.name, search_term_view.search_term,
          search_term_view.status, metrics.impressions, metrics.clicks,
          metrics.cost_micros, metrics.conversions
        FROM search_term_view
        WHERE ${dateClause(days)}
        ORDER BY metrics.cost_micros DESC
      `;
      break;
    case 'get_account_performance':
      query = `
        SELECT customer.id, customer.descriptive_name, metrics.impressions,
          metrics.clicks, metrics.cost_micros, metrics.conversions,
          metrics.conversions_value
        FROM customer
        WHERE ${dateClause(days)}
      `;
      break;
    default:
      throw new Error(`Unknown tool: ${name}`);
  }

  const data = await googleAdsSearch(query);
  return {
    content: [{ type: 'text', text: JSON.stringify(data) }],
    structuredContent: { days, data },
  };
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'authorization, content-type, mcp-protocol-version',
    },
  });
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      {
        status: 401,
        headers: { 'WWW-Authenticate': 'Bearer realm="Moliora Google Ads MCP"' },
      },
    );
  }

  let body: RpcRequest;
  try {
    body = await request.json();
  } catch {
    return rpcError(null, -32700, 'Parse error');
  }

  if (body.method === 'initialize') {
    return rpc(body.id, {
      protocolVersion,
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: 'moliora-google-ads', version: '0.1.0' },
    });
  }

  if (body.method === 'notifications/initialized') {
    return new Response(null, { status: 202 });
  }

  if (body.method === 'ping') return rpc(body.id, {});

  if (body.method === 'tools/list') return rpc(body.id, { tools });

  if (body.method === 'tools/call') {
    const name = body.params?.name;
    if (!name) return rpcError(body.id, -32602, 'Missing tool name');
    try {
      return rpc(body.id, await callTool(name, body.params?.arguments));
    } catch (error) {
      return rpc(body.id, {
        content: [{ type: 'text', text: error instanceof Error ? error.message : 'Tool call failed' }],
        isError: true,
      });
    }
  }

  return rpcError(body.id, -32601, 'Method not found');
}
