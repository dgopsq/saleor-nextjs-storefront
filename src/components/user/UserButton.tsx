"use client";

import { GenericUserFragmentDoc, GetMeDocument } from "@/__generated__/graphql";
import { decodeUserToken, useUserTokens } from "@/misc/token";
import { useFragment, useQuery } from "@apollo/client";
import { UserIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";

/**
 *
 */
export const UserButton: React.FC = () => {
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

  const showedName = useMemo(() => {
    const computedName: Array<string> = [];

    if (data.firstName) computedName.push(data.firstName);
    if (data.lastName) computedName.push(data.lastName);

    return computedName.join(" ");
  }, [data]);

  return (
    <div className="group -m-2 flex items-center p-2">
      <UserIcon
        className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
        aria-hidden="true"
      />

      {showedName.length > 0 ? (
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {showedName}
        </span>
      ) : undefined}
    </div>
  );
};
