"use client";

import { GetCheckoutInfoDocument } from "@/__generated__/graphql";
import { useCheckoutToken } from "@/misc/hooks/useCheckoutToken";
import { parseCheckoutInfo } from "@/queries/checkout/data";
import { useQuery } from "@apollo/client";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";

/**
 *
 */
export const CartButton: React.FC = () => {
  const token = useCheckoutToken();
  const { data } = useQuery(GetCheckoutInfoDocument, {
    variables: { checkoutToken: token },
    skip: !token,
  });

  const parsedCheckout = useMemo(
    () => (data ? parseCheckoutInfo(data) : null),
    [data]
  );

  const totalItems = parsedCheckout?.lines.length ?? 0;

  return (
    <div className="group -m-2 flex items-center p-2">
      <ShoppingCartIcon
        className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
        aria-hidden="true"
      />
      <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
        {totalItems}
      </span>
    </div>
  );
};
