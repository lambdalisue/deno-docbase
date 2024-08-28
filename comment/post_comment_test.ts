import { assertEquals } from "@std/assert";
import { startDummyServer } from "../_testutil.ts";
import { Client } from "../client.ts";
import { postComment } from "./post_comment.ts";

// https://help.docbase.io/posts/216289
const sample = {
  "id": 1,
  "body": "コメント",
  "created_at": "2015-03-10T12:01:54+09:00",
  "user": {
    "id": 1,
    "name": "danny",
    "profile_image_url": "https://image.docbase.io/uploads/aaa.gif",
  },
};

Deno.test("postComment", async (t) => {
  const domain = "domain";
  const token = "token";
  await t.step("post comment and return a created comment", async () => {
    await using baseUrl = startDummyServer(async (req, _info) => {
      assertEquals(req.method, "POST");
      assertEquals(
        new URL(req.url).pathname,
        `/teams/${domain}/posts/1/comments`,
      );
      assertEquals(await req.json(), {
        body: "コメント",
        notice: false,
      });
      return new Response(JSON.stringify(sample));
    });
    const client = new Client(
      { domain, token },
      { baseUrl },
    );
    const result = await postComment(client, 1, {
      body: "コメント",
      notice: false,
    });
    assertEquals(result, {
      id: 1,
      body: "コメント",
      createdAt: "2015-03-10T12:01:54+09:00",
      user: {
        id: 1,
        name: "danny",
        profileImageUrl: "https://image.docbase.io/uploads/aaa.gif",
      },
    });
  });
});
