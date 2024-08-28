import { as, is, type Predicate } from "@core/unknownutil";
import type { Profile, User, UserItem, UserWithGroups } from "./type.ts";
import type { GroupItem } from "../group/type.ts";

const isGroupItem = is.ObjectOf({
  id: is.Number,
  name: is.String,
}) satisfies Predicate<GroupItem>;

export const isUserItem = is.ObjectOf({
  id: is.Number,
  name: is.String,
  profileImageUrl: is.String,
}) satisfies Predicate<UserItem>;

export const isUser = is.IntersectionOf([
  isUserItem,
  is.ObjectOf({
    username: is.String,
    role: is.String,
    postsCount: is.Number,
    lastAccessTime: is.String,
    twoStepAuthentication: is.Boolean,
    email: as.Optional(is.String),
  }),
]) satisfies Predicate<User>;

export const isUserWithGroups = is.IntersectionOf([
  isUser,
  is.ObjectOf({ groups: is.ArrayOf(isGroupItem) }),
]) satisfies Predicate<UserWithGroups>;

export const isProfile = is.IntersectionOf([
  isUserWithGroups,
  is.ObjectOf({
    email: is.String,
    nameid: as.Optional(is.String),
  }),
]) satisfies Predicate<Profile>;
