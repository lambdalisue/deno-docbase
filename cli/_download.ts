import { writeAll } from "@core/streamutil/write-all";
import { downloadAttachment } from "../attachment/download_attachment.ts";
import type { Client } from "../client.ts";
import { toAttachmentId } from "./_util.ts";

export async function main(
  client: Client,
  args: string[],
  { signal }: { signal?: AbortSignal },
): Promise<void | number> {
  const attachmentId = toAttachmentId(args.at(0));
  const content = await downloadAttachment(client, attachmentId, { signal });
  await writeAll(Deno.stdout.writable, content);
}
