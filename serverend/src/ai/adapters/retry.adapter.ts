// apps/server/src/modules/ai/adapters/retry.adapter.ts
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  baseMs = 300
): Promise<T> {
  let lastErr: any;
  for (let i = 0; i <= retries; i++) {
    try { return await fn(); }
    catch (e) {
      lastErr = e;
      await new Promise(r => setTimeout(r, baseMs * Math.pow(2, i)));
    }
  }
  throw lastErr;
}
