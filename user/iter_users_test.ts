import { assertEquals } from "@std/assert";
import { startDummyServer } from "../_testutil.ts";
import { Client } from "../client.ts";
import { iterUsers } from "./iter_users.ts";

// https://help.docbase.io/posts/680809
const sample = [
  {
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
  },
  {
    "id": 2,
    "name": "ドックベースウーマン",
    "username": "docbasewoman",
    "profile_image_url": "https://image.docbase.io/uploads/aaa.gif",
    "role": "admin",
    "posts_count": 3,
    "last_access_time": "2019-02-18T11:52:56.000+09:00",
    "two_step_authentication": false,
    "groups": [],
  },
  {
    "id": 3,
    "name": "ドックべーサー",
    "username": "docbaser",
    "profile_image_url": "https://image.docbase.io/uploads/aaa.gif",
    "role": "user",
    "posts_count": 5,
    "last_access_time": "2019-02-18T11:52:56.000+09:00",
    "two_step_authentication": false,
    "groups": [],
  },
];

Deno.test("iterUsers", async (t) => {
  const domain = "domain";
  const token = "token";
  await t.step("iterates over users (sample)", async () => {
    await using baseUrl = startDummyServer((req, _info) => {
      assertEquals(req.method, "GET");
      const url = new URL(req.url);
      assertEquals(url.pathname, `/teams/${domain}/users`);
      switch (url.searchParams.get("page")) {
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
    const users = await Array.fromAsync(iterUsers(client));
    assertEquals(users, [
      {
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
      },
      {
        id: 2,
        name: "ドックベースウーマン",
        username: "docbasewoman",
        profileImageUrl: "https://image.docbase.io/uploads/aaa.gif",
        role: "admin",
        postsCount: 3,
        lastAccessTime: "2019-02-18T11:52:56.000+09:00",
        twoStepAuthentication: false,
        groups: [],
      },
      {
        id: 3,
        name: "ドックべーサー",
        username: "docbaser",
        profileImageUrl: "https://image.docbase.io/uploads/aaa.gif",
        role: "user",
        postsCount: 5,
        lastAccessTime: "2019-02-18T11:52:56.000+09:00",
        twoStepAuthentication: false,
        groups: [],
      },
    ]);
  });

  await t.step("iterates over users (massive)", async () => {
    let count = 0;
    await using baseUrl = startDummyServer((req, _info) => {
      count++;
      assertEquals(req.method, "GET");
      const url = new URL(req.url);
      assertEquals(url.pathname, `/teams/${domain}/users`);
      switch (url.searchParams.get("page")) {
        case "1":
          return new Response(
            JSON.stringify(Array.from({ length: 100 }, (_, i) => {
              const index = i + 1;
              return {
                "id": index,
                "name": `ユーザ${index}`,
                "username": `user${index}`,
                "profile_image_url":
                  `https://image.docbase.io/uploads/${index}.gif`,
                "role": "user",
                "posts_count": 0,
                "last_access_time": "2019-02-18T11:52:56.000+09:00",
                "two_step_authentication": false,
                "groups": [],
              };
            })),
          );
        case "2":
          return new Response(
            JSON.stringify(Array.from({ length: 50 }, (_, i) => {
              const index = i + 101;
              return {
                "id": index,
                "name": `ユーザ${index}`,
                "username": `user${index}`,
                "profile_image_url":
                  `https://image.docbase.io/uploads/${index}.gif`,
                "role": "user",
                "posts_count": 0,
                "last_access_time": "2019-02-18T11:52:56.000+09:00",
                "two_step_authentication": false,
                "groups": [],
              };
            })),
          );
        default:
          throw new Error("Unexpected request");
      }
    });
    const client = new Client(
      { domain, token },
      { baseUrl },
    );
    const users = await Array.fromAsync(iterUsers(client));
    assertEquals(users.length, 150);
    assertEquals(count, 2);
  });

  await t.step(
    "iterates over users (massive + includeUserGroups)",
    async () => {
      let count = 0;
      await using baseUrl = startDummyServer((req, _info) => {
        count++;
        assertEquals(req.method, "GET");
        const url = new URL(req.url);
        assertEquals(url.pathname, `/teams/${domain}/users`);
        assertEquals(url.searchParams.get("include_user_groups"), "true");
        switch (url.searchParams.get("page")) {
          case "1":
            return new Response(
              JSON.stringify(Array.from({ length: 100 }, (_, i) => {
                const index = i + 1;
                return {
                  "id": index,
                  "name": `ユーザ${index}`,
                  "username": `user${index}`,
                  "profile_image_url":
                    `https://image.docbase.io/uploads/${index}.gif`,
                  "role": "user",
                  "posts_count": 0,
                  "last_access_time": "2019-02-18T11:52:56.000+09:00",
                  "two_step_authentication": false,
                  "groups": [],
                };
              })),
            );
          case "2":
            return new Response(
              JSON.stringify(Array.from({ length: 50 }, (_, i) => {
                const index = i + 101;
                return {
                  "id": index,
                  "name": `ユーザ${index}`,
                  "username": `user${index}`,
                  "profile_image_url":
                    `https://image.docbase.io/uploads/${index}.gif`,
                  "role": "user",
                  "posts_count": 0,
                  "last_access_time": "2019-02-18T11:52:56.000+09:00",
                  "two_step_authentication": false,
                  "groups": [],
                };
              })),
            );
          default:
            throw new Error("Unexpected request");
        }
      });
      const client = new Client(
        { domain, token },
        { baseUrl },
      );
      const users = await Array.fromAsync(
        iterUsers(client, { includeUserGroups: true }),
      );
      assertEquals(users.length, 150);
      assertEquals(count, 2);
    },
  );
});
