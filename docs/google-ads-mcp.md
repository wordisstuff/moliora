# Moliora Ads & Analytics MCP

Production endpoint: `/mcp`.

The MCP exposes authenticated tools for Google Ads plus read-only analytics and tracking diagnostics.

## Google Ads

Read tools include campaigns, keywords, search terms, account performance, conversion actions, campaign goals, recommendations, campaign negative keywords, ads, search impression share, and a guarded custom GAQL SELECT tool.

Existing write tools remain available for keyword bids/status, campaign negative keywords, campaign status, and daily budget. These are explicitly marked as live mutations and should only be used after user approval.

## GA4

The MCP can run standard and realtime GA4 Data API reports and list GA4 key events.

Required environment variable:

- `GA4_PROPERTY_ID` — numeric GA4 property ID (not the G- measurement ID).

The same service account used for Ads can be reused if it has GA4 Viewer access. Optional generic credential names are supported:

- `GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

If these are absent, the existing `GOOGLE_ADS_CLIENT_EMAIL` and `GOOGLE_ADS_PRIVATE_KEY` are used.

Note: GA4 DebugView does not expose a dedicated public read API. The `get_ga4_realtime` tool is the supported API approximation for recent-event debugging.

## Google Tag Manager

The MCP can read a GTM container/workspace snapshot including tags, triggers, and variables.

Required environment variables:

- `GTM_ACCOUNT_ID`
- `GTM_CONTAINER_ID`
- `GTM_WORKSPACE_ID` (optional; if omitted the Default Workspace or first workspace is selected)

The service account must have read access to the GTM account/container.

## Tracking diagnostics

- `inspect_tracking_page` fetches delivered Moliora HTML and checks for GA4, GTM, Google Ads IDs and common tracking markers.
- `audit_tracking_setup` cross-checks Google Ads conversion actions, GA4 key events, GTM configuration, and delivered site tracking markers in one call.

HTML inspection is intentionally not described as a live browser trace. Runtime confirmation should use GA4 realtime plus browser/GTM preview testing when needed.
