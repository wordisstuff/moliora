import { NextResponse } from 'next/server';
import { googleAdsMutate, googleAdsSearch } from '@/lib/googleAds';
import { ga4ListKeyEvents, ga4RunRealtimeReport, ga4RunReport } from '@/lib/googleAnalyticsApi';
import { gtmSnapshot } from '@/lib/googleTagManagerApi';
import { inspectTrackingPage } from '@/lib/trackingDiagnostics';
import { MCP_SCOPE, validAccessToken } from '@/lib/mcpOAuth';

export const runtime='nodejs'; export const dynamic='force-dynamic';
type RpcRequest={jsonrpc?:string;id?:string|number|null;method?:string;params?:{name?:string;arguments?:Record<string,unknown>}};
const protocolVersion='2025-06-18';
const daysInput={type:'integer',minimum:1,maximum:90,default:30};
const stringArray={type:'array',items:{type:'string',minLength:1,maxLength:100},maxItems:10};
const oauth=[{type:'oauth2',scopes:[MCP_SCOPE]}] as const;
const readAnnotations={readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:true};
const writeAnnotations={readOnlyHint:false,destructiveHint:true,idempotentHint:false,openWorldHint:true};
const tools=[
{name:'get_campaigns',description:'List campaigns with resource names, status, budget and recent performance.',inputSchema:{type:'object',properties:{days:daysInput},additionalProperties:false},securitySchemes:oauth,annotations:readAnnotations},
{name:'get_keywords',description:'List keywords with campaign/ad group/criterion resource names, status, CPC bid and recent performance.',inputSchema:{type:'object',properties:{days:daysInput},additionalProperties:false},securitySchemes:oauth,annotations:readAnnotations},
{name:'get_search_terms',description:'Return actual search terms that triggered ads with recent performance.',inputSchema:{type:'object',properties:{days:daysInput},additionalProperties:false},securitySchemes:oauth,annotations:readAnnotations},
{name:'get_account_performance',description:'Return account clicks, impressions, cost, conversions and conversion value.',inputSchema:{type:'object',properties:{days:daysInput},additionalProperties:false},securitySchemes:oauth,annotations:readAnnotations},
{name:'get_conversion_actions',description:'Inspect Google Ads conversion actions, status, category, origin, primary-for-goal and counting settings.',inputSchema:{type:'object',properties:{},additionalProperties:false},securitySchemes:oauth,annotations:readAnnotations},
{name:'get_campaign_goals',description:'Inspect campaign conversion goals including category, origin and whether each goal is biddable.',inputSchema:{type:'object',properties:{},additionalProperties:false},securitySchemes:oauth,annotations:readAnnotations},
{name:'get_recommendations',description:'List current Google Ads recommendations for audit purposes. Do not apply them automatically.',inputSchema:{type:'object',properties:{},additionalProperties:false},securitySchemes:oauth,annotations:readAnnotations},
{name:'get_negative_keywords',description:'List campaign-level negative keywords and match types.',inputSchema:{type:'object',properties:{},additionalProperties:false},securitySchemes:oauth,annotations:readAnnotations},
{name:'get_ads',description:'List ads with campaign/ad group context, ad type, status and recent performance.',inputSchema:{type:'object',properties:{days:daysInput},additionalProperties:false},securitySchemes:oauth,annotations:readAnnotations},
{name:'get_search_impression_share',description:'Return campaign search impression share and lost impression share from budget/rank.',inputSchema:{type:'object',properties:{days:daysInput},additionalProperties:false},securitySchemes:oauth,annotations:readAnnotations},
{name:'run_google_ads_query',description:'Run a custom read-only GAQL SELECT query for detailed Google Ads diagnostics. Mutations are rejected.',inputSchema:{type:'object',required:['query'],properties:{query:{type:'string',minLength:6,maxLength:8000}},additionalProperties:false},securitySchemes:oauth,annotations:readAnnotations},
{name:'get_ga4_report',description:'Run a GA4 Data API report for the configured Moliora property. Useful for events, traffic sources, landing pages and attribution.',inputSchema:{type:'object',properties:{days:daysInput,dimensions:stringArray,metrics:stringArray,limit:{type:'integer',minimum:1,maximum:1000,default:100}},additionalProperties:false},securitySchemes:oauth,annotations:readAnnotations},
{name:'get_ga4_realtime',description:'Return GA4 realtime data, useful as the API-accessible approximation for recent event debugging. GA4 DebugView itself has no dedicated public read API.',inputSchema:{type:'object',properties:{dimensions:stringArray,metrics:stringArray,limit:{type:'integer',minimum:1,maximum:1000,default:100}},additionalProperties:false},securitySchemes:oauth,annotations:readAnnotations},
{name:'get_ga4_key_events',description:'List GA4 key events (conversions) from the configured Analytics property for conversion-tracking audits.',inputSchema:{type:'object',properties:{},additionalProperties:false},securitySchemes:oauth,annotations:readAnnotations},
{name:'get_gtm_snapshot',description:'Read the configured Google Tag Manager container/workspace tags, triggers and variables.',inputSchema:{type:'object',properties:{},additionalProperties:false},securitySchemes:oauth,annotations:readAnnotations},
{name:'inspect_tracking_page',description:'Inspect delivered Moliora page HTML for GA4/GTM/Google Ads IDs and common tracking markers. This is not a live browser execution trace.',inputSchema:{type:'object',properties:{path:{type:'string',default:'/',maxLength:500}},additionalProperties:false},securitySchemes:oauth,annotations:readAnnotations},
{name:'audit_tracking_setup',description:'Cross-check Google Ads conversion actions, GA4 key events, GTM configuration and site tracking markers in one read-only diagnostic call.',inputSchema:{type:'object',properties:{path:{type:'string',default:'/',maxLength:500}},additionalProperties:false},securitySchemes:oauth,annotations:readAnnotations},
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
function strings(args:Record<string,unknown>|undefined,key:string,fallback:string[]){const v=args?.[key];if(v===undefined)return fallback;if(!Array.isArray(v)||!v.every(x=>typeof x==='string'&&x.trim()))throw new Error(`Invalid ${key}`);return v.map(x=>(x as string).trim());}
function result(data:unknown,extra:Record<string,unknown>={}){return{content:[{type:'text',text:JSON.stringify(data)}],structuredContent:{...extra,data}};}
async function safe<T>(fn:()=>Promise<T>){try{return{ok:true,data:await fn()};}catch(error){return{ok:false,error:error instanceof Error?error.message:'Unknown error'};}}

async function callTool(name:string,args?:Record<string,unknown>){
 const days=daysArg(args); let query:string|undefined;
 switch(name){
 case 'get_campaigns':query=`SELECT campaign.resource_name, campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type, campaign_budget.resource_name, campaign_budget.amount_micros, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.conversions_value FROM campaign WHERE ${dateClause(days)} ORDER BY metrics.cost_micros DESC`;break;
 case 'get_keywords':query=`SELECT campaign.resource_name, campaign.name, ad_group.resource_name, ad_group.name, ad_group_criterion.resource_name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, ad_group_criterion.status, ad_group_criterion.effective_cpc_bid_micros, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM keyword_view WHERE ${dateClause(days)} ORDER BY metrics.cost_micros DESC`;break;
 case 'get_search_terms':query=`SELECT campaign.resource_name, campaign.name, ad_group.resource_name, ad_group.name, search_term_view.search_term, search_term_view.status, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM search_term_view WHERE ${dateClause(days)} ORDER BY metrics.cost_micros DESC`;break;
 case 'get_account_performance':query=`SELECT customer.id, customer.descriptive_name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.conversions_value FROM customer WHERE ${dateClause(days)}`;break;
 case 'get_conversion_actions':query='SELECT conversion_action.resource_name, conversion_action.name, conversion_action.status, conversion_action.type, conversion_action.category, conversion_action.origin, conversion_action.primary_for_goal, conversion_action.counting_type FROM conversion_action ORDER BY conversion_action.name';break;
 case 'get_campaign_goals':query='SELECT campaign_conversion_goal.campaign, campaign_conversion_goal.category, campaign_conversion_goal.origin, campaign_conversion_goal.biddable FROM campaign_conversion_goal';break;
 case 'get_recommendations':query='SELECT recommendation.resource_name, recommendation.type, recommendation.dismissed, recommendation.campaign, recommendation.ad_group FROM recommendation';break;
 case 'get_negative_keywords':query='SELECT campaign.resource_name, campaign.name, campaign_criterion.resource_name, campaign_criterion.keyword.text, campaign_criterion.keyword.match_type FROM campaign_criterion WHERE campaign_criterion.negative = TRUE';break;
 case 'get_ads':query=`SELECT campaign.resource_name, campaign.name, ad_group.resource_name, ad_group.name, ad_group_ad.resource_name, ad_group_ad.status, ad_group_ad.ad.id, ad_group_ad.ad.type, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM ad_group_ad WHERE ${dateClause(days)} ORDER BY metrics.cost_micros DESC`;break;
 case 'get_search_impression_share':query=`SELECT campaign.resource_name, campaign.name, metrics.search_impression_share, metrics.search_budget_lost_impression_share, metrics.search_rank_lost_impression_share, metrics.impressions, metrics.clicks, metrics.cost_micros FROM campaign WHERE ${dateClause(days)}`;break;
 case 'run_google_ads_query':{
   const custom=str(args,'query');
   if(!/^\s*SELECT\b/i.test(custom))throw new Error('Only read-only SELECT GAQL queries are allowed');
   if(/;\s*\S/.test(custom))throw new Error('Only one GAQL query is allowed');
   return result(await googleAdsSearch(custom),{customQuery:true});
 }
 case 'get_ga4_report':{
   return result(await ga4RunReport({days,dimensions:strings(args,'dimensions',['eventName']),metrics:strings(args,'metrics',['eventCount']),limit:Number(args?.limit??100)}),{days});
 }
 case 'get_ga4_realtime':{
   return result(await ga4RunRealtimeReport({dimensions:strings(args,'dimensions',['eventName']),metrics:strings(args,'metrics',['eventCount']),limit:Number(args?.limit??100)}));
 }
 case 'get_ga4_key_events':return result(await ga4ListKeyEvents());
 case 'get_gtm_snapshot':return result(await gtmSnapshot());
 case 'inspect_tracking_page':return result(await inspectTrackingPage(typeof args?.path==='string'?args.path:'/'));
 case 'audit_tracking_setup':{
   const path=typeof args?.path==='string'?args.path:'/';
   const [ads,ga4,gtm,site]=await Promise.all([
     safe(()=>googleAdsSearch('SELECT conversion_action.resource_name, conversion_action.name, conversion_action.status, conversion_action.type, conversion_action.category, conversion_action.origin, conversion_action.primary_for_goal, conversion_action.counting_type FROM conversion_action ORDER BY conversion_action.name')),
     safe(()=>ga4ListKeyEvents()),
     safe(()=>gtmSnapshot()),
     safe(()=>inspectTrackingPage(path)),
   ]);
   return result({googleAdsConversions:ads,ga4KeyEvents:ga4,gtm,site});
 }
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
 if(body.method==='initialize')return rpc(body.id,{protocolVersion,capabilities:{tools:{listChanged:false}},serverInfo:{name:'moliora-google-ads',version:'0.4.0'}});
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
