"use client";

import { PropsWithChildren, createContext, useContext } from "react";

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
