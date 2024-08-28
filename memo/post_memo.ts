import { ensure } from "@core/unknownutil";
import { toSnakeCaseDeep } from "../_util.ts";
import type { Client } from "../client.ts";
import type { Memo } from "./type.ts";
import { isMemo } from "./_predicate.ts";

export type Params = {
  title: string;
  body: string;
  draft?: boolean;
  notice?: boolean;
  tags?: string[];
  scope?: "everyone" | "private" | "group";
  groups?: number[];
  authorId?: number;
  publishedAt?: string;
};

export async function postMemo(
  client: Client,
  params: Params,
  { signal }: { signal?: AbortSignal } = {},
): Promise<Memo> {
  const data = await client.request(`posts`, {
    method: "POST",
    body: JSON.stringify(toSnakeCaseDeep(params)),
    signal,
  });
  return ensure(data, isMemo);
}
