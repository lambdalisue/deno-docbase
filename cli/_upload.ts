import { parseArgs } from "@std/cli/parse-args";
import { basename } from "@std/path/basename";
import { encodeBase64 } from "@std/encoding/base64";
import {
  type Params,
  uploadAttachments,
} from "../attachment/upload_attachments.ts";
import type { Client } from "../client.ts";

export async function main(
  client: Client,
  args: string[],
  { signal }: { signal?: AbortSignal },
): Promise<void | number> {
  const options = parseArgs(args, {
    boolean: ["json"],
  });
  const filenames = options._.map((v) => v.toString());
  const params: Params = await Promise.all(filenames.map(async (filename) => {
    const content = await Deno.readFile(filename);
    return {
      name: basename(filename),
      content: encodeBase64(content),
    };
  }));
  const attachments = await uploadAttachments(client, params, { signal });
  if (options.json) {
    console.log(JSON.stringify(attachments));
  } else {
    for (const attachment of attachments) {
      console.log(attachment.name);
    }
  }
}
