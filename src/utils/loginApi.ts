// Utility to try multiple login payload variants sequentially until one succeeds or all fail.
// Each variant is an object whose keys are alternative field names the backend may accept.
// Returns the first successful response (response.ok && success flag) or the last failure.

export interface LoginAttemptResult {
  response: Response;
  data: any;
  variantIndex: number;
  variantPayload: Record<string, any>;
}

export async function attemptLogin(
  url: string,
  payloadVariants: Record<string, any>[],
  opts?: { debug?: boolean }
): Promise<LoginAttemptResult> {
  const debug = !!opts?.debug;
  let lastResult: LoginAttemptResult | null = null;
  for (let i = 0; i < payloadVariants.length; i++) {
    const pv = payloadVariants[i];
    const started = performance.now();
    if (debug) {
      // eslint-disable-next-line no-console
      console.log(`[LoginAPI] Attempt ${i + 1}/${payloadVariants.length}`, pv);
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pv)
    });
    let data: any = null;
    try { data = await response.json(); } catch { /* ignore */ }
    const elapsed = (performance.now() - started).toFixed(0);
    if (debug) {
      // eslint-disable-next-line no-console
      console.log('[LoginAPI] Response', { variantIndex: i, status: response.status, ok: response.ok, elapsedMs: elapsed, body: data });
    }
    lastResult = { response, data, variantIndex: i, variantPayload: pv };
    if (response.ok && (data?.success || data?.ok)) {
      return lastResult;
    }
    // If credentials invalid, try next variant; break early on non-auth errors (e.g. 500, 422 schema issues)
    const msg = (data?.message || '').toLowerCase();
    if (!(response.status === 400 || response.status === 401) || !/(invalid|credential)/.test(msg)) {
      break; // don't keep trying variants for non-credential errors
    }
  }
  // Return last attempt (failure)
  return lastResult!;
}
