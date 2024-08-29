import { ensure, is } from "@core/unknownutil";
import { parseArgs } from "@std/cli/parse-args";
import { createGroup, type Params } from "../group/create_group.ts";
import type { Client } from "../client.ts";

export async function main(
  client: Client,
  args: string[],
  { signal }: { signal?: AbortSignal },
): Promise<void | number> {
  const options = parseArgs(args, {
    string: ["description"],
  });
  const name = options._.at(0);
  if (!name) {
    throw new Error("NAME is required");
  }
  const params: Params = {
    name: ensure(name, is.String),
    description: options.description || undefined,
  };
  const group = await createGroup(client, params, { signal });
  console.log(JSON.stringify(group));
}
