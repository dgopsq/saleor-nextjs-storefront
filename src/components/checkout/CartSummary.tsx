import { QuestionIcon } from "@/components/core/Icon";
import { formatPrice } from "@/misc/currencies";
import { Checkout } from "@/queries/checkout/data";

type Props = {
  checkout: Checkout;
};

/**
 *
 */
export const CartSummary: React.FC<Props> = ({ checkout }) => {
  return (
    <dl className="mt-6 space-y-4">
      {checkout.subtotalPrice ? (
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Subtotal</dt>
          <dd className="text-sm font-medium text-gray-900">
            {formatPrice(
              checkout.subtotalPrice.amount,
              checkout.subtotalPrice.currency
            )}
          </dd>
        </div>
      ) : undefined}

      {checkout.shippingPrice ? (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="flex items-center text-sm text-gray-600">
            <span>Shipping estimate</span>
            <a
              href="#"
              className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">
                Learn more about how shipping is calculated
              </span>
              <QuestionIcon className="h-5 w-5" />
            </a>
          </dt>
          <dd className="text-sm font-medium text-gray-900">
            {formatPrice(
              checkout.shippingPrice.amount,
              checkout.shippingPrice.currency
            )}
          </dd>
        </div>
      ) : undefined}

      {checkout.totalPrice ? (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="text-base font-medium text-gray-900">Order total</dt>
          <dd className="text-base font-medium text-gray-900">
            {formatPrice(
              checkout.totalPrice.amount,
              checkout.totalPrice.currency
            )}
          </dd>
        </div>
      ) : undefined}
    </dl>
  );
};
