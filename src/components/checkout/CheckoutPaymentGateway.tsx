import { PaymentGateway } from "@/queries/checkout/data";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { useMutation } from "@apollo/client";
import { CheckoutTransactionInitializeDocument } from "@/__generated__/graphql";
import { StripePaymentGateway } from "@/components/checkout/StripePaymentGateway";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";

const paymentGatewayId = "app.saleor.stripe";

const configDataSchema = z.object({
  paymentIntent: z.object({
    client_secret: z.string(),
  }),
  publishableKey: z.string(),
});

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
      ({ id }) => id === paymentGatewayId
    );

    return maybeStripeGateway ?? null;
  }, [paymentGateways]);

  const [transactionInitialize, { data, loading }] = useMutation(
    CheckoutTransactionInitializeDocument
  );

  const maybeGatewayConfig = useMemo(() => {
    const maybeConfig = configDataSchema.safeParse(
      data?.transactionInitialize?.data
    );

    return maybeConfig.success ? maybeConfig.data : null;
  }, [data]);

  useEffect(() => {
    if (!maybePaymentGatewayData) return;

    transactionInitialize({
      variables: {
        checkoutId,
        paymentGateway: {
          id: paymentGatewayId,
          data: {
            automatic_payment_methods: {
              enabled: true,
            },
          },
        },
      },
    });
  }, [maybePaymentGatewayData, transactionInitialize, checkoutId]);

  if (loading || !maybeGatewayConfig) return <LoadingSpinner />;

  return (
    <div>
      <StripePaymentGateway
        publishableKey={maybeGatewayConfig.publishableKey}
        clientSecret={maybeGatewayConfig.paymentIntent.client_secret}
      />
    </div>
  );
};
