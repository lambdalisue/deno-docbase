import { assertEquals } from "@std/assert";
import { startDummyServer } from "../_testutil.ts";
import { Client } from "../client.ts";
import { uploadAttachments } from "./upload_attachments.ts";

// https://help.docbase.io/posts/225804
const sample = [
  {
    // The id field is number in the official document but it seems
    // it is actually string (actual filename).
    "id": "5f237f15-714d-4b27-950a-e27e57e9d9e5.png",
    "name": "image1.png",
    "size": 132323,
    "url":
      "https://image.docbase.io/uploads/5f237f15-714d-4b27-950a-e27e57e9d9e5.png",
    "markdown":
      "![image.png](https://image.docbase.io/uploads/5f237f15-714d-4b27-950a-e27e57e9d9e5.png)",
    "created_at": "2017-05-12T18:02:55+09:00",
  },
  {
    // The id field is number in the official document but it seems
    // it is actually string (actual filename).
    "id": "5f237f15-714d-4b27-950a-e27e57e9d9e6.png",
    "name": "image2.png",
    "size": 132324,
    "url":
      "https://image.docbase.io/uploads/5f237f15-714d-4b27-950a-e27e57e9d9e6.png",
    "markdown":
      "![image.png](https://image.docbase.io/uploads/5f237f15-714d-4b27-950a-e27e57e9d9e6.png)",
    "created_at": "2017-05-12T18:02:56+09:00",
  },
];

Deno.test("uploadAttachments", async (t) => {
  const domain = "domain";
  const token = "token";
  await t.step("upload contents and return uploaded attachments", async () => {
    await using baseUrl = startDummyServer(async (req, _info) => {
      assertEquals(req.method, "POST");
      assertEquals(
        new URL(req.url).pathname,
        `/teams/${domain}/attachments`,
      );
      assertEquals(await req.json(), [
        { name: "image1.png", content: "..." },
        { name: "image2.png", content: "..." },
      ]);
      return new Response(JSON.stringify(sample));
    });
    const client = new Client(
      { domain, token },
      { baseUrl },
    );
    const result = await uploadAttachments(client, [
      { name: "image1.png", content: "..." },
      { name: "image2.png", content: "..." },
    ]);
    assertEquals(result, [
      {
        id: "5f237f15-714d-4b27-950a-e27e57e9d9e5.png",
        name: "image1.png",
        size: 132323,
        url:
          "https://image.docbase.io/uploads/5f237f15-714d-4b27-950a-e27e57e9d9e5.png",
        markdown:
          "![image.png](https://image.docbase.io/uploads/5f237f15-714d-4b27-950a-e27e57e9d9e5.png)",
        createdAt: "2017-05-12T18:02:55+09:00",
      },
      {
        id: "5f237f15-714d-4b27-950a-e27e57e9d9e6.png",
        name: "image2.png",
        size: 132324,
        url:
          "https://image.docbase.io/uploads/5f237f15-714d-4b27-950a-e27e57e9d9e6.png",
        markdown:
          "![image.png](https://image.docbase.io/uploads/5f237f15-714d-4b27-950a-e27e57e9d9e6.png)",
        createdAt: "2017-05-12T18:02:56+09:00",
      },
    ]);
  });
});
