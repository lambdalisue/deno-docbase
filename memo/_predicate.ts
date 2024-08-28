import { is, type Predicate } from "@core/unknownutil";
import { isUserItem } from "../user/_predicate.ts";
import { isGroupItem } from "../group/_predicate.ts";
import { isTag } from "../tag/_predicate.ts";
import { isComment } from "../comment/_predicate.ts";
import { isAttachment } from "../attachment/_predicate.ts";
import type { Memo, MemoItem } from "./type.ts";

export const isMemoItem = is.ObjectOf({
  id: is.Number,
  title: is.String,
  body: is.String,
  draft: is.Boolean,
  archived: is.Boolean,
  url: is.String,
  createdAt: is.String,
  updatedAt: is.String,
  scope: is.String,
  tags: is.ArrayOf(isTag),
  user: isUserItem,
  starsCount: is.Number,
  goodJobsCount: is.Number,
  sharingUrl: is.UnionOf([is.String, is.Null]),
  comments: is.ArrayOf(isComment),
  groups: is.ArrayOf(isGroupItem),
}) satisfies Predicate<MemoItem>;

export const isMemo = is.IntersectionOf([
  isMemoItem,
  is.ObjectOf({
    representativeImageUrl: is.UnionOf([is.String, is.Null]),
    attachments: is.ArrayOf(isAttachment),
  }),
]) satisfies Predicate<Memo>;
