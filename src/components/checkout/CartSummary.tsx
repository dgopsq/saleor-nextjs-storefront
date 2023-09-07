import { QuestionIcon } from "@/components/core/Icon";
import { formatPrice } from "@/misc/currencies";
import { Checkout } from "@/queries/checkout/data";
import { useTranslations } from "next-intl";

type Props = {
  checkout: Checkout;
};

/**
 * The summary of the cart used in the checkout.
 */
export const CartSummary: React.FC<Props> = ({ checkout }) => {
  const t = useTranslations("Checkout");

  return (
    <dl className="mt-6 space-y-4">
      {checkout.subtotalPrice ? (
        <div className="flex items-center justify-between">
          <dt className="text-sm text-secondary-600">{t("Subtotal")}</dt>
          <dd className="text-sm font-medium text-secondary-900">
            {formatPrice(
              checkout.subtotalPrice.amount,
              checkout.subtotalPrice.currency
            )}
          </dd>
        </div>
      ) : undefined}

      {checkout.shippingPrice ? (
        <div className="flex items-center justify-between border-t border-secondary-200 pt-4">
          <dt className="flex items-center text-sm text-secondary-600">
            <span>{t("Shipping estimate")}</span>
            <a
              href="#"
              className="ml-2 flex-shrink-0 text-secondary-400 hover:text-secondary-500"
            >
              <QuestionIcon className="h-5 w-5" />
            </a>
          </dt>
          <dd className="text-sm font-medium text-secondary-900">
            {formatPrice(
              checkout.shippingPrice.amount,
              checkout.shippingPrice.currency
            )}
          </dd>
        </div>
      ) : undefined}

      {checkout.totalPrice ? (
        <div className="flex items-center justify-between border-t border-secondary-200 pt-4">
          <dt className="text-base font-medium text-secondary-900">
            {t("Order total")}
          </dt>
          <dd className="text-base font-medium text-secondary-900">
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
