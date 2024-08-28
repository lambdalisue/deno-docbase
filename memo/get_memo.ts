import { ensure } from "@core/unknownutil";
import type { Client } from "../client.ts";
import type { Memo, MemoId } from "./type.ts";
import { isMemo } from "./_predicate.ts";

export async function getMemo(
  client: Client,
  memoId: MemoId,
  { signal }: { signal?: AbortSignal } = {},
): Promise<Memo> {
  const data = await client.request(`posts/${memoId}`, { signal });
  return ensure(data, isMemo);
}
