import type { Client } from "../client.ts";
import type { MemoId } from "./type.ts";

export async function archiveMemo(
  client: Client,
  memoId: MemoId,
): Promise<void> {
  await client.request(`posts/${memoId}/archive`, {
    method: "PUT",
  });
}
