import { parseArgs } from "@std/cli/parse-args";
import { iterUsers } from "../user/iter_users.ts";
import type { Client } from "../client.ts";

export async function main(
  client: Client,
  args: string[],
  { signal }: { signal?: AbortSignal },
): Promise<void> {
  const options = parseArgs(args, {
    string: ["query"],
    boolean: ["json"],
    alias: { query: "q" },
  });
  for await (const v of iterUsers(client, { q: options.query }, { signal })) {
    if (options.json) {
      console.log(JSON.stringify(v));
    } else {
      // XXX: Format for human
      console.log(v.name);
    }
  }
}
