import { ensure } from "@core/unknownutil";
import type { Client } from "../client.ts";
import type { Group, GroupId } from "./type.ts";
import { isGroup } from "./_predicate.ts";

export async function getGroup(
  client: Client,
  groupId: GroupId,
): Promise<Group> {
  const data = await client.request(`groups/${groupId}`);
  return ensure(data, isGroup);
}
