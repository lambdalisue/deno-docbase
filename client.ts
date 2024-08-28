import { RateLimitter } from "./_rate_limitter.ts";
import { toCamelCaseDeep } from "./_util.ts";

export class RequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: string,
  ) {
    super(`API request error: ${status} - ${statusText}: ${body}`);
    this.name = this.constructor.name;
  }
}

export type Credential = {
  readonly domain: string;
  readonly token: string;
};

export type ClientRequestOptions = {
  ignoreRateLimit?: boolean;
  skipCaseTransform?: boolean;
};

export class Client {
  readonly domain: string;
  #token: string;
  #baseUrl = new URL("https://api.docbase.io");

  constructor(
    credential: Credential,
    { baseUrl }: { baseUrl?: URL } = {},
  ) {
    this.domain = credential.domain;
    this.#token = credential.token;
    this.#baseUrl = baseUrl ?? this.#baseUrl;
  }

  fetch(
    path: string,
    init?: RequestInit,
  ): Promise<Response> {
    return fetch(
      `${this.#baseUrl}teams/${this.domain}/${path}`,
      {
        ...(init ?? {}),
        headers: {
          ...(init?.headers ?? {}),
          "Content-Type": "application/json",
          "X-Api-Version": "2",
          "X-DocBaseToken": this.#token,
        },
      },
    );
  }

  async request<T>(
    path: string,
    init?: RequestInit,
    options?: ClientRequestOptions,
  ): Promise<T> {
    const resp = await this.fetch(path, init);
    if (resp.ok) {
      if (resp.status === 204) {
        return undefined as T;
      }
      const data = await resp.json();
      return options?.skipCaseTransform ? data : toCamelCaseDeep(data);
    } else if (resp.status === 429 && !options?.ignoreRateLimit) {
      await resp.body?.cancel();
      const rateLimitter = RateLimitter.fromResponse(resp);
      await rateLimitter.wait({ signal: init?.signal ?? undefined });
      return this.request(path, init, { ignoreRateLimit: true });
    }
    throw new RequestError(resp.status, resp.statusText, await resp.text());
  }
}
