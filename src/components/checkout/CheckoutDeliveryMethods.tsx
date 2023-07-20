import { DeliveryMethodBox } from "@/components/core/DeliveryMethodBox";
import { DeliveryMethod } from "@/queries/checkout/data";
import { useMemo } from "react";

type Props = {
  deliveryMethods: Array<DeliveryMethod>;
  onChange?: (address: DeliveryMethod) => void;
  value?: DeliveryMethod;
  isLoading?: boolean;
};

/**
 *
 */
export const CheckoutDeliveryMethod: React.FC<Props> = ({
  deliveryMethods,
  onChange,
  value,
  isLoading,
}) => {
  const deliveryMethodsRender = useMemo(
    () =>
      deliveryMethods.map((deliveryMethod) => {
        const isSameAddr = deliveryMethod.id === value?.id;

        const handleClick = () => {
          if (!isLoading) onChange?.(deliveryMethod);
        };

        return (
          <li key={deliveryMethod.id} className="lg:col-span-3">
            <button
              onClick={handleClick}
              type="button"
              className="w-full h-full"
            >
              <DeliveryMethodBox
                deliveryMethod={deliveryMethod}
                selected={isSameAddr}
              />
            </button>
          </li>
        );
      }),
    [deliveryMethods, isLoading, onChange, value]
  );

  return (
    <div className={isLoading ? "opacity-75 cursor-not-allowed" : undefined}>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-6">
        {deliveryMethodsRender}
      </ul>
    </div>
  );
};
