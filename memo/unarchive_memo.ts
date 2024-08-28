import type { Client } from "../client.ts";
import type { MemoId } from "./type.ts";

export async function unarchiveMemo(
  client: Client,
  memoId: MemoId,
  { signal }: { signal?: AbortSignal } = {},
): Promise<void> {
  await client.request(`posts/${memoId}/unarchive`, {
    method: "PUT",
    signal,
  });
}
