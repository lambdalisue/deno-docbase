import { assertEquals } from "@std/assert";
import { startDummyServer } from "../_testutil.ts";
import { Client } from "../client.ts";
import { removeUsersFromGroup } from "./remove_users_from_group.ts";

Deno.test("removeUsersFromGroup", async (t) => {
  const domain = "domain";
  const token = "token";
  await t.step("returns group", async () => {
    await using baseUrl = startDummyServer(async (req, _info) => {
      assertEquals(req.method, "DELETE");
      assertEquals(
        new URL(req.url).pathname,
        `/teams/${domain}/groups/1/users`,
      );
      assertEquals(await req.json(), {
        user_ids: [1, 2, 3],
      });
      return new Response(null, { status: 204 });
    });
    const client = new Client(
      { domain, token },
      { baseUrl },
    );
    await removeUsersFromGroup(client, 1, {
      userIds: [1, 2, 3],
    });
  });
});
