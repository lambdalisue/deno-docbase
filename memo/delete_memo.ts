import type { Client } from "../client.ts";
import type { MemoId } from "./type.ts";

export async function deleteMemo(
  client: Client,
  memoId: MemoId,
): Promise<void> {
  await client.request(`posts/${memoId}`, {
    method: "DELETE",
  });
}
