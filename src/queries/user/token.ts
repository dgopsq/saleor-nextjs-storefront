import {
  CreateCheckoutDocument,
  GetCheckoutInfoDocument,
} from "@/__generated__/graphql";
import { ClientApolloInstance } from "@/misc/apolloWrapper";
import { publicConfig } from "@/misc/config";
import { logger } from "@/misc/logger";
import { CheckoutToken } from "@/queries/checkout/data";
import { AuthToken, decodeUserToken } from "@/queries/user/data";
import Cookies from "js-cookie";
import { setContext } from "@apollo/client/link/context";

/**
 * Execute the refresh token mutation and save the new token in the cookies.
 * N.B. This functions won't use the GraphQL client but just the `fetch` API.
 */
export async function refreshAuthToken(): Promise<AuthToken | null> {
  const maybeStoredRefreshToken = getStoredRefreshToken();

  if (maybeStoredRefreshToken) {
    logger.debug("Refresh Token is in the cookies, try to refresh the token.");

    const mutareRefreshTokenRes = await fetch(publicConfig.graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation {
          tokenRefresh(refreshToken: "${maybeStoredRefreshToken}") {
            token
          }
        }`,
        variables: {
          refreshToken: maybeStoredRefreshToken,
        },
      }),
    }).then((res) => res.json());

    // FIXME: This is possibly unsafe.
    const maybeNewAuthToken: string | undefined =
      mutareRefreshTokenRes.data?.tokenRefresh?.token;

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
  const maybeStoredAuthToken = getStoredAuthToken();
  const localCheckoutToken = getStoredCheckoutToken();

  if (localCheckoutToken) {
    logger.debug("Checkout Token found, checking if it's valid.");

    const checkoutInfoRes = await client.query({
      query: GetCheckoutInfoDocument,
      variables: { checkoutToken: localCheckoutToken },
      errorPolicy: "ignore",
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

/**
 *
 */
export function getStoredAuthToken(): AuthToken | null {
  return Cookies.get(publicConfig.userTokenStorageKey) ?? null;
}

/**
 *
 */
export function getStoredRefreshToken(): AuthToken | null {
  return Cookies.get(publicConfig.userRefreshTokenStorageKey) ?? null;
}

/**
 *
 */
export function getStoredCheckoutToken(): CheckoutToken | null {
  return Cookies.get(publicConfig.checkoutTokenStorageKey) ?? null;
}
