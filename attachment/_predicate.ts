import { is, type Predicate } from "@core/unknownutil";
import type { Attachment } from "./type.ts";

export const isAttachment = is.ObjectOf({
  id: is.String,
  name: is.String,
  size: is.Number,
  url: is.String,
  markdown: is.String,
  createdAt: is.String,
}) satisfies Predicate<Attachment>;
