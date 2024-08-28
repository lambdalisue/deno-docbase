import { assertEquals } from "@std/assert";
import { startDummyServer } from "../_testutil.ts";
import { Client } from "../client.ts";
import { createGroup } from "./create_group.ts";

// https://help.docbase.io/posts/652985
const sample = {
  "id": 1,
  "name": "グループ1",
  "description": "APIで作ったグループ",
  "posts_count": 0,
  "last_activity_at": "2019-02-15T15:22:28.000+09:00",
  "created_at": "2019-02-15T15:22:28.000+09:00",
  "users": [
    {
      "id": 1,
      "name": "docbaseman",
      "profile_image_url": "https://image.docbase.io/uploads/aaa.gif",
      // The 'admin' field is missing from the official document but
      // it seems this field is actually returned.
      "admin": true,
    },
  ],
};

Deno.test("createGroup", async (t) => {
  const domain = "domain";
  const token = "token";
  await t.step("returns group", async () => {
    await using baseUrl = startDummyServer(async (req, _info) => {
      assertEquals(req.method, "POST");
      assertEquals(new URL(req.url).pathname, `/teams/${domain}/groups`);
      assertEquals(await req.json(), {
        name: "グループ1",
        description: "APIで作ったグループ",
      });
      return new Response(JSON.stringify(sample));
    });
    const client = new Client(
      { domain, token },
      { baseUrl },
    );
    const result = await createGroup(client, {
      name: "グループ1",
      description: "APIで作ったグループ",
    });
    assertEquals(result, {
      id: 1,
      name: "グループ1",
      description: "APIで作ったグループ",
      postsCount: 0,
      lastActivityAt: "2019-02-15T15:22:28.000+09:00",
      createdAt: "2019-02-15T15:22:28.000+09:00",
      users: [
        {
          id: 1,
          name: "docbaseman",
          profileImageUrl: "https://image.docbase.io/uploads/aaa.gif",
          admin: true,
        },
      ],
    });
  });
});
