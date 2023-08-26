import { RadioIsland } from "@/components/core/RadioIsland";
import { SingleDeliveryMethod } from "@/components/core/SingleDeliveryMethod";
import { DeliveryMethod } from "@/queries/checkout/data";
import { useMemo } from "react";

type Props = {
  deliveryMethods: Array<DeliveryMethod>;
  onChange?: (address: DeliveryMethod) => void;
  value?: DeliveryMethod;
  isLoading?: boolean;
};

/**
 * The list of shipping methods in the checkout.
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
          <li key={deliveryMethod.id}>
            <button
              onClick={handleClick}
              type="button"
              className="w-full h-full"
            >
              <RadioIsland isSelected={isSameAddr}>
                <SingleDeliveryMethod deliveryMethod={deliveryMethod} />
              </RadioIsland>
            </button>
          </li>
        );
      }),
    [deliveryMethods, isLoading, onChange, value]
  );

  return (
    <div className={isLoading ? "opacity-75 cursor-not-allowed" : undefined}>
      <ul className="flex flex-col gap-4">{deliveryMethodsRender}</ul>
    </div>
  );
};
