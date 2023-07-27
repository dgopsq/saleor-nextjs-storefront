"use client";

import { CartIcon } from "@/components/core/Icon";
import { useCheckoutInfo } from "@/misc/hooks/useCheckoutInfo";

/**
 *
 */
export const CartButton: React.FC = () => {
  const { data } = useCheckoutInfo();
  const totalItems = data?.lines.length ?? 0;

  return (
    <div className="group -m-2 flex items-center p-2">
      <CartIcon className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />

      <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
        {totalItems}
      </span>
    </div>
  );
};
