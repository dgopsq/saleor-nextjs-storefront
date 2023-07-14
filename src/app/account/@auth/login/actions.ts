"use server";

import { publicConfig } from "@/misc/config";
import { AuthToken } from "@/queries/user/data";
import { cookies } from "next/headers";

/**
 *
 */
export async function getStoredAuthTokenServer(): Promise<AuthToken | null> {
  const authToken = cookies().get(publicConfig.userTokenStorageKey) ?? null;
  return authToken?.value ?? null;
}
