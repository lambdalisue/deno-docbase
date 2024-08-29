import { is, maybe } from "@core/unknownutil";
import { readAll } from "@core/streamutil/read-all";
import { parseArgs } from "@std/cli/parse-args";
import { extract } from "@std/front-matter/yaml";
import { test } from "@std/front-matter/test";
import { unnullish } from "@lambdalisue/unnullish";
import { type Params, postComment } from "../comment/post_comment.ts";
import type { Client } from "../client.ts";
import { toMemoId, toUserId } from "./_util.ts";

const decoder = new TextDecoder();

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
    string: ["author-id", "published-at"],
    boolean: ["notice", "json"],
    negatable: ["notice"],
    default: {
      notice: maybe(props?.notice, is.Boolean),
    },
  });
  const memoId = toMemoId(options._.at(0));
  const params: Params = {
    body,
    notice: maybe(options.notice, is.Boolean),
    authorId: unnullish(options["author-id"], (v) => toUserId(v)),
    publishedAt: maybe(options["published-at"], is.String),
  };
  const comment = await postComment(client, memoId, params, { signal });
  if (options.json) {
    console.log(JSON.stringify(comment));
  } else {
    // XXX
    console.log(comment.id);
  }
}
