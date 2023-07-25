import { P, match } from "ts-pattern";
import Stripe from "stripe";
import { getStoredCheckoutIdServer } from "@/app/account/@auth/login/actions";
import { getApolloClient } from "@/misc/apollo/apollo";
import {
  CheckoutCompleteDocument,
  CheckoutPaymentInitializeDocument,
} from "@/__generated__/graphql";
import { publicConfig } from "@/misc/config";
import { stripeServerConfigSchema } from "@/misc/stripe";
import { logger } from "@/misc/logger";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";
import { redirect } from "next/navigation";

const commonReturn = <LoadingSpinner />;

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

    return commonReturn;
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
    return commonReturn;
  }

  if (!queryPaymentIntentClientSecret) {
    logger.warn(
      "Stripe callback page was called without a payment intent client secret."
    );

    return commonReturn;
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

    return commonReturn;
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

  if (paymentIntent.status !== "succeeded") {
    logger.warn(
      "The payment intent status is not succeeded.",
      paymentIntent.status
    );

    return commonReturn;
  }

  const checkoutComplete = await client.mutate({
    mutation: CheckoutCompleteDocument,
    variables: {
      checkoutId,
    },
  });

  if (checkoutComplete?.errors?.length) {
    logger.error(
      "Errors while executing the checkout complete mutation",
      checkoutComplete?.errors
    );
  }

  if (!checkoutComplete?.data?.checkoutComplete?.order) {
    logger.error("Could not retrieve the order from the checkout complete.");
    return commonReturn;
  }

  redirect("/checkout/complete");

  return commonReturn;
}
