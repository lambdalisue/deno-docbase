import type { Client } from "../client.ts";
import type { MemoId } from "./type.ts";

export async function unarchiveMemo(
  client: Client,
  memoId: MemoId,
): Promise<void> {
  await client.request(`posts/${memoId}/unarchive`, {
    method: "PUT",
  });
}
