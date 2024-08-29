import { parseArgs } from "@std/cli/parse-args";
import { iterTags } from "../tag/iter_tags.ts";
import type { Client } from "../client.ts";

export async function main(
  client: Client,
  args: string[],
  { signal }: { signal?: AbortSignal },
): Promise<void> {
  const options = parseArgs(args, {
    boolean: ["json"],
  });
  for await (const v of iterTags(client, { signal })) {
    if (options.json) {
      console.log(JSON.stringify(v));
    } else {
      // XXX: Format for human
      console.log(v.name);
    }
  }
}
