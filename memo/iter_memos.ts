import { ensure, is } from "@core/unknownutil";
import { pipe } from "@core/pipe";
import type { Client } from "../client.ts";
import { compactValues, stringifyValues, toSnakeCaseDeep } from "../_util.ts";
import type { MemoItem } from "./type.ts";
import { isMemoItem } from "./_predicate.ts";

const isPostsResponse = is.ObjectOf({
  posts: is.ArrayOf(isMemoItem),
  meta: is.ObjectOf({
    nextPage: is.UnionOf([is.String, is.Null]),
  }),
});

export type Params = {
  q?: string;
};

export async function* iterMemos(
  client: Client,
  params: Params = {},
): AsyncIterable<MemoItem> {
  const qs = new URLSearchParams({
    ...pipe(
      params,
      compactValues,
      stringifyValues,
      toSnakeCaseDeep,
    ),
    per_page: "100",
  });
  let search = `?${qs}`;
  while (true) {
    const data = await client.request(`posts${search}`);
    const resp = ensure(data, isPostsResponse);
    yield* resp.posts;
    if (!resp.meta.nextPage) {
      break;
    }
    const url = new URL(resp.meta.nextPage);
    search = url.search;
  }
}
