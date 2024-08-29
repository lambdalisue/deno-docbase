import { parseArgs } from "@std/cli/parse-args";
import { addUsersToGroup } from "../group/add_users_to_group.ts";
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
  const userIds = options["user"].map((v) => toUserId(v));
  await addUsersToGroup(
    client,
    toGroupId(groupId),
    { userIds },
    { signal },
  );
}
