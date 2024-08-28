import { ensure, is, type Predicate } from "@core/unknownutil";
import type { Client } from "../client.ts";
import type { Attachment } from "./type.ts";
import { isAttachment } from "./_predicate.ts";

export const isAttachments: Predicate<Attachment[]> = is.ArrayOf(isAttachment);

export type Params = {
  name: string;
  content: string;
}[];

export async function uploadAttachments(
  client: Client,
  params: Params,
  { signal }: { signal?: AbortSignal } = {},
): Promise<Attachment[]> {
  const data = await client.request(`attachments`, {
    method: "POST",
    body: JSON.stringify(params),
    signal,
  });
  return ensure(data, isAttachments);
}
