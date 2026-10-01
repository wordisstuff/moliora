const DEFAULT_ORIGIN = 'https://www.moliora.us';

function unique(values: string[]) {
  return [...new Set(values)];
}

export async function inspectTrackingPage(path = '/') {
  const url = new URL(path || '/', DEFAULT_ORIGIN);
  if (url.origin !== DEFAULT_ORIGIN) throw new Error('Only moliora.us URLs are allowed');

  const response = await fetch(url, {
    headers: { 'user-agent': 'MolioraTrackingAudit/1.0' },
    cache: 'no-store',
    redirect: 'follow',
  });

  const html = await response.text();
  if (!response.ok) throw new Error(`Site fetch failed (${response.status})`);

  const ga4Ids = unique(html.match(/G-[A-Z0-9]{6,}/g) || []);
  const gtmIds = unique(html.match(/GTM-[A-Z0-9]{5,}/g) || []);
  const googleAdsIds = unique(html.match(/AW-\d{6,}/g) || []);

  const markers = {
    googletagmanager: /googletagmanager\.com/i.test(html),
    googleAnalytics: /google-analytics\.com/i.test(html),
    gtagFunction: /\bgtag\s*\(/i.test(html),
    dataLayer: /dataLayer/i.test(html),
    consentMode: /consent/i.test(html) && /gtag|dataLayer/i.test(html),
    googleAdsConversion: /google_conversion|send_to|AW-\d+/i.test(html),
  };

  return {
    url: response.url,
    status: response.status,
    contentLength: html.length,
    ids: { ga4: ga4Ids, gtm: gtmIds, googleAds: googleAdsIds },
    markers,
    note: 'This inspects delivered HTML/scripts, not a live browser session. Use GA4 realtime for recent runtime event evidence.',
  };
}
