import type { Client } from "../client.ts";
import type { MemoId } from "./type.ts";

export async function deleteMemo(
  client: Client,
  memoId: MemoId,
  { signal }: { signal?: AbortSignal } = {},
): Promise<void> {
  await client.request(`posts/${memoId}`, {
    method: "DELETE",
    signal,
  });
}
