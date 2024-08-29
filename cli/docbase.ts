import "@std/dotenv/load";
import { toSnakeCase } from "@std/text/to-snake-case";
import { Client } from "../client.ts";

const availableCommands = new Set([
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

function mustGetEnv(key: string): string {
  const value = Deno.env.get(key);
  if (value == null) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

async function printUsage(
  { command, signal }: { command?: string; signal?: AbortSignal } = {},
): Promise<void> {
  const resp = await fetch(
    import.meta.resolve(`./${toSnakeCase(command ?? "docbase")}.txt`),
    { signal },
  );
  console.log(await resp.text());
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

  const client = new Client({
    token: mustGetEnv("DOCBASE_API_TOKEN"),
    domain: mustGetEnv("DOCBASE_TEAM_NAME"),
  }, {
    baseUrl: new URL(
      Deno.env.get("DOCBASE_BASE_URL") ?? "https://api.docbase.io",
    ),
  });

  const [command, ...args] = Deno.args;
  if (!availableCommands.has(command)) {
    throw new Error(`Unknown command: ${command}`);
  }
  if (args.includes("--help") || args.includes("-h")) {
    await printUsage({ command, signal });
    return;
  }
  const { main } = await import(`./_${toSnakeCase(command)}.ts`);
  await main(client, args, { signal });
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
