import type { Client } from "../client.ts";
import type { AttachmentId } from "./type.ts";

export async function downloadAttachment(
  client: Client,
  attachmentId: AttachmentId,
  { signal }: { signal?: AbortSignal } = {},
): Promise<Uint8Array> {
  const resp = await client.fetch(`attachments/${attachmentId}`, { signal });
  return new Uint8Array(await resp.arrayBuffer());
}
