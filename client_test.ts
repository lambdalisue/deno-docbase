import { assertAlmostEquals, assertEquals, assertRejects } from "@std/assert";
import { startDummyServer } from "./_testutil.ts";
import { Client, RequestError } from "./client.ts";

Deno.test("Client", async (t) => {
  const domain = "domain";
  const token = "token";

  await t.step("fetch method accesses DocBase API properly", async () => {
    await using baseUrl = startDummyServer((req, _info) => {
      assertEquals(req.headers.get("X-DocBaseToken"), token);
      assertEquals(req.headers.get("X-Api-Version"), "2");
      assertEquals(req.headers.get("Content-Type"), "application/json");
      assertEquals(
        new URL(req.url).pathname,
        `/teams/${domain}/path/to/resource`,
      );
      return new Response("Ok");
    });
    const client = new Client(
      { domain, token },
      { baseUrl },
    );
    assertEquals(await (await client.fetch("path/to/resource")).text(), "Ok");
  });

  await t.step("request method accesses DocBase API properly", async () => {
    await using baseUrl = startDummyServer((req, _info) => {
      assertEquals(req.headers.get("X-DocBaseToken"), token);
      assertEquals(req.headers.get("X-Api-Version"), "2");
      assertEquals(req.headers.get("Content-Type"), "application/json");
      assertEquals(
        new URL(req.url).pathname,
        `/teams/${domain}/path/to/resource`,
      );
      return new Response(JSON.stringify({
        "status_text": "ok",
      }));
    });
    const client = new Client(
      { domain, token },
      { baseUrl },
    );
    assertEquals(await client.request("path/to/resource"), {
      statusText: "ok",
    });
  });

  await t.step(
    "request method accesses DocBase API properly (204)",
    async () => {
      await using baseUrl = startDummyServer((req, _info) => {
        assertEquals(req.headers.get("X-DocBaseToken"), token);
        assertEquals(req.headers.get("X-Api-Version"), "2");
        assertEquals(req.headers.get("Content-Type"), "application/json");
        assertEquals(
          new URL(req.url).pathname,
          `/teams/${domain}/path/to/resource`,
        );
        return new Response(null, { status: 204 });
      });
      const client = new Client(
        { domain, token },
        { baseUrl },
      );
      assertEquals(await client.request("path/to/resource"), undefined);
    },
  );

  await t.step(
    "request method accesses DocBase API properly (skipCaseTransform)",
    async () => {
      await using baseUrl = startDummyServer((req, _info) => {
        assertEquals(req.headers.get("X-DocBaseToken"), token);
        assertEquals(req.headers.get("X-Api-Version"), "2");
        assertEquals(req.headers.get("Content-Type"), "application/json");
        assertEquals(
          new URL(req.url).pathname,
          `/teams/${domain}/path/to/resource`,
        );
        return new Response(JSON.stringify({
          "status_text": "ok",
        }));
      });
      const client = new Client(
        { domain, token },
        { baseUrl },
      );
      assertEquals(
        await client.request("path/to/resource", undefined, {
          skipCaseTransform: true,
        }),
        {
          status_text: "ok",
        },
      );
    },
  );

  await t.step(
    "request throws RequestError when API returns 400 Bad request",
    async () => {
      await using baseUrl = startDummyServer((_req, _info) => {
        return new Response("Bad request", { status: 400 });
      });
      const client = new Client(
        { domain, token },
        { baseUrl },
      );
      await assertRejects(
        () => client.request("path/to/resource"),
        RequestError,
        "Bad request",
      );
    },
  );

  await t.step(
    "request waits X-RateLimit-Reset and retry the request whe API returns 429 Too many requests",
    async () => {
      let count = 0;
      await using baseUrl = startDummyServer((_req, _info) => {
        count++;
        if (count === 1) {
          return new Response("Too many requests", {
            status: 429,
            headers: new Headers({
              "X-RateLimit-Reset": (Date.now() + 100).toString(),
            }),
          });
        } else {
          return new Response(JSON.stringify({
            "status": "ok",
          }));
        }
      });
      const client = new Client(
        { domain, token },
        { baseUrl },
      );
      const start = performance.now();
      assertEquals(await client.request("path/to/resource"), {
        status: "ok",
      });
      const diff = performance.now() - start;
      assertEquals(count, 2);
      assertAlmostEquals(diff, 100, 10);
    },
  );
});
