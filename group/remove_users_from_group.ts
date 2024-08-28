import { toSnakeCaseDeep } from "../_util.ts";
import type { Client } from "../client.ts";
import type { GroupId } from "./type.ts";
import type { UserId } from "../user/type.ts";

export type Params = {
  userIds: UserId[];
};

export async function removeUsersFromGroup(
  client: Client,
  groupId: GroupId,
  params: Params,
): Promise<void> {
  await client.request(`groups/${groupId}/users`, {
    method: "DELETE",
    body: JSON.stringify(toSnakeCaseDeep(params)),
  });
}
