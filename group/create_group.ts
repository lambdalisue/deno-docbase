import { ensure } from "@core/unknownutil";
import { toSnakeCaseDeep } from "../_util.ts";
import type { Client } from "../client.ts";
import type { Group } from "./type.ts";
import { isGroup } from "./_predicate.ts";

export type Params = {
  name: string;
  description?: string;
};

export async function createGroup(
  client: Client,
  params: Params,
  { signal }: { signal?: AbortSignal } = {},
): Promise<Group> {
  const data = await client.request(`groups`, {
    method: "POST",
    body: JSON.stringify(toSnakeCaseDeep(params)),
    signal,
  });
  return ensure(data, isGroup);
}
