import { deleteMemo } from "../memo/delete_memo.ts";
import type { Client } from "../client.ts";
import { toMemoId } from "./_util.ts";

export async function main(
  client: Client,
  args: string[],
  { signal }: { signal?: AbortSignal },
): Promise<void | number> {
  const memoId = toMemoId(args.at(0));
  await deleteMemo(client, memoId, { signal });
}
