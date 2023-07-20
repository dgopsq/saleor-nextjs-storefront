import { Island } from "@/components/core/Island";
import { PaymentGateway } from "@/queries/checkout/data";

type Props = {
  paymentGateway: PaymentGateway;
  selected?: boolean;
};

/**
 *
 */
export const PaymentGatewayBox: React.FC<Props> = ({
  paymentGateway,
  selected,
}) => {
  const { name } = paymentGateway;

  return (
    <Island variant="outline" selected={selected}>
      <div className="text-left">
        <div className="font-semibold">{name}</div>
      </div>
    </Island>
  );
};
