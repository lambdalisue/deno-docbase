import { assertEquals } from "@std/assert";
import { startDummyServer } from "../_testutil.ts";
import { Client } from "../client.ts";
import { updateMemo } from "./update_memo.ts";

// https://help.docbase.io/posts/92980
const sample = {
  "id": 1,
  "title": "メモのタイトル",
  "body": "メモの本文を更新",
  "draft": false,
  "archived": false,
  "url": "https://kray.docbase.io/posts/1",
  "created_at": "2015-03-10T12:01:54+09:00",
  "updated_at": "2015-03-10T12:01:54+09:00",
  "tags": [
    { "name": "rails" },
    { "name": "ruby" },
  ],
  "scope": "group",
  "sharing_url":
    "https://docbase.io/posts/1/sharing/abcdefgh-0e81-4567-9876-1234567890ab",
  "representative_image_url":
    "https://image.docbase.io/uploads/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg",
  "user": {
    "id": 1,
    "name": "danny",
    "profile_image_url": "https://image.docbase.io/uploads/aaa.gif",
  },
  "stars_count": 1,
  "good_jobs_count": 2,
  "comments": [],
  "groups": [
    { "id": 1, "name": "DocBase" },
  ],
  "attachments": [
    {
      "id": "461d38b9-8c22-4222-a6a2-a6f2ce98ec3a.csv",
      "name": "uploadfile.csv",
      "size": 18786,
      "url":
        "https://kray.docbase.io/file_attachments/461d38b9-8c22-4222-a6a2-a6f2ce98ec3a.csv",
      "markdown":
        "[![csv](/images/file_icons/csv.svg) uploadfile.jpg](https://kray.docbase.io/uploads/461d38b9-8c22-4222-a6a2-a6f2ce98ec3a.csv)",
      "created_at": "2019-12-18T16:00:34+09:00",
    },
  ],
};

Deno.test("updateMemo", async (t) => {
  const domain = "domain";
  const token = "token";
  await t.step("updates memo and return the memo", async () => {
    await using baseUrl = startDummyServer(async (req, _info) => {
      assertEquals(req.method, "PATCH");
      assertEquals(new URL(req.url).pathname, `/teams/${domain}/posts/1`);
      assertEquals(await req.json(), {
        body: "メモの本文を更新",
      });
      return new Response(JSON.stringify(sample));
    });
    const client = new Client(
      { domain, token },
      { baseUrl },
    );
    const result = await updateMemo(client, 1, {
      body: "メモの本文を更新",
    });
    assertEquals(result, {
      id: 1,
      title: "メモのタイトル",
      body: "メモの本文を更新",
      draft: false,
      archived: false,
      url: "https://kray.docbase.io/posts/1",
      createdAt: "2015-03-10T12:01:54+09:00",
      updatedAt: "2015-03-10T12:01:54+09:00",
      tags: [
        { name: "rails" },
        { name: "ruby" },
      ],
      scope: "group",
      sharingUrl:
        "https://docbase.io/posts/1/sharing/abcdefgh-0e81-4567-9876-1234567890ab",
      representativeImageUrl:
        "https://image.docbase.io/uploads/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg",
      user: {
        id: 1,
        name: "danny",
        profileImageUrl: "https://image.docbase.io/uploads/aaa.gif",
      },
      starsCount: 1,
      goodJobsCount: 2,
      comments: [],
      groups: [
        { id: 1, name: "DocBase" },
      ],
      attachments: [
        {
          id: "461d38b9-8c22-4222-a6a2-a6f2ce98ec3a.csv",
          name: "uploadfile.csv",
          size: 18786,
          url:
            "https://kray.docbase.io/file_attachments/461d38b9-8c22-4222-a6a2-a6f2ce98ec3a.csv",
          markdown:
            "[![csv](/images/file_icons/csv.svg) uploadfile.jpg](https://kray.docbase.io/uploads/461d38b9-8c22-4222-a6a2-a6f2ce98ec3a.csv)",
          createdAt: "2019-12-18T16:00:34+09:00",
        },
      ],
    });
  });
});
