export class RateLimitter {
  constructor(public readonly reset: number) {}

  static fromResponse(resp: Response): RateLimitter {
    const reset = getNumberFromHeader(
      resp.headers,
      "X-RateLimit-Reset",
    );
    return new RateLimitter(reset);
  }

  wait({ signal }: { signal?: AbortSignal } = {}): Promise<void> {
    if (signal?.aborted) {
      return Promise.reject(signal.reason);
    }
    const now = Date.now();
    const reset = this.reset;
    const diff = reset - now;
    if (diff <= 0) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        signal?.removeEventListener("abort", abort);
        clearTimeout(timer);
      };
      const abort = () => {
        cleanup();
        reject(signal!.reason);
      };
      signal?.addEventListener("abort", abort, { once: true });
      const timer = setTimeout(() => {
        cleanup();
        resolve();
      }, diff);
    });
  }
}

function getNumberFromHeader(headers: Headers, key: string): number {
  const v = headers.get(key);
  if (v === null) {
    throw new Error(`expect ${key} in headers but not found`);
  }
  const n = Number(v);
  if (Number.isNaN(n)) {
    throw new Error(`expect ${key} in headers is number but got ${v}`);
  }
  return n;
}
