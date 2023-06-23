"use server";

import { publicConfig } from "@/misc/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 *
 */
export async function setUserTokensCookies(
  token: string,
  refreshToken: string
) {
  cookies().set(publicConfig.userTokenStorageKey, token);
  cookies().set(publicConfig.userRefreshTokenStorageKey, refreshToken);
}

/**
 *
 */
export async function getUserTokensCookies() {
  const token = cookies().get(publicConfig.userTokenStorageKey) ?? null;
  const refreshToken =
    cookies().get(publicConfig.userRefreshTokenStorageKey) ?? null;

  return token && refreshToken ? { token, refreshToken } : null;
}
