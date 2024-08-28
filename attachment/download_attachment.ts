import type { Client } from "../client.ts";
import type { AttachmentId } from "./type.ts";

export async function downloadAttachment(
  client: Client,
  attachmentId: AttachmentId,
): Promise<Uint8Array> {
  const resp = await client.fetch(`attachments/${attachmentId}`);
  return new Uint8Array(await resp.arrayBuffer());
}
