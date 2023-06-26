import {
  GenericUserFragment,
  GenericUserFragmentDoc,
  GetMeDocument,
} from "@/__generated__/graphql";
import { decodeUserToken, useUserTokens } from "@/misc/token";
import { User, parseUser } from "@/queries/user/data";
import { useFragment, useQuery } from "@apollo/client";
import { useMemo } from "react";

/**
 *
 */
export function useUserInfo(): User | null {
  const tokens = useUserTokens();

  const decodedToken = useMemo(
    () => (tokens ? decodeUserToken(tokens.token) : null),
    [tokens]
  );

  const { data, complete } = useFragment({
    fragment: GenericUserFragmentDoc,
    fragmentName: "GenericUser",
    from: {
      __typename: "User",
      id: decodedToken?.user_id,
    },
  });

  useQuery(GetMeDocument, { skip: complete || !tokens });

  // FIXME: This is potentially a bottleneck, as it will be called on every
  // render. Consider using a context to store the parsed user data.
  const parsedData = data ? parseUser(data as GenericUserFragment) : null;

  return parsedData;
}
