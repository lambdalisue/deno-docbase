import { ensure } from "@core/unknownutil";
import type { Client } from "../client.ts";
import type { Memo, MemoId } from "./type.ts";
import { isMemo } from "./_predicate.ts";

export async function getMemo(
  client: Client,
  memoId: MemoId,
): Promise<Memo> {
  const data = await client.request(`posts/${memoId}`);
  return ensure(data, isMemo);
}
