import { ensure } from "@core/unknownutil";
import type { Client } from "../client.ts";
import { toSnakeCaseDeep } from "../_util.ts";
import type { Memo, MemoId } from "./type.ts";
import { isMemo } from "./_predicate.ts";

export type Params = {
  title?: string;
  body?: string;
  draft?: boolean;
  notice?: boolean;
  tags?: string[];
  scope?: "everyone" | "private" | "group";
  groups?: number[];
};

export async function updateMemo(
  client: Client,
  memoId: MemoId,
  params: Params,
  { signal }: { signal?: AbortSignal } = {},
): Promise<Memo> {
  const data = await client.request(`posts/${memoId}`, {
    method: "PATCH",
    body: JSON.stringify(toSnakeCaseDeep(params)),
    signal,
  });
  return ensure(data, isMemo);
}
