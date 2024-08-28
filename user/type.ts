import type { GroupItem } from "../group/type.ts";

export type UserId = number;

export type UserItem = {
  id: UserId;
  name: string;
  profileImageUrl: string;
};

export type User = UserItem & {
  username: string;
  role: string;
  postsCount: number;
  lastAccessTime: string;
  twoStepAuthentication: boolean;
  email?: string; // undocumented field?
};

export type UserWithGroups = User & {
  groups: GroupItem[];
};

export type Profile = UserWithGroups & {
  email: string;
  nameid?: string;
};
