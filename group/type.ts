import type { UserItem as UserItemBase } from "../user/type.ts";

export type UserItem = UserItemBase & {
  admin: boolean;
};

export type GroupId = number;

export type GroupItem = {
  id: GroupId;
  name: string;
};

export type Group = GroupItem & {
  description: string;
  postsCount: number;
  lastActivityAt: string;
  createdAt: string;
  users: UserItem[];
};
