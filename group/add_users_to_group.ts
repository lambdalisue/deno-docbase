import { toSnakeCaseDeep } from "../_util.ts";
import type { Client } from "../client.ts";
import type { GroupId } from "./type.ts";
import type { UserId } from "../user/type.ts";

export type Params = {
  userIds: UserId[];
};

export async function addUsersToGroup(
  client: Client,
  groupId: GroupId,
  params: Params,
  { signal }: { signal?: AbortSignal } = {},
): Promise<void> {
  await client.request(`groups/${groupId}/users`, {
    method: "POST",
    body: JSON.stringify(toSnakeCaseDeep(params)),
    signal,
  });
}
