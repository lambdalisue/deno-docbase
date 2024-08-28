import { ensure, is } from "@core/unknownutil";
import { pipe } from "@core/pipe";
import { compactValues, stringifyValues, toSnakeCaseDeep } from "../_util.ts";
import type { Client } from "../client.ts";
import type { GroupItem } from "./type.ts";
import { isGroupItem } from "./_predicate.ts";

const isGroupItems = is.ArrayOf(isGroupItem);

export type Params = {
  name?: string;
};

export async function* iterGroups(
  client: Client,
  params: Params = {},
): AsyncIterable<GroupItem> {
  const qs = new URLSearchParams({
    ...pipe(
      params,
      compactValues,
      stringifyValues,
      toSnakeCaseDeep,
    ),
    per_page: "200",
  });
  let page = 0;
  while (true) {
    qs.set("page", (++page).toString());
    const data = await client.request(`groups?${qs}`);
    const groups = ensure(data, isGroupItems);
    yield* groups;
    if (groups.length < 200) {
      break;
    }
  }
}
