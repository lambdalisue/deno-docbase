import { is, maybe } from "@core/unknownutil";
import { readAll } from "@core/streamutil/read-all";
import { parseArgs } from "@std/cli/parse-args";
import { extract } from "@std/front-matter/yaml";
import { test } from "@std/front-matter/test";
import { basename } from "@std/path/basename";
import { extname } from "@std/path/extname";
import { unnullish } from "@lambdalisue/unnullish";
import { type Params, postMemo } from "../memo/post_memo.ts";
import type { Client } from "../client.ts";
import { toGroupId, toUserId } from "./_util.ts";

const decoder = new TextDecoder();

const isStringArray = is.ArrayOf(is.String);
const isScope = is.LiteralOneOf(["everyone", "private", "group"] as const);

export async function main(
  client: Client,
  args: string[],
  { signal }: { signal?: AbortSignal },
): Promise<void | number> {
  const options = parseArgs(args, {
    string: [
      "file",
      "title",
      "tag",
      "scope",
      "group",
      "author-id",
      "published-at",
    ],
    collect: ["tag", "group"],
    boolean: ["draft", "notice", "json"],
    negatable: ["draft", "notice"],
    alias: { file: "f" },
  });
  const content = options.file
    ? await Deno.readTextFile(options.file)
    : decoder.decode(await readAll(Deno.stdin.readable));
  const { attrs, body } = test(content, ["yaml"]) ? extract(content) : {
    attrs: {},
    body: content,
  };
  const props = maybe(attrs, is.Record);
  const title = options.title ?? unnullish(
    options.file,
    (v) => basename(v, extname(v)),
  );
  if (!title) {
    throw new Error("TITLE is required");
  }
  const params: Params = {
    title,
    body,
    draft: options.draft || maybe(props?.draft, is.Boolean),
    notice: !options.notice ? false : maybe(props?.notice, is.Boolean),
    tags: [
      ...options.tag,
      ...(maybe(props?.tag, isStringArray) ?? []),
    ],
    scope: maybe(options.scope, isScope),
    groups: [
      ...options.group?.map((v) => toGroupId(v)),
      ...(maybe(props?.group, isStringArray) ?? []).map((v) => toGroupId(v)),
    ],
    authorId: unnullish(options["author-id"], (v) => toUserId(v)),
    publishedAt: maybe(options["published-at"], is.String),
  };
  const memo = await postMemo(client, params, { signal });
  if (options.json) {
    console.log(JSON.stringify(memo));
  } else {
    // XXX
    console.log(memo.title);
  }
}
