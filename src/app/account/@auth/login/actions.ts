"use server";

import { publicConfig } from "@/misc/config";
import { UserTokens } from "@/misc/token";
import { cookies } from "next/headers";

/**
 *
 */
export async function setUserTokensCookies(
  token: string,
  refreshToken: string
) {
  cookies()
    .set(publicConfig.userTokenStorageKey, token)
    .set(publicConfig.userRefreshTokenStorageKey, refreshToken);
}

/**
 *
 */
export async function getUserTokensCookies(): Promise<UserTokens | null> {
  const token = cookies().get(publicConfig.userTokenStorageKey) ?? null;
  const refreshToken =
    cookies().get(publicConfig.userRefreshTokenStorageKey) ?? null;

  return token && refreshToken
    ? { token: token.value, refreshToken: refreshToken.value }
    : null;
}
