import type { UsageAction } from './backend-contract';

// NEXT_PUBLIC values are public build-time settings, never secrets.
const configuredUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
export function apiUrl(path: string): string | null {
  try {
    const url = new URL(configuredUrl);
    const local = ['localhost', '127.0.0.1'].includes(url.hostname);
    if (url.protocol !== 'https:' && !(local && url.protocol === 'http:')) return null;
    if (url.username || url.password || url.search || url.hash || url.pathname !== '/') return null;
    return `${url.origin}${path}`;
  } catch { return null; }
}
export function feedbackAvailable() {
  return process.env.NEXT_PUBLIC_FEEDBACK_ENABLED === 'true' && apiUrl('/api/feedback') !== null;
}
export function trackToolUsage(toolId: string, action: UsageAction): void {
  try {
    if (process.env.NEXT_PUBLIC_USAGE_ENABLED !== 'true' || typeof window === 'undefined') return;
    if (navigator.doNotTrack === '1' || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
    const url = apiUrl('/api/usage');
    if (!url) return;
    // No cookies, identifiers, URLs, tool inputs, or outputs. No retries or persistent queue.
    void fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolId, action }), credentials: 'omit', referrerPolicy: 'no-referrer',
      signal: AbortSignal.timeout(3000),
    }).catch(() => {});
  } catch { /* Analytics must never interfere with a tool. */ }
}
