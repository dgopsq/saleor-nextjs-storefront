"use server";

import { publicConfig } from "@/misc/config";
import { AuthToken } from "@/queries/user/data";
import { cookies } from "next/headers";

/**
 *
 */
export async function getStoredAuthTokenServer(): Promise<AuthToken | null> {
  const token = cookies().get(publicConfig.userTokenStorageKey) ?? null;
  return token?.value ?? null;
}

/**
 *
 */
export async function getStoredCheckoutIdServer(): Promise<AuthToken | null> {
  const token = cookies().get(publicConfig.checkoutIdStorageKey) ?? null;
  return token?.value ?? null;
}
