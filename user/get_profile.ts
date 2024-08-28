import { ensure } from "@core/unknownutil";
import type { Client } from "../client.ts";
import type { Profile } from "./type.ts";
import { isProfile } from "./_predicate.ts";

export async function getProfile(client: Client): Promise<Profile> {
  const data = await client.request("profile");
  return ensure(data, isProfile);
}
