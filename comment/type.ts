import type { UserItem } from "../user/type.ts";

export type CommentId = number;

export type Comment = {
  id: CommentId;
  body: string;
  createdAt: string;
  user: UserItem;
};
