import { assertEquals } from "@std/assert";
import { startDummyServer } from "../_testutil.ts";
import { Client } from "../client.ts";
import { getProfile } from "./get_profile.ts";

// https://help.docbase.io/posts/2071796
const sample = {
  "id": 1,
  "name": "ドックベースマン",
  "username": "docbaseman",
  "profile_image_url": "https://image.docbase.io/uploads/aaa.gif",
  "role": "owner",
  "posts_count": 2,
  "last_access_time": "2019-02-18T11:52:56.000+09:00",
  "two_step_authentication": false,
  "groups": [
    {
      "id": 1,
      "name": "グループ1",
    },
  ],
  "email": "docbaseman@docbase.io",
  "nameid": "docbaseman@docbase.io", // SSOが有効なチームにおいてAPIを実行した場合のみ
};

Deno.test("getProfile", async (t) => {
  const domain = "domain";
  const token = "token";
  await t.step("returns profile", async () => {
    await using baseUrl = startDummyServer((req, _info) => {
      assertEquals(req.method, "GET");
      assertEquals(new URL(req.url).pathname, `/teams/${domain}/profile`);
      return new Response(JSON.stringify(sample));
    });
    const client = new Client(
      { domain, token },
      { baseUrl },
    );
    const result = await getProfile(client);
    assertEquals(result, {
      id: 1,
      name: "ドックベースマン",
      username: "docbaseman",
      profileImageUrl: "https://image.docbase.io/uploads/aaa.gif",
      role: "owner",
      postsCount: 2,
      lastAccessTime: "2019-02-18T11:52:56.000+09:00",
      twoStepAuthentication: false,
      groups: [
        {
          id: 1,
          name: "グループ1",
        },
      ],
      email: "docbaseman@docbase.io",
      nameid: "docbaseman@docbase.io",
    });
  });
});
