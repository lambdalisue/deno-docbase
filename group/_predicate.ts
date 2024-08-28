import { is, type Predicate } from "@core/unknownutil";
import type { Group, GroupItem, UserItem } from "./type.ts";

const isUserItem = is.ObjectOf({
  id: is.Number,
  name: is.String,
  profileImageUrl: is.String,
  admin: is.Boolean,
}) satisfies Predicate<UserItem>;

export const isGroupItem = is.ObjectOf({
  id: is.Number,
  name: is.String,
}) satisfies Predicate<GroupItem>;

export const isGroup = is.IntersectionOf([
  isGroupItem,
  is.ObjectOf({
    description: is.String,
    postsCount: is.Number,
    lastActivityAt: is.String,
    createdAt: is.String,
    users: is.ArrayOf(isUserItem),
  }),
]) satisfies Predicate<Group>;
