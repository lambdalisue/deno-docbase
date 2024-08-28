import { assertEquals } from "@std/assert";
import { startDummyServer } from "../_testutil.ts";
import { Client } from "../client.ts";
import { iterMemos } from "./iter_memos.ts";

// https://help.docbase.io/posts/92984
const sample = {
  "posts": [
    {
      "id": 4,
      "title": "メモのタイトル",
      "body": "メモの本文",
      "draft": false,
      "archived": false,
      "url": "https://kray.docbase.io/posts/4",
      "created_at": "2016-04-15T18:19:03+09:00",
      "updated_at": "2016-04-15T18:19:03+09:00",
      "scope": "everyone",
      "sharing_url":
        "https://docbase.io/posts/1/sharing/abcdefgh-0e81-4567-9876-1234567890ab",
      "tags": [
        { "name": "日報" },
      ],
      "user": {
        "id": 3,
        "name": "user3",
        "profile_image_url": "https://image.docbase.io/uploads/aaa.gif",
      },
      "stars_count": 1,
      "good_jobs_count": 2,
      "comments": [
        {
          "id": 7,
          "body": "コメント本文",
          "created_at": "2016-05-13T17:07:18+09:00",
          "user": {
            "id": 2,
            "name": "user2",
            "profile_image_url": "https://image.docbase.io/uploads/aaa.gif",
          },
        },
      ],
      "groups": [],
    },
  ],
  "meta": {
    "previous_page": null,
    // The 'next_page' field exists in the official document but contents are missing
    // so we omit the next_page field here.
    "next_page": null,
    "total": 1,
  },
};

Deno.test("iterMemos", async (t) => {
  const domain = "domain";
  const token = "token";
  await t.step("iterates over memos (sample)", async () => {
    await using baseUrl = startDummyServer((req, _info) => {
      assertEquals(req.method, "GET");
      const url = new URL(req.url);
      assertEquals(url.pathname, `/teams/${domain}/posts`);
      switch (url.searchParams.get("page") ?? "1") {
        case "1":
          return new Response(JSON.stringify(sample));
        default:
          throw new Error("Unexpected request");
      }
    });
    const client = new Client(
      { domain, token },
      { baseUrl },
    );
    const users = await Array.fromAsync(iterMemos(client));
    assertEquals(users, [
      {
        id: 4,
        title: "メモのタイトル",
        body: "メモの本文",
        draft: false,
        archived: false,
        url: "https://kray.docbase.io/posts/4",
        createdAt: "2016-04-15T18:19:03+09:00",
        updatedAt: "2016-04-15T18:19:03+09:00",
        scope: "everyone",
        sharingUrl:
          "https://docbase.io/posts/1/sharing/abcdefgh-0e81-4567-9876-1234567890ab",
        tags: [
          { "name": "日報" },
        ],
        user: {
          id: 3,
          name: "user3",
          profileImageUrl: "https://image.docbase.io/uploads/aaa.gif",
        },
        starsCount: 1,
        goodJobsCount: 2,
        comments: [
          {
            id: 7,
            body: "コメント本文",
            createdAt: "2016-05-13T17:07:18+09:00",
            user: {
              id: 2,
              name: "user2",
              profileImageUrl: "https://image.docbase.io/uploads/aaa.gif",
            },
          },
        ],
        groups: [],
      },
    ]);
  });

  await t.step("iterates over memos (massive)", async () => {
    let count = 0;
    await using baseUrl = startDummyServer((req, _info) => {
      count++;
      assertEquals(req.method, "GET");
      const url = new URL(req.url);
      assertEquals(url.pathname, `/teams/${domain}/posts`);
      switch (url.searchParams.get("page") ?? "1") {
        case "1":
          return new Response(
            JSON.stringify({
              posts: Array.from({ length: 100 }, (_, i) => {
                const index = i + 1;
                return {
                  "id": index,
                  "title": `メモ${index}`,
                  "body": `メモの本文${index}`,
                  "draft": false,
                  "archived": false,
                  "url": `https://kray.docbase.io/posts/${index}`,
                  "created_at": "2016-04-15T18:19:03+09:00",
                  "updated_at": "2016-04-15T18:19:03+09:00",
                  "scope": "everyone",
                  "sharing_url":
                    `https://docbase.io/posts/${index}/sharing/abcdefgh-0e81-4567-9876-1234567890ab`,
                  "tags": [
                    { "name": "日報" },
                  ],
                  "user": {
                    "id": index,
                    "name": `user${index}`,
                    "profile_image_url":
                      `https://image.docbase.io/uploads/${index}.gif`,
                  },
                  "stars_count": 1,
                  "good_jobs_count": 2,
                  "comments": [],
                  "groups": [],
                };
              }),
              meta: {
                previous_page: null,
                next_page:
                  `${baseUrl}/teams/${domain}/posts?page=2&per_page=100`,
                total: 150,
              },
            }),
          );
        case "2":
          return new Response(
            JSON.stringify({
              posts: Array.from({ length: 50 }, (_, i) => {
                const index = i + 101;
                return {
                  "id": index,
                  "title": `メモ${index}`,
                  "body": `メモの本文${index}`,
                  "draft": false,
                  "archived": false,
                  "url": `https://kray.docbase.io/posts/${index}`,
                  "created_at": "2016-04-15T18:19:03+09:00",
                  "updated_at": "2016-04-15T18:19:03+09:00",
                  "scope": "everyone",
                  "sharing_url":
                    `https://docbase.io/posts/${index}/sharing/abcdefgh-0e81-4567-9876-1234567890ab`,
                  "tags": [
                    { "name": "日報" },
                  ],
                  "user": {
                    "id": index,
                    "name": `user${index}`,
                    "profile_image_url":
                      `https://image.docbase.io/uploads/${index}.gif`,
                  },
                  "stars_count": 1,
                  "good_jobs_count": 2,
                  "comments": [],
                  "groups": [],
                };
              }),
              meta: {
                previous_page:
                  `${baseUrl}/teams/${domain}/posts?page=1&per_page=100`,
                next_page: null,
                total: 150,
              },
            }),
          );
        default:
          throw new Error("Unexpected request");
      }
    });
    const client = new Client(
      { domain, token },
      { baseUrl },
    );
    const users = await Array.fromAsync(iterMemos(client));
    assertEquals(users.length, 150);
    assertEquals(count, 2);
  });
});
