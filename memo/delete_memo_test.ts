import { assertEquals } from "@std/assert";
import { startDummyServer } from "../_testutil.ts";
import { Client } from "../client.ts";
import { deleteMemo } from "./delete_memo.ts";

Deno.test("deleteMemo", async (t) => {
  const domain = "domain";
  const token = "token";
  await t.step("deletes memo", async () => {
    await using baseUrl = startDummyServer((req, _info) => {
      assertEquals(req.method, "DELETE");
      assertEquals(new URL(req.url).pathname, `/teams/${domain}/posts/1`);
      return new Response(null, { status: 204 });
    });
    const client = new Client(
      { domain, token },
      { baseUrl },
    );
    await deleteMemo(client, 1);
  });
});
