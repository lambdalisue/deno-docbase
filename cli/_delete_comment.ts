import { deleteComment } from "../comment/delete_comment.ts";
import type { Client } from "../client.ts";
import { toCommentId } from "./_util.ts";

export async function main(
  client: Client,
  args: string[],
  { signal }: { signal?: AbortSignal },
): Promise<void | number> {
  const commentId = toCommentId(args.at(0));
  await deleteComment(client, commentId, { signal });
}
