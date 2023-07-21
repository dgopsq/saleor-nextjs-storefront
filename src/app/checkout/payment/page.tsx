import { CheckoutPaymentInitializeDocument } from "@/__generated__/graphql";
import { getStoredCheckoutIdServer } from "@/app/account/@auth/login/actions";
import { Payment } from "@/components/checkout/Payment";
import { getApolloClient } from "@/misc/apollo/apollo";
import { parsePaymentGatewayConfig } from "@/queries/checkout/data";

export default async function CartPage() {
  const client = getApolloClient();
  const checkoutId = await getStoredCheckoutIdServer();

  /**
   * @todo: Handle the case when the checkoutId is null.
   */
  if (!checkoutId) return null;

  const initializePaymentRes = await client.mutate({
    mutation: CheckoutPaymentInitializeDocument,
    variables: {
      checkoutId: checkoutId,
    },
  });

  const paymentGateways =
    initializePaymentRes.data?.paymentGatewayInitialize?.gatewayConfigs
      ?.filter((gateway) => gateway.errors && gateway.errors.length === 0)
      .map(parsePaymentGatewayConfig) ?? [];

  return <Payment paymentGateways={paymentGateways} />;
}
