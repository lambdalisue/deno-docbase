import { parseArgs } from "@std/cli/parse-args";
import { removeUsersFromGroup } from "../group/remove_users_from_group.ts";
import type { Client } from "../client.ts";
import { toGroupId, toUserId } from "./_util.ts";

export async function main(
  client: Client,
  args: string[],
  { signal }: { signal?: AbortSignal },
): Promise<void | number> {
  const options = parseArgs(args, {
    string: ["user"],
    collect: ["user"],
  });
  const groupId = toGroupId(options._.at(0));
  await removeUsersFromGroup(
    client,
    groupId,
    { userIds: options.user.map((v) => toUserId(v)) },
    { signal },
  );
}
