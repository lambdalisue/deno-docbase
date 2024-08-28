import { assertEquals } from "@std/assert";
import { startDummyServer } from "../_testutil.ts";
import { Client } from "../client.ts";
import { downloadAttachment } from "./download_attachment.ts";

Deno.test("downloadAttachment", async (t) => {
  const domain = "domain";
  const token = "token";
  const id = "5f237f15-714d-4b27-950a-e27e57e9d9e5.png";
  await t.step("download content of the attachment", async () => {
    await using baseUrl = startDummyServer((req, _info) => {
      assertEquals(req.method, "GET");
      assertEquals(
        new URL(req.url).pathname,
        `/teams/${domain}/attachments/${id}`,
      );
      return new Response("...", { headers: { "Content-Type": "image/png" } });
    });
    const client = new Client(
      { domain, token },
      { baseUrl },
    );
    const result = await downloadAttachment(client, id);
    assertEquals(result, new TextEncoder().encode("..."));
  });
});
