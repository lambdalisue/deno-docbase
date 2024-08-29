import { assert, is } from "@core/unknownutil";
import { ensureFile } from "@std/fs/ensure-file";
import { dirname } from "@std/path/dirname";

const isStringRecord = is.RecordOf(is.String, is.String);

export class Keystore {
  #tokens: Map<string, string>;

  constructor(tokens: Record<string, string>) {
    this.#tokens = new Map(Object.entries(tokens));
  }

  static async fromFile(
    path: string,
    { signal }: { signal?: AbortSignal } = {},
  ): Promise<Keystore> {
    try {
      const data = JSON.parse(await Deno.readTextFile(path, { signal }));
      assert(data, isStringRecord);
      return new Keystore(data);
    } catch (err) {
      if (err instanceof Deno.errors.NotFound) {
        // Do nothing
      } else {
        console.warn(`Failed to read keystore from ${path}: ${err}`);
      }
      return new Keystore({});
    }
  }

  get(domain: string): string {
    return this.#tokens.get(domain) ?? "";
  }

  set(domain: string, token: string): void {
    this.#tokens.set(domain, token);
  }

  async save(path: string, { signal }: { signal?: AbortSignal }) {
    await ensureFile(path);
    await Deno.writeTextFile(
      path,
      JSON.stringify(Object.fromEntries(this.#tokens)),
      { signal },
    );
    await Deno.chmod(path, 0o600);
    await Deno.chmod(dirname(path), 0o500);
  }
}
