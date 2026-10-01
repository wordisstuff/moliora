import { NextResponse } from 'next/server';
import { googleAdsMutate, googleAdsSearch } from '@/lib/googleAds';
import { MCP_SCOPE, validAccessToken } from '@/lib/mcpOAuth';

export const runtime='nodejs'; export const dynamic='force-dynamic';
type RpcRequest={jsonrpc?:string;id?:string|number|null;method?:string;params?:{name?:string;arguments?:Record<string,unknown>}};
const protocolVersion='2025-06-18';
const daysInput={type:'integer',minimum:1,maximum:90,default:30};
const oauth=[{type:'oauth2',scopes:[MCP_SCOPE]}] as const;
const writeAnnotations={readOnlyHint:false,destructiveHint:true,idempotentHint:false,openWorldHint:true};
const tools=[
{name:'get_campaigns',description:'List campaigns with resource names, status, budget and recent performance.',inputSchema:{type:'object',properties:{days:daysInput},additionalProperties:false},securitySchemes:oauth,annotations:{readOnlyHint:true}},
{name:'get_keywords',description:'List keywords with campaign/ad group/criterion resource names, status, CPC bid and recent performance.',inputSchema:{type:'object',properties:{days:daysInput},additionalProperties:false},securitySchemes:oauth,annotations:{readOnlyHint:true}},
{name:'get_search_terms',description:'Return actual search terms that triggered ads with recent performance.',inputSchema:{type:'object',properties:{days:daysInput},additionalProperties:false},securitySchemes:oauth,annotations:{readOnlyHint:true}},
{name:'get_account_performance',description:'Return account clicks, impressions, cost, conversions and conversion value.',inputSchema:{type:'object',properties:{days:daysInput},additionalProperties:false},securitySchemes:oauth,annotations:{readOnlyHint:true}},
{name:'get_conversion_actions',description:'Inspect Google Ads conversion actions, status, category, origin and counting settings.',inputSchema:{type:'object',properties:{},additionalProperties:false},securitySchemes:oauth,annotations:{readOnlyHint:true}},
{name:'set_keyword_cpc',description:'CHANGE a keyword max CPC bid. This modifies live Google Ads and should require user approval.',inputSchema:{type:'object',required:['criterion_resource_name','cpc_dollars'],properties:{criterion_resource_name:{type:'string'},cpc_dollars:{type:'number',minimum:0.01,maximum:100}},additionalProperties:false},securitySchemes:oauth,annotations:writeAnnotations},
{name:'set_keyword_status',description:'ENABLE or PAUSE a live keyword. This modifies live Google Ads and should require user approval.',inputSchema:{type:'object',required:['criterion_resource_name','status'],properties:{criterion_resource_name:{type:'string'},status:{type:'string',enum:['ENABLED','PAUSED']}},additionalProperties:false},securitySchemes:oauth,annotations:writeAnnotations},
{name:'add_campaign_negative_keyword',description:'Add a negative keyword to a live campaign. This modifies live Google Ads and should require user approval.',inputSchema:{type:'object',required:['campaign_resource_name','text','match_type'],properties:{campaign_resource_name:{type:'string'},text:{type:'string',minLength:1,maxLength:80},match_type:{type:'string',enum:['BROAD','PHRASE','EXACT']}},additionalProperties:false},securitySchemes:oauth,annotations:writeAnnotations},
{name:'set_campaign_status',description:'ENABLE or PAUSE a live campaign. This modifies live Google Ads and should require user approval.',inputSchema:{type:'object',required:['campaign_resource_name','status'],properties:{campaign_resource_name:{type:'string'},status:{type:'string',enum:['ENABLED','PAUSED']}},additionalProperties:false},securitySchemes:oauth,annotations:writeAnnotations},
{name:'set_campaign_daily_budget',description:'Change a live campaign daily budget in dollars. This modifies live Google Ads and should require user approval.',inputSchema:{type:'object',required:['budget_resource_name','daily_budget_dollars'],properties:{budget_resource_name:{type:'string'},daily_budget_dollars:{type:'number',minimum:1,maximum:10000}},additionalProperties:false},securitySchemes:oauth,annotations:writeAnnotations}
] as const;

function rpc(id:RpcRequest['id'],result:unknown){return NextResponse.json({jsonrpc:'2.0',id:id??null,result});}
function rpcError(id:RpcRequest['id'],code:number,message:string){return NextResponse.json({jsonrpc:'2.0',id:id??null,error:{code,message}});}
function token(request:Request){const h=request.headers.get('authorization');return h?.startsWith('Bearer ')?h.slice(7):null;}
function challenge(){return `Bearer resource_metadata="https://www.moliora.us/.well-known/oauth-protected-resource", scope="${MCP_SCOPE}"`;}
function daysArg(args?:Record<string,unknown>){const raw=Number(args?.days??30);return Number.isInteger(raw)&&raw>=1&&raw<=90?raw:30;}
function ymd(d:Date){return d.toISOString().slice(0,10);}
function dateClause(days:number){const end=new Date(),start=new Date(end);start.setUTCDate(start.getUTCDate()-Math.max(0,days-1));return `segments.date BETWEEN '${ymd(start)}' AND '${ymd(end)}'`;}
function str(args:Record<string,unknown>|undefined,key:string){const v=args?.[key];if(typeof v!=='string'||!v.trim())throw new Error(`Missing ${key}`);return v.trim();}
function dollars(args:Record<string,unknown>|undefined,key:string){const v=Number(args?.[key]);if(!Number.isFinite(v)||v<=0)throw new Error(`Invalid ${key}`);return v;}
function result(data:unknown,extra:Record<string,unknown>={}){return{content:[{type:'text',text:JSON.stringify(data)}],structuredContent:{...extra,data}};}

