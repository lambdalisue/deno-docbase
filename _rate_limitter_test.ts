import {
  assertAlmostEquals,
  assertEquals,
  assertRejects,
  assertThrows,
} from "@std/assert";
import { RateLimitter } from "./_rate_limitter.ts";

Deno.test("RateLimitter", async (t) => {
  await t.step("fromResponse returns a new RateLimitter instance", () => {
    const reset = Date.now() + 1000;
    const resp = new Response("", {
      headers: {
        "X-RateLimit-Limit": "100",
        "X-RateLimit-Remaining": "99",
        "X-RateLimit-Reset": reset.toString(),
      },
    });
    const rateLimitter = RateLimitter.fromResponse(resp);
    assertEquals(rateLimitter.reset, reset);
  });

  await t.step(
    "fromResponse throws Error when X-RateLimit-Reset header is missing",
    () => {
      const resp = new Response("", {
        headers: {
          "X-RateLimit-Limit": "100",
          "X-RateLimit-Remaining": "99",
        },
      });
      assertThrows(() => RateLimitter.fromResponse(resp), Error);
    },
  );

  await t.step(
    "fromResponse throws Error when X-RateLimit-Reset header is invalid",
    () => {
      const resp = new Response("", {
        headers: {
          "X-RateLimit-Limit": "100",
          "X-RateLimit-Remaining": "99",
          "X-RateLimit-Reset": "invalid",
        },
      });
      assertThrows(() => RateLimitter.fromResponse(resp), Error);
    },
  );

  await t.step(
    "wait waits until the reset time has passed",
    async () => {
      const rateLimitter = new RateLimitter(Date.now() + 100);
      const start = performance.now();
      await rateLimitter.wait();
      const diff = performance.now() - start;
      assertAlmostEquals(diff, 100, 10);
    },
  );

  await t.step(
    "wait immediately return when the reset time is past",
    async () => {
      const rateLimitter = new RateLimitter(Date.now() - 100);
      const start = performance.now();
      await rateLimitter.wait();
      const diff = performance.now() - start;
      assertAlmostEquals(diff, 0, 10);
    },
  );

  await t.step(
    "wait immediately rejects an error when the signal is already aborted",
    async () => {
      const controller = new AbortController();
      controller.abort();
      const rateLimitter = new RateLimitter(Date.now() + 500);
      const start = performance.now();
      await assertRejects(
        () => rateLimitter.wait({ signal: controller.signal }),
        DOMException,
      );
      const diff = performance.now() - start;
      assertAlmostEquals(diff, 0, 10);
    },
  );

  await t.step(
    "wait rejects an error when the signal is aborted",
    async () => {
      const controller = new AbortController();
      const rateLimitter = new RateLimitter(Date.now() + 500);
      const start = performance.now();
      setTimeout(() => controller.abort(), 100);
      await assertRejects(
        () => rateLimitter.wait({ signal: controller.signal }),
        DOMException,
      );
      const diff = performance.now() - start;
      assertAlmostEquals(diff, 100, 10);
    },
  );
});
