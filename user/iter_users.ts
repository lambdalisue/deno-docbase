import { ensure, is } from "@core/unknownutil";
import { pipe } from "@core/pipe";
import { compactValues, stringifyValues, toSnakeCaseDeep } from "../_util.ts";
import type { Client } from "../client.ts";
import type { User, UserWithGroups } from "./type.ts";
import { isUser, isUserWithGroups } from "./_predicate.ts";

const isUsers = is.ArrayOf(isUser);
const isUsersWithGroups = is.ArrayOf(isUserWithGroups);

export type Params = {
  q?: string;
  includeUserGroups?: boolean;
};

export function iterUsers(
  client: Client,
  params?: Params & { includeUserGroups: true },
): AsyncIterable<UserWithGroups>;
export function iterUsers(
  client: Client,
  params?: Params,
): AsyncIterable<User>;
export async function* iterUsers(
  client: Client,
  params: Params = {},
): AsyncIterable<User> | AsyncIterable<UserWithGroups> {
  const qs = new URLSearchParams({
    ...pipe(
      params,
      compactValues,
      stringifyValues,
      toSnakeCaseDeep,
    ),
    per_page: "100",
  });
  let page = 0;
  while (true) {
    qs.set("page", (++page).toString());
    const data = await client.request(`users?${qs}`);
    const users = params.includeUserGroups
      ? ensure(data, isUsersWithGroups)
      : ensure(data, isUsers);
    yield* users;
    if (users.length < 100) {
      break;
    }
  }
}
