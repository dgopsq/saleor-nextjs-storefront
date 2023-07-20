import { Island } from "@/components/core/Island";
import { PaymentGatewayConfig } from "@/queries/checkout/data";

type Props = {
  paymentGateway: PaymentGatewayConfig;
  selected?: boolean;
};

/**
 *
 */
export const PaymentGatewayBox: React.FC<Props> = ({
  paymentGateway,
  selected,
}) => {
  const { id } = paymentGateway;

  return (
    <Island variant="outline" selected={selected}>
      <div className="text-left">
        <div className="font-semibold">{id}</div>
      </div>
    </Island>
  );
};
