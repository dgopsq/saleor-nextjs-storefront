import { CheckoutPaymentInitializeDocument } from "@/__generated__/graphql";
import { getStoredCheckoutIdServer } from "@/app/account/@auth/login/actions";
import { Checkout } from "@/components/checkout/Checkout";
import { getApolloClient } from "@/misc/apollo/apollo";

export default async function CartPage() {
  const client = getApolloClient();
  const checkoutId = await getStoredCheckoutIdServer();

  if (checkoutId) {
    const initializePaymentRes = await client.mutate({
      mutation: CheckoutPaymentInitializeDocument,
      variables: {
        checkoutId: checkoutId,
      },
    });

    console.log(initializePaymentRes.data?.paymentGatewayInitialize);
  }

  return <Checkout />;
}
