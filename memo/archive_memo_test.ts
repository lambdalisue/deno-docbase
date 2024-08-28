import { assertEquals } from "@std/assert";
import { startDummyServer } from "../_testutil.ts";
import { Client } from "../client.ts";
import { archiveMemo } from "./archive_memo.ts";

Deno.test("archiveMemo", async (t) => {
  const domain = "domain";
  const token = "token";
  await t.step("archives memo", async () => {
    await using baseUrl = startDummyServer((req, _info) => {
      assertEquals(req.method, "PUT");
      assertEquals(
        new URL(req.url).pathname,
        `/teams/${domain}/posts/1/archive`,
      );
      return new Response(null, { status: 204 });
    });
    const client = new Client(
      { domain, token },
      { baseUrl },
    );
    await archiveMemo(client, 1);
  });
});
