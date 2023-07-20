import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMemo } from "react";

type Props = {
  publishableKey: string;
  clientSecret: string;
};

/**
 *
 */
export const StripePaymentGateway: React.FC<Props> = ({
  publishableKey,
  clientSecret,
}) => {
  const stripePromise = useMemo(
    () => loadStripe(publishableKey),
    [publishableKey]
  );

  const options = useMemo(() => ({ clientSecret }), [clientSecret]);

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentElement />
    </Elements>
  );
};
