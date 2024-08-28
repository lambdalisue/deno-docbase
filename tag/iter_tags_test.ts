import { assertEquals } from "@std/assert";
import { startDummyServer } from "../_testutil.ts";
import { Client } from "../client.ts";
import { iterTags } from "./iter_tags.ts";

Deno.test("iterTags", async (t) => {
  const domain = "domain";
  const token = "token";
  await t.step("iterates over tags", async () => {
    await using baseUrl = startDummyServer((req, _info) => {
      assertEquals(req.method, "GET");
      assertEquals(new URL(req.url).pathname, `/teams/${domain}/tags`);
      return new Response(JSON.stringify([
        { name: "tag1", preferred: false, starred: false },
        { name: "tag2", preferred: false, starred: false },
        { name: "tag3", preferred: false, starred: false },
        { name: "tag4", preferred: false, starred: false },
      ]));
    });
    const client = new Client(
      { domain, token },
      { baseUrl },
    );
    const tags = await Array.fromAsync(iterTags(client));
    assertEquals(tags, [
      { name: "tag1", preferred: false, starred: false },
      { name: "tag2", preferred: false, starred: false },
      { name: "tag3", preferred: false, starred: false },
      { name: "tag4", preferred: false, starred: false },
    ]);
  });
});
