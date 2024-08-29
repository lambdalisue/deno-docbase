import { parseArgs } from "@std/cli/parse-args";
import { iterGroups, type Params } from "../group/iter_groups.ts";
import type { Client } from "../client.ts";

export async function main(
  client: Client,
  args: string[],
  { signal }: { signal?: AbortSignal },
): Promise<void> {
  const options = parseArgs(args, {
    string: ["name"],
    boolean: ["json"],
  });
  const params: Params = {
    name: options.name || undefined,
  };
  for await (const v of iterGroups(client, params, { signal })) {
    if (options.json) {
      console.log(JSON.stringify(v));
    } else {
      // XXX: Format group output for human
      console.log(v.name);
    }
  }
}
