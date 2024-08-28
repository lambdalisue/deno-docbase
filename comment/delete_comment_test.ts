import { assertEquals } from "@std/assert";
import { startDummyServer } from "../_testutil.ts";
import { Client } from "../client.ts";
import { deleteComment } from "./delete_comment.ts";

Deno.test("deleteComment", async (t) => {
  const domain = "domain";
  const token = "token";
  await t.step("delete comment", async () => {
    await using baseUrl = startDummyServer((req, _info) => {
      assertEquals(req.method, "DELETE");
      assertEquals(
        new URL(req.url).pathname,
        `/teams/${domain}/comments/1`,
      );
      return new Response(null, { status: 204 });
    });
    const client = new Client(
      { domain, token },
      { baseUrl },
    );
    await deleteComment(client, 1);
  });
});
