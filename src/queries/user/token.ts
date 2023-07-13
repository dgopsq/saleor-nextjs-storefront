import {
  CreateCheckoutDocument,
  GetCheckoutInfoDocument,
  GetMeDocument,
  RefreshTokenDocument,
} from "@/__generated__/graphql";
import { ClientApolloInstance } from "@/misc/apolloWrapper";
import { publicConfig } from "@/misc/config";
import { logger } from "@/misc/logger";
import { CheckoutToken } from "@/queries/checkout/data";
import { AuthToken, decodeUserToken } from "@/queries/user/data";
import Cookies from "js-cookie";
import { setContext } from "@apollo/client/link/context";

/**
 *
 */
export async function retrieveAuthToken(
  client: ClientApolloInstance
): Promise<AuthToken | null> {
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

/**
 *
 */
export async function retrieveCheckoutToken(
  client: ClientApolloInstance
): Promise<CheckoutToken | null> {
  const maybeStoredAuthToken =
    Cookies.get(publicConfig.userTokenStorageKey) ?? null;

  const localCheckoutToken =
    Cookies.get(publicConfig.checkoutTokenStorageKey) ?? null;

  // We are going to feed the Auth Header manually because
  // this job could be executed before the Auth Token is
  // actually bootstrapped in the application.
  const commonAuthHeader = {
    Authorization: maybeStoredAuthToken ? `Bearer ${maybeStoredAuthToken}` : "",
  };

  if (localCheckoutToken) {
    logger.debug("Checkout Token found, checking if it's valid.");

    const checkoutInfoRes = await client.query({
      query: GetCheckoutInfoDocument,
      variables: { checkoutToken: localCheckoutToken },
      errorPolicy: "ignore",
      context: {
        headers: commonAuthHeader,
      },
    });

    if (checkoutInfoRes.data.checkout) {
      logger.debug("Local Checkout Token is valid:", localCheckoutToken);
      return localCheckoutToken;
    }
  }

  logger.debug("Creating a new Checkout Token.");

  const maybeUser = maybeStoredAuthToken
    ? decodeUserToken(maybeStoredAuthToken)
    : null;

  if (maybeUser)
    logger.debug("Creating the Checkout Token for the user:", maybeUser.email);
  else logger.debug("Creating the Checkout Token for a guest user.");

  const email = maybeUser?.email ?? publicConfig.defaultCheckoutEmail;
  const channel = publicConfig.defaultCheckoutChannel;

  const createCheckoutRes = await client.mutate({
    mutation: CreateCheckoutDocument,
    variables: {
      channel,
      email,
    },
    context: {
      headers: commonAuthHeader,
    },
  });

  const newCheckoutToken: string | null =
    createCheckoutRes.data?.checkoutCreate?.checkout?.token ?? null;

  if (newCheckoutToken) {
    logger.debug("Checkout Token created:", newCheckoutToken);

    Cookies.set(publicConfig.checkoutTokenStorageKey, newCheckoutToken);

    setContext(() => ({
      headers: {},
    }));

    return newCheckoutToken;
  }

  return null;
}
