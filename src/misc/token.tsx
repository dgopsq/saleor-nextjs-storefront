"use client";

import jwt_decode from "jwt-decode";
import { PropsWithChildren, createContext, useContext } from "react";
import * as z from "zod";

const userTokenPayloadSchema = z.object({
  user_id: z.string(),
  email: z.string().email(),
});

type UserTokenPayload = z.infer<typeof userTokenPayloadSchema>;

export type UserTokens = {
  token: string;
  refreshToken: string;
};

type UserTokenProviderProps = PropsWithChildren<{
  tokens?: UserTokens;
}>;

const UserTokenContext = createContext<UserTokens | null>(null);

/**
 *
 */
export const UserTokenProvider: React.FC<UserTokenProviderProps> = ({
  children,
  tokens,
}) => (
  <UserTokenContext.Provider value={tokens ?? null}>
    {children}
  </UserTokenContext.Provider>
);

/**
 *
 */
export function useUserTokens() {
  const tokens = useContext(UserTokenContext);
  return tokens;
}

/**
 *
 */
export function decodeUserToken(token: string): UserTokenPayload | null {
  const decoded = jwt_decode(token);
  const parsed = userTokenPayloadSchema.safeParse(decoded);

  return parsed.success ? parsed.data : null;
}
