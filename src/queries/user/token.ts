import { GetMeDocument, RefreshTokenDocument } from "@/__generated__/graphql";
import { ClientApolloInstance } from "@/misc/apolloWrapper";
import { publicConfig } from "@/misc/config";
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

  // Check if the stored token is valid.
  if (maybeStoredAuthToken) {
    const getMeRes = await client.query({
      query: GetMeDocument,
      context: { headers: { Authorization: `Bearer ${maybeStoredAuthToken}` } },
    });

    if (getMeRes.data.me) {
      return maybeStoredAuthToken;
    }
  }

  // Here the access token is invalid, so we try to refresh it.
  if (maybeStoredRefreshToken) {
    const mutareRefreshTokenRes = await client.mutate({
      mutation: RefreshTokenDocument,
      variables: { refreshToken: maybeStoredRefreshToken },
    });

    const maybeNewAuthToken = mutareRefreshTokenRes.data?.tokenRefresh?.token;

    if (maybeNewAuthToken) {
      return maybeNewAuthToken;
    }
  }

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
