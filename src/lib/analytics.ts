'use client';

type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsParams = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined') return;

  const payload = {
    ...params,
    page_path: `${window.location.pathname}${window.location.search}`,
  };

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, payload);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...payload });
}
