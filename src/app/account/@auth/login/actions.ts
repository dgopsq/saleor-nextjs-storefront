"use server";

import { publicConfig } from "@/misc/config";
import { AuthToken, RefreshToken } from "@/queries/user/data";
import { cookies } from "next/headers";

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
export async function getUserTokensCookies(): Promise<{
  authToken: AuthToken;
  refreshToken: RefreshToken;
} | null> {
  const token = cookies().get(publicConfig.userTokenStorageKey) ?? null;

  const refreshToken =
    cookies().get(publicConfig.userRefreshTokenStorageKey) ?? null;

  return token && refreshToken
    ? { authToken: token.value, refreshToken: refreshToken.value }
    : null;
}
