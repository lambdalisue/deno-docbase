import { ensure } from "@core/unknownutil";
import type { Client } from "../client.ts";
import type { Group, GroupId } from "./type.ts";
import { isGroup } from "./_predicate.ts";

export async function getGroup(
  client: Client,
  groupId: GroupId,
  { signal }: { signal?: AbortSignal } = {},
): Promise<Group> {
  const data = await client.request(`groups/${groupId}`, { signal });
  return ensure(data, isGroup);
}
