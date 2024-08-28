import { is, type Predicate } from "@core/unknownutil";
import type { Comment } from "./type.ts";
import type { UserItem } from "../user/type.ts";

const isUserItem = is.ObjectOf({
  id: is.Number,
  name: is.String,
  profileImageUrl: is.String,
}) satisfies Predicate<UserItem>;

export const isComment = is.ObjectOf({
  id: is.Number,
  body: is.String,
  createdAt: is.String,
  user: isUserItem,
}) satisfies Predicate<Comment>;
