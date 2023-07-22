import { PaymentGateway } from "@/queries/checkout/data";
import { useEffect, useMemo } from "react";
import { useMutation } from "@apollo/client";
import { CheckoutTransactionInitializeDocument } from "@/__generated__/graphql";
import { StripePaymentGateway } from "@/components/checkout/StripePaymentGateway";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";
import { publicConfig } from "@/misc/config";

type Props = {
  paymentGateways: Array<PaymentGateway>;
  checkoutId: string;
};

/**
 *
 */
export const CheckoutPaymentGateway: React.FC<Props> = ({
  paymentGateways,
  checkoutId,
}) => {
  const maybePaymentGatewayData = useMemo(() => {
    const maybeStripeGateway = paymentGateways.find(
      ({ id }) => id === publicConfig.stripeGatewayId
    );

    return maybeStripeGateway ?? null;
  }, [paymentGateways]);

  const [transactionInitialize, { data, loading }] = useMutation(
    CheckoutTransactionInitializeDocument
  );

  useEffect(() => {
    if (!maybePaymentGatewayData) return;

    transactionInitialize({
      variables: {
        checkoutId,
        paymentGateway: {
          id: publicConfig.stripeGatewayId,
          data: {
            automatic_payment_methods: {
              enabled: true,
            },
          },
        },
      },
    });
  }, [maybePaymentGatewayData, transactionInitialize, checkoutId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <StripePaymentGateway config={data?.transactionInitialize?.data} />
    </div>
  );
};
