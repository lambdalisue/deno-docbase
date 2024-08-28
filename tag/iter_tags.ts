import { ensure, is, type Predicate } from "@core/unknownutil";
import type { Client } from "../client.ts";
import type { Tag } from "./type.ts";
import { isTag } from "./_predicate.ts";

const isTags: Predicate<Tag[]> = is.ArrayOf(isTag);

export async function* iterTags(
  client: Client,
  { signal }: { signal?: AbortSignal } = {},
): AsyncIterable<Tag> {
  const data = await client.request("tags", { signal });
  const tags = ensure(data, isTags);
  yield* tags;
}
