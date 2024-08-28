import { ensure, is, type Predicate } from "@core/unknownutil";
import type { Client } from "../client.ts";
import type { Tag } from "./type.ts";
import { isTag } from "./_predicate.ts";

const isTags: Predicate<Tag[]> = is.ArrayOf(isTag);

export async function* iterTags(client: Client): AsyncIterable<Tag> {
  while (true) {
    const data = await client.request("tags");
    const tags = ensure(data, isTags);
    if (tags.length === 0) {
      break;
    }
    yield* tags;
  }
}
