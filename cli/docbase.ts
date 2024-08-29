import "@std/dotenv/load";
import { join } from "@std/path/join";
import { promptSecret } from "@std/cli/prompt-secret";
import { toSnakeCase } from "@std/text/to-snake-case";
import { Keystore } from "./_keystore.ts";
import { Client } from "../client.ts";

const availableCommands = new Set([
  "login",
  "list",
  "get",
  "post",
  "update",
  "delete",
  "archive",
  "unarchive",
  "post-comment",
  "delete-comment",
  "profile",
  "list-users",
  "list-tags",
  "list-groups",
  "get-group",
  "add-users-to-group",
  "remove-users-from-group",
  "upload",
  "download",
]);

const keystoreFile = Deno.env.get("DOCBASE_KEYSTORE_PATH") ?? join(
  Deno.env.get("HOME") ?? "/",
  ".docbase/keystore.json",
);

const baseUrl = new URL(
  Deno.env.get("DOCBASE_BASE_URL") ?? "https://api.docbase.io",
);

async function printUsage(
  { command, signal }: { command?: string; signal?: AbortSignal } = {},
): Promise<void> {
  const resp = await fetch(
    import.meta.resolve(`./${toSnakeCase(command ?? "docbase")}.txt`),
    { signal },
  );
  console.log(await resp.text());
}

async function login(
  keystore: Keystore,
  domain: string,
  { signal }: { signal: AbortSignal },
): Promise<void> {
  const token = promptSecret("Token:");
  if (!token) {
    console.log("Cancelled");
    return;
  }
  // Check if the token is valid
  const client = new Client({ token, domain }, { baseUrl });
  try {
    await invoke(client, "profile", [], { signal });
  } catch (err) {
    throw new Error(`Failed to login ${domain}: ${err}`);
  }
  keystore.set(domain, token);
  await keystore.save(keystoreFile, { signal });
}

async function invoke(
  client: Client,
  command: string,
  args: string[],
  { signal }: { signal: AbortSignal },
): Promise<void> {
  const { main } = await import(`./_${toSnakeCase(command)}.ts`);
  await main(client, args, { signal });
}

async function main(): Promise<void | number> {
  const controller = new AbortController();
  const { signal } = controller;
  Deno.addSignalListener("SIGINT", () => {
    controller.abort();
  });

  if (Deno.args.length === 0) {
    await printUsage({ signal });
    return 1;
  }

  const [command, domain = undefined, ...args] = Deno.args;
  if (!availableCommands.has(command)) {
    throw new Error(`Unknown command: ${command}`);
  } else if (Deno.args.includes("--help") || Deno.args.includes("-h")) {
    await printUsage({ command, signal });
    return;
  } else if (!domain) {
    throw new Error("DOMAIN must be specified");
  }

  const keystore = await Keystore.fromFile(keystoreFile, { signal });
  if (command === "login") {
    await login(keystore, domain, { signal });
    return;
  }

  const client = new Client({ token: keystore.get(domain), domain }, {
    baseUrl,
  });
  await invoke(client, command, args, { signal });
}

if (import.meta.main) {
  try {
    const exitCode = await main() ?? 0;
    Deno.exit(exitCode);
  } catch (err) {
    console.error(err.message ?? err);
    Deno.exit(1);
  }
}
