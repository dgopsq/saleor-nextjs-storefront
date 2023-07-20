import { Island } from "@/components/core/Island";
import { formatPrice } from "@/misc/currencies";
import { DeliveryMethod } from "@/queries/checkout/data";

type Props = {
  deliveryMethod: DeliveryMethod;
  selected?: boolean;
};

/**
 *
 */
export const DeliveryMethodBox: React.FC<Props> = ({
  deliveryMethod,
  selected,
}) => {
  const { name, description, price } = deliveryMethod;

  return (
    <Island variant="outline" selected={selected}>
      <div className="text-left">
        <div className="font-semibold">{name}</div>

        {description ? (
          <div className="mt-1 text-sm">{description}</div>
        ) : undefined}

        {price ? (
          <div className="mt-1 text-sm">
            {formatPrice(price.amount, price.currency)}
          </div>
        ) : undefined}
      </div>
    </Island>
  );
};
