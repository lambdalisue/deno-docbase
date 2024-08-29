import { is, maybe } from "@core/unknownutil";
import { readAll } from "@core/streamutil/read-all";
import { parseArgs } from "@std/cli/parse-args";
import { extract } from "@std/front-matter/yaml";
import { test } from "@std/front-matter/test";
import { type Params, updateMemo } from "../memo/update_memo.ts";
import type { Client } from "../client.ts";
import { toGroupId, toMemoId } from "./_util.ts";

const decoder = new TextDecoder();
const isScope = is.LiteralOneOf(["everyone", "private", "group"] as const);

export async function main(
  client: Client,
  args: string[],
  { signal }: { signal?: AbortSignal },
): Promise<void | number> {
  const content = decoder.decode(await readAll(Deno.stdin.readable));
  const { attrs, body } = test(content, ["yaml"]) ? extract(content) : {
    attrs: {},
    body: content,
  };
  const props = maybe(attrs, is.Record);
  const options = parseArgs(args, {
    string: ["title", "tag", "scope", "group"],
    collect: ["tag", "group"],
    boolean: ["draft", "notice", "json"],
    negatable: ["draft", "notice"],
    default: {
      title: maybe(props?.title, is.String),
      draft: maybe(props?.draft, is.Boolean),
      notice: maybe(props?.notice, is.Boolean),
      tag: maybe(props?.tags, is.ArrayOf(is.String)),
      scope: maybe(props?.scope, isScope),
      group: maybe(props?.groups, is.ArrayOf(is.String)),
    },
  });
  const memoId = toMemoId(options._.at(0));
  const title = options.title;
  if (!title) {
    throw new Error("TITLE is required");
  }
  const params: Params = {
    title,
    body,
    draft: options.draft,
    notice: options.notice,
    tags: options.tag,
    scope: maybe(options.scope, isScope),
    groups: options.group?.map((v) => toGroupId(v)),
  };
  const memo = await updateMemo(client, memoId, params, { signal });
  if (options.json) {
    console.log(JSON.stringify(memo));
  } else {
    // XXX
    console.log(memo.title);
  }
}
