import { EditorJSRenderer } from "@/components/core/EditorJSRenderer";
import { formatPrice } from "@/misc/currencies";
import { DeliveryMethod } from "@/queries/checkout/data";

type Props = {
  deliveryMethod: DeliveryMethod;
};

/**
 * Renders a single delivery method.
 */
export const SingleDeliveryMethod: React.FC<Props> = ({ deliveryMethod }) => {
  const { name, description, price } = deliveryMethod;

  return (
    <div className="w-full text-left flex justify-between">
      <div>
        <div className="font-semibold">{name}</div>

        {description ? (
          <div className="mt-1 text-sm">
            <EditorJSRenderer data={description} />
          </div>
        ) : undefined}
      </div>

      {price ? (
        <div className="font-semibold">
          {formatPrice(price.amount, price.currency)}
        </div>
      ) : undefined}
    </div>
  );
};
