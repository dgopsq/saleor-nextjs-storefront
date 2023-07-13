import { GetMeDocument, RefreshTokenDocument } from "@/__generated__/graphql";
import { ClientApolloInstance } from "@/misc/apolloWrapper";
import { publicConfig } from "@/misc/config";
import { logger } from "@/misc/logger";
import Cookies from "js-cookie";

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

      // Here we need to be sure to include the access token.
      context: { headers: { Authorization: `Bearer ${maybeStoredAuthToken}` } },

      // And we must ignore the errors, otherwile Apollo will throw.
      errorPolicy: "ignore",
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
      context: { headers: { Authorization: "" } },
    });

    const maybeNewAuthToken = mutareRefreshTokenRes.data?.tokenRefresh?.token;

    if (maybeNewAuthToken) {
      logger.debug("Refresh Token is valid, save the new Auth Token.");

      // Overwrite the old token with the new one.
      Cookies.set(publicConfig.userTokenStorageKey, maybeNewAuthToken);

      return maybeNewAuthToken;
    }
  }

  logger.debug("Refresh Token is not valid or non-existent.");

  return null;
}
