import { GenericUserFragmentDoc, GetMeDocument } from "@/__generated__/graphql";
import { User, decodeUserToken, parseUser } from "@/queries/user/data";
import { getStoredAuthToken } from "@/queries/user/token";
import { useFragment, useQuery } from "@apollo/client";
import { useMemo } from "react";

/**
 *
 */
export function useUserInfo(): User | null {
  const authToken = useMemo(getStoredAuthToken, []);

  const decodedToken = useMemo(
    () => (authToken ? decodeUserToken(authToken) : null),
    [authToken]
  );

  const { data, complete } = useFragment({
    fragment: GenericUserFragmentDoc,
    fragmentName: "GenericUser",
    from: {
      __typename: "User",
      id: decodedToken?.user_id ?? Symbol(),
    },
  });

  useQuery(GetMeDocument, { skip: complete || !authToken });

  // FIXME: This is potentially a bottleneck, as it will be called on every
  // render. Consider using a context to store the parsed user data.
  const parsedData = useMemo(
    () => (data && complete ? parseUser(data) : null),
    [data, complete]
  );

  return parsedData;
}
