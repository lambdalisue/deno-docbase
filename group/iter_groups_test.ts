import { assertEquals } from "@std/assert";
import { startDummyServer } from "../_testutil.ts";
import { Client } from "../client.ts";
import { iterGroups } from "./iter_groups.ts";

// https://help.docbase.io/posts/92978
const sample = [
  {
    "id": 1,
    "name": "DocBase",
  },
  {
    "id": 2,
    "name": "kray-internal",
  },
];

Deno.test("iterGroups", async (t) => {
  const domain = "domain";
  const token = "token";
  await t.step("iterates over users (sample)", async () => {
    await using baseUrl = startDummyServer((req, _info) => {
      assertEquals(req.method, "GET");
      const url = new URL(req.url);
      assertEquals(url.pathname, `/teams/${domain}/groups`);
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
    const groups = await Array.fromAsync(iterGroups(client));
    assertEquals(groups, [
      {
        id: 1,
        name: "DocBase",
      },
      {
        id: 2,
        name: "kray-internal",
      },
    ]);
  });

  await t.step("iterates over users (massive)", async () => {
    let count = 0;
    await using baseUrl = startDummyServer((req, _info) => {
      count++;
      assertEquals(req.method, "GET");
      const url = new URL(req.url);
      assertEquals(url.pathname, `/teams/${domain}/groups`);
      switch (url.searchParams.get("page")) {
        case "1":
          return new Response(
            JSON.stringify(Array.from({ length: 200 }, (_, i) => {
              const index = i + 1;
              return {
                "id": index,
                "name": `グループ${index}`,
              };
            })),
          );
        case "2":
          return new Response(
            JSON.stringify(Array.from({ length: 100 }, (_, i) => {
              const index = i + 201;
              return {
                "id": index,
                "name": `グループ${index}`,
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
    const groups = await Array.fromAsync(iterGroups(client));
    assertEquals(groups.length, 300);
    assertEquals(count, 2);
  });
});
