import { as, is, type Predicate } from "@core/unknownutil";
import type { Tag } from "./type.ts";

export const isTag = is.ObjectOf({
  name: is.String,
  preferred: as.Optional(is.Boolean),
  starred: as.Optional(is.Boolean),
}) satisfies Predicate<Tag>;
