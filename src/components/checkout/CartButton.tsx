"use client";

import { CartIcon } from "@/components/core/Icon";
import { useCheckoutInfo } from "@/misc/hooks/useCheckoutInfo";

/**
 * The cart button composed by an icon and the
 * number of items in the cart.
 */
export const CartButton: React.FC = () => {
  const { data } = useCheckoutInfo();
  const totalItems = data?.lines.length ?? 0;

  return (
    <div className="group -m-2 flex items-center p-2">
      <CartIcon className="h-6 w-6 flex-shrink-0 text-secondary-400 group-hover:text-secondary-500" />

      <span className="ml-2 text-sm font-medium text-secondary-700 group-hover:text-secondary-800">
        {totalItems}
      </span>
    </div>
  );
};