async function callTool(name:string,args?:Record<string,unknown>){
 const days=daysArg(args); let query:string|undefined;
 switch(name){
 case 'get_campaigns':query=`SELECT campaign.resource_name, campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type, campaign_budget.resource_name, campaign_budget.amount_micros, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.conversions_value FROM campaign WHERE ${dateClause(days)} ORDER BY metrics.cost_micros DESC`;break;
 case 'get_keywords':query=`SELECT campaign.resource_name, campaign.name, ad_group.resource_name, ad_group.name, ad_group_criterion.resource_name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, ad_group_criterion.status, ad_group_criterion.effective_cpc_bid_micros, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM keyword_view WHERE ${dateClause(days)} ORDER BY metrics.cost_micros DESC`;break;
 case 'get_search_terms':query=`SELECT campaign.resource_name, campaign.name, ad_group.resource_name, ad_group.name, search_term_view.search_term, search_term_view.status, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM search_term_view WHERE ${dateClause(days)} ORDER BY metrics.cost_micros DESC`;break;
 case 'get_account_performance':query=`SELECT customer.id, customer.descriptive_name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.conversions_value FROM customer WHERE ${dateClause(days)}`;break;
 case 'get_conversion_actions':query='SELECT conversion_action.resource_name, conversion_action.name, conversion_action.status, conversion_action.type, conversion_action.category, conversion_action.origin, conversion_action.primary_for_goal, conversion_action.counting_type FROM conversion_action ORDER BY conversion_action.name';break;
 case 'set_keyword_cpc':{const rn=str(args,'criterion_resource_name'),micros=Math.round(dollars(args,'cpc_dollars')*1e6);return result(await googleAdsMutate('adGroupCriteria',{operations:[{update:{resourceName:rn,cpcBidMicros:String(micros)},updateMask:'cpcBidMicros'}]}),{changed:true});}
 case 'set_keyword_status':{const rn=str(args,'criterion_resource_name'),status=str(args,'status');if(!['ENABLED','PAUSED'].includes(status))throw new Error('Invalid status');return result(await googleAdsMutate('adGroupCriteria',{operations:[{update:{resourceName:rn,status},updateMask:'status'}]}),{changed:true});}
 case 'add_campaign_negative_keyword':{const campaign=str(args,'campaign_resource_name'),text=str(args,'text'),matchType=str(args,'match_type');if(!['BROAD','PHRASE','EXACT'].includes(matchType))throw new Error('Invalid match_type');return result(await googleAdsMutate('campaignCriteria',{operations:[{create:{campaign,negative:true,keyword:{text,matchType}}}]}),{changed:true});}
 case 'set_campaign_status':{const rn=str(args,'campaign_resource_name'),status=str(args,'status');if(!['ENABLED','PAUSED'].includes(status))throw new Error('Invalid status');return result(await googleAdsMutate('campaigns',{operations:[{update:{resourceName:rn,status},updateMask:'status'}]}),{changed:true});}
 case 'set_campaign_daily_budget':{const rn=str(args,'budget_resource_name'),micros=Math.round(dollars(args,'daily_budget_dollars')*1e6);return result(await googleAdsMutate('campaignBudgets',{operations:[{update:{resourceName:rn,amountMicros:String(micros)},updateMask:'amountMicros'}]}),{changed:true});}
 default:throw new Error(`Unknown tool: ${name}`);
 }
 const data=await googleAdsSearch(query);return result(data,{days});
}
export async function OPTIONS(){return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'authorization, content-type, mcp-protocol-version'}});}
export async function POST(request:Request){
 let body:RpcRequest;try{body=await request.json();}catch{return rpcError(null,-32700,'Parse error');}
 if(body.method==='initialize')return rpc(body.id,{protocolVersion,capabilities:{tools:{listChanged:false}},serverInfo:{name:'moliora-google-ads',version:'0.3.0'}});
 if(body.method==='notifications/initialized')return new Response(null,{status:202});
 if(body.method==='ping')return rpc(body.id,{});
 if(body.method==='tools/list')return rpc(body.id,{tools});
 if(body.method==='tools/call'){
  if(!validAccessToken(token(request)))return rpc(body.id,{content:[{type:'text',text:'Authentication required.'}],_meta:{'mcp/www_authenticate':[challenge()+', error="invalid_token", error_description="Authorize Moliora Google Ads to continue"']},isError:true});
  const name=body.params?.name;if(!name)return rpcError(body.id,-32602,'Missing tool name');
  try{return rpc(body.id,await callTool(name,body.params?.arguments));}catch(error){return rpc(body.id,{content:[{type:'text',text:error instanceof Error?error.message:'Tool call failed'}],isError:true});}
 }
 return rpcError(body.id,-32601,'Method not found');
}
