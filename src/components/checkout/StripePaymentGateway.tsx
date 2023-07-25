import { Button } from "@/components/core/Button";
import { errorToast } from "@/components/core/Notifications";
import { publicConfig } from "@/misc/config";
import { stripeConfigSchema } from "@/misc/stripe";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { FormEventHandler, useCallback, useMemo, useState } from "react";

const CheckoutForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault();

      if (!stripe || !elements) return;

      setIsLoading(true);

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: publicConfig.stripePaymentCallbackUrl,
        },
      });

      if (error) {
        errorToast("Something went wrong during the payment.");
      }

      setIsLoading(false);
    },
    [stripe, elements]
  );

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />

      <div className="mt-12">
        <Button
          type="submit"
          variant="primary"
          size="large"
          text="Buy now"
          isLoading={isLoading}
        />
      </div>
    </form>
  );
};

type Props = {
  config: unknown;
};

/**
 *
 */
export const StripePaymentGateway: React.FC<Props> = ({ config }) => {
  const maybeConfig = useMemo(() => {
    const parsedConfig = stripeConfigSchema.safeParse(config);
    return parsedConfig.success ? parsedConfig.data : null;
  }, [config]);

  const stripePromise = useMemo(
    () => (maybeConfig ? loadStripe(maybeConfig.publishableKey) : null),
    [maybeConfig]
  );

  const options = useMemo<StripeElementsOptions>(
    () => ({ clientSecret: maybeConfig?.paymentIntent.client_secret }),
    [maybeConfig]
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
};
