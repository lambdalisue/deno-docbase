import { ensure } from "@core/unknownutil";
import { toSnakeCaseDeep } from "../_util.ts";
import type { Client } from "../client.ts";
import type { MemoId } from "../memo/type.ts";
import type { Comment } from "./type.ts";
import { isComment } from "./_predicate.ts";

export type Params = {
  body: string;
  notice?: boolean;
  authorId?: number;
  publishedA?: string;
};

export async function postComment(
  client: Client,
  memoId: MemoId,
  params: Params,
): Promise<Comment> {
  const data = await client.request(`posts/${memoId}/comments`, {
    method: "POST",
    body: JSON.stringify(toSnakeCaseDeep(params)),
  });
  return ensure(data, isComment);
}
