import { parseArgs } from "@std/cli/parse-args";
import { getProfile } from "../user/get_profile.ts";
import type { Client } from "../client.ts";

export async function main(
  client: Client,
  args: string[],
  { signal }: { signal?: AbortSignal },
): Promise<void | number> {
  const options = parseArgs(args, {
    boolean: ["json"],
  });
  const profile = await getProfile(client, { signal });
  if (options.json) {
    console.log(JSON.stringify(profile));
  } else {
    // XXX
    console.log(profile.name);
  }
}
