import { assertEquals } from "@std/assert";
import { startDummyServer } from "../_testutil.ts";
import { Client } from "../client.ts";
import { unarchiveMemo } from "./unarchive_memo.ts";

Deno.test("unarchiveMemo", async (t) => {
  const domain = "domain";
  const token = "token";
  await t.step("unarchives memo", async () => {
    await using baseUrl = startDummyServer((req, _info) => {
      assertEquals(req.method, "PUT");
      assertEquals(
        new URL(req.url).pathname,
        `/teams/${domain}/posts/1/unarchive`,
      );
      return new Response(null, { status: 204 });
    });
    const client = new Client(
      { domain, token },
      { baseUrl },
    );
    await unarchiveMemo(client, 1);
  });
});
