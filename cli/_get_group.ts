import { parseArgs } from "@std/cli/parse-args";
import { getGroup } from "../group/get_group.ts";
import type { Client } from "../client.ts";
import { toGroupId } from "./_util.ts";

export async function main(
  client: Client,
  args: string[],
  { signal }: { signal?: AbortSignal },
): Promise<void | number> {
  const options = parseArgs(args, {
    boolean: ["json"],
  });
  const groupId = toGroupId(options._.at(0));
  const group = await getGroup(client, groupId, { signal });
  if (options.json) {
    console.log(JSON.stringify(group));
  } else {
    // XXX: Format group output for human
    console.log(group.name);
  }
}
