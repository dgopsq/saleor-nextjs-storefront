import { P, match } from "ts-pattern";

type SearchParams = {
  payment_intent?: string | string[];
  payment_intent_client_secret?: string | string[];
};

export default async function SingleProductPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const paymentIntent = match(searchParams?.payment_intent)
    .with(P.string, (s) => s)
    .otherwise(() => null);

  const paymentIntentClientSecret = match(
    searchParams?.payment_intent_client_secret
  )
    .with(P.string, (s) => s)
    .otherwise(() => null);

  if (!paymentIntent || !paymentIntentClientSecret) return null;

  return `Payment intent: ${paymentIntent} - Payment intent client secret: ${paymentIntentClientSecret}`;
}
