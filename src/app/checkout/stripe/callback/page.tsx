import { P, match } from "ts-pattern";
import Stripe from "stripe";
import { getStoredCheckoutIdServer } from "@/app/account/@auth/login/actions";
import { getApolloClient } from "@/misc/apollo/apollo";
import { CheckoutPaymentInitializeDocument } from "@/__generated__/graphql";
import { publicConfig } from "@/misc/config";
import { stripeServerConfigSchema } from "@/misc/stripe";
import { logger } from "@/misc/logger";

type SearchParams = {
  payment_intent?: string | string[];
  payment_intent_client_secret?: string | string[];
};

export default async function SingleProductPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const checkoutId = await getStoredCheckoutIdServer();

  if (!checkoutId) {
    logger.warn(
      "Stripe callback page was called without a checkout id in the session."
    );

    return null;
  }

  const client = getApolloClient();

  const queryPaymentIntent = match(searchParams?.payment_intent)
    .with(P.string, (s) => s)
    .otherwise(() => null);

  const queryPaymentIntentClientSecret = match(
    searchParams?.payment_intent_client_secret
  )
    .with(P.string, (s) => s)
    .otherwise(() => null);

  if (!queryPaymentIntent) {
    logger.warn("Stripe callback page was called without a payment intent.");
    return null;
  }

  if (!queryPaymentIntentClientSecret) {
    logger.warn(
      "Stripe callback page was called without a payment intent client secret."
    );

    return null;
  }

  const paymentGateway = await client.mutate({
    mutation: CheckoutPaymentInitializeDocument,
    variables: {
      checkoutId,
      paymentGateways: [{ id: publicConfig.stripeGatewayId }],
    },
  });

  if (paymentGateway?.errors?.length) {
    logger.error(
      "Errors while executing the payment initialize mutation",
      paymentGateway?.errors
    );
  }

  const rawStripeData =
    paymentGateway.data?.paymentGatewayInitialize?.gatewayConfigs?.find(
      (gateway) => gateway.id === publicConfig.stripeGatewayId
    )?.data;

  const parsedStripeData = stripeServerConfigSchema.safeParse(rawStripeData);
  const maybeStripeData = parsedStripeData.success
    ? parsedStripeData.data
    : null;

  if (!maybeStripeData) {
    logger.error(
      "Could not parse the Stripe data from the server.",
      rawStripeData
    );

    return null;
  }

  const stripe = new Stripe(maybeStripeData.publishableKey, {
    apiVersion: "2022-11-15",
  });

  const paymentIntent = await stripe.paymentIntents.retrieve(
    queryPaymentIntent,
    {
      client_secret: queryPaymentIntentClientSecret,
    }
  );

  return `Payment intent: ${paymentIntent.status}`;
}
