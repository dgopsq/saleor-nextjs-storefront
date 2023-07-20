import { PaymentGatewayBox } from "@/components/core/PaymentGatewayBox";
import { PaymentGateway } from "@/queries/checkout/data";
import { useMemo } from "react";

type Props = {
  paymentGateways: Array<PaymentGateway>;
  onChange?: (address: PaymentGateway) => void;
  value?: PaymentGateway;
  isLoading?: boolean;
};

/**
 *
 */
export const CheckoutPaymentGateways: React.FC<Props> = ({
  paymentGateways,
  onChange,
  value,
  isLoading,
}) => {
  const paymentGatewaysRenderer = useMemo(
    () =>
      paymentGateways.map((paymentGateway) => {
        const isSameAddr = paymentGateway.id === value?.id;

        const handleClick = () => {
          if (!isLoading) onChange?.(paymentGateway);
        };

        return (
          <li key={paymentGateway.id} className="lg:col-span-3">
            <button
              onClick={handleClick}
              type="button"
              className="w-full h-full"
            >
              <PaymentGatewayBox
                paymentGateway={paymentGateway}
                selected={isSameAddr}
              />
            </button>
          </li>
        );
      }),
    [paymentGateways, isLoading, onChange, value]
  );

  return (
    <div className={isLoading ? "opacity-75 cursor-not-allowed" : undefined}>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-6">
        {paymentGatewaysRenderer}
      </ul>
    </div>
  );
};
