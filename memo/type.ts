import type { UserItem } from "../user/type.ts";
import type { GroupItem } from "../group/type.ts";
import type { Tag } from "../tag/type.ts";
import type { Comment } from "../comment/type.ts";
import type { Attachment } from "../attachment/type.ts";

export type MemoId = number;

export type MemoItem = {
  id: MemoId;
  title: string;
  body: string;
  draft: boolean;
  archived: boolean;
  url: string;
  createdAt: string;
  updatedAt: string;
  scope: string;
  tags: Tag[];
  user: UserItem;
  starsCount: number;
  goodJobsCount: number;
  sharingUrl: string | null;
  comments: Comment[];
  groups: GroupItem[];
};

export type Memo = MemoItem & {
  representativeImageUrl: string | null;
  attachments: Attachment[]; // undocumented field?
};
