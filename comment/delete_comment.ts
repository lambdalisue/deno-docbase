import type { Client } from "../client.ts";
import type { CommentId } from "./type.ts";

export async function deleteComment(
  client: Client,
  commentId: CommentId,
  { signal }: { signal?: AbortSignal } = {},
): Promise<void> {
  await client.request(`comments/${commentId}`, {
    method: "DELETE",
    signal,
  });
}
