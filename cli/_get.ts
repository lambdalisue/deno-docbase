import { parseArgs } from "@std/cli/parse-args";
import { getMemo } from "../memo/get_memo.ts";
import type { Memo } from "../memo/type.ts";
import type { Client } from "../client.ts";
import { toMemoId } from "./_util.ts";

export async function main(
  client: Client,
  args: string[],
  { signal }: { signal?: AbortSignal },
): Promise<void | number> {
  const options = parseArgs(args, {
    boolean: ["json"],
  });
  const memoId = toMemoId(options._.at(0));
  const memo = await getMemo(client, memoId, { signal });
  if (options.json) {
    console.log(JSON.stringify(memo));
  } else {
    console.log(formatFrontMatter(memo));
    console.log(memo.body);
  }
}

function formatFrontMatter(memo: Memo): string {
  const frontMatter = [
    "---",
    `title: ${memo.title}`,
  ];
  if (memo.draft) {
    frontMatter.push("draft: true");
  }
  if (memo.scope !== "everyone") {
    frontMatter.push(`scope: ${memo.scope}`);
  }
  if (memo.groups.length > 0) {
    frontMatter.push("groups:");
    memo.groups.forEach((group) => {
      frontMatter.push(`  - ${group.id}`);
    });
  }
  if (memo.tags.length > 0) {
    frontMatter.push("tags:");
    memo.tags.forEach((tag) => {
      frontMatter.push(`  - ${tag.name}`);
    });
  }
  frontMatter.push("---");
  return frontMatter.join("\n");
}
