import { GetMeDocument, RefreshTokenDocument } from "@/__generated__/graphql";
import { ClientApolloInstance } from "@/misc/apolloWrapper";
import { publicConfig } from "@/misc/config";
import { logger } from "@/misc/logger";
import { ApolloClient } from "@apollo/client";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import * as z from "zod";

/**
 *
 */
export async function retrieveAuthToken(
  client: ClientApolloInstance
): Promise<string | null> {
  const maybeStoredAuthToken =
    Cookies.get(publicConfig.userTokenStorageKey) ?? null;

  const maybeStoredRefreshToken =
    Cookies.get(publicConfig.userRefreshTokenStorageKey) ?? null;

  if (!maybeStoredAuthToken && !maybeStoredRefreshToken) {
    logger.debug("Auth Token and Refresh Token are not in the cookies.");
    return null;
  }

  // Check if the stored token is valid.
  if (maybeStoredAuthToken) {
    logger.debug("Auth Token is in the cookies, check if it's valid.");

    const getMeRes = await client.query({
      query: GetMeDocument,
      context: { headers: { Authorization: `Bearer ${maybeStoredAuthToken}` } },
    });

    if (getMeRes.data.me) {
      logger.debug("Auth Token is valid", maybeStoredAuthToken);
      return maybeStoredAuthToken;
    }
  }

  logger.debug("Auth Token is not valid, try to refresh it.");

  // Here the access token is invalid, so we try to refresh it.
  if (maybeStoredRefreshToken) {
    logger.debug("Refresh Token is in the cookies, try to refresh the token.");

    const mutareRefreshTokenRes = await client.mutate({
      mutation: RefreshTokenDocument,
      variables: { refreshToken: maybeStoredRefreshToken },
    });

    const maybeNewAuthToken = mutareRefreshTokenRes.data?.tokenRefresh?.token;

    if (maybeNewAuthToken) {
      logger.debug("Refresh Token is valid, save the new Auth Token.");
      return maybeNewAuthToken;
    }
  }

  logger.debug("Refresh Token is not valid or non-existent.");

  return null;
}

/**
 *
 */
const userTokenPayloadSchema = z.object({
  user_id: z.string(),
  email: z.string().email(),
});

type UserTokenPayload = z.infer<typeof userTokenPayloadSchema>;

/**
 *
 */
export type AuthToken = string;

/**
 *
 */
export type RefreshToken = string;

/**
 *
 */
export function decodeUserToken(token: string): UserTokenPayload | null {
  const decoded = jwt_decode(token);
  const parsed = userTokenPayloadSchema.safeParse(decoded);

  return parsed.success ? parsed.data : null;
}
