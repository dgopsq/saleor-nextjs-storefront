"use client";

import {
  UpdateCheckoutBillingAddressDocument,
  UpdateCheckoutEmailDocument,
  UpdateCheckoutShippingAddressDocument,
} from "@/__generated__/graphql";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { TextButton } from "@/components/core/Button";
import { SectionHeading } from "@/components/core/Headings";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";
import { useCheckoutInfo } from "@/misc/hooks/useCheckoutInfo";
import { classNames } from "@/misc/styles";
import { addressToAddressForm } from "@/queries/user/data";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import {
  FormEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { AddressForm, AddressFormRef } from "@/components/core/AddressForm";
import { logger } from "@/misc/logger";
import { errorToast } from "@/components/core/Notifications";
import { EmailForm, EmailFormRef } from "@/components/core/EmailForm";
import { publicConfig } from "@/misc/config";
import Link from "next/link";
import { useGuestOrderAccountStore } from "@/misc/states/guestOrderAccount";
import {
  cartRoute,
  checkoutShippingRoute,
  loginRoute,
} from "@/misc/navigation";

/**
 *
 */
export const InformationsGuest: React.FC = () => {
  const router = useRouter();
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const shippingAddressFormRef = useRef<AddressFormRef>(null);
  const billingAddressFormRef = useRef<AddressFormRef>(null);
  const emailFormRef = useRef<EmailFormRef>(null);
  const setGuestOrderAccount = useGuestOrderAccountStore(
    (state) => state.setValue
  );

  const { data, loading: checkoutInfoLoading } = useCheckoutInfo();

  const [updateEmail, { loading: loadingUpdateEmail }] = useMutation(
    UpdateCheckoutEmailDocument
  );

  const [
    updateShippingAddress,
    { loading: loadingUpdateShippingAddress, data: updateShippingAddressData },
  ] = useMutation(UpdateCheckoutShippingAddressDocument);

  const [
    updateBillingAddress,
    { loading: loadingUpdateBillingAddress, data: updateBillingAddressData },
  ] = useMutation(UpdateCheckoutBillingAddressDocument);

  const checkoutRefreshing =
    checkoutInfoLoading ||
    loadingUpdateEmail ||
    loadingUpdateShippingAddress ||
    loadingUpdateBillingAddress;

  const handleContinue = useCallback(async () => {
    const shippingAddress =
      (await shippingAddressFormRef.current?.getValues()) ?? null;

    const billingAddress = billingSameAsShipping
      ? shippingAddress
      : (await billingAddressFormRef.current?.getValues()) ?? null;

    const email = (await emailFormRef.current?.getValues())?.email ?? null;

    if (!shippingAddress || !billingAddress || !email || !data) return;

    const emailQuery = updateEmail({
      variables: {
        checkoutId: data.id,
        email,
      },
    });

    const shippingQuery = updateShippingAddress({
      variables: {
        checkoutId: data.id,
        address: shippingAddress,
      },
    });

    const billingQuery = updateBillingAddress({
      variables: {
        checkoutId: data.id,
        address: billingAddress,
      },
    });

    const [shippingQueryRes, billingQueryRes, emailQueryRes] =
      await Promise.all([shippingQuery, billingQuery, emailQuery] as const);

    const shippingQueryHasErrors =
      !!shippingQueryRes.errors?.length ||
      !!shippingQueryRes.data?.checkoutShippingAddressUpdate?.errors.length;

    const billingQueryHasErrors =
      !!billingQueryRes.errors?.length ||
      !!billingQueryRes.data?.checkoutBillingAddressUpdate?.errors.length;

    const emailQueryHasErrors =
      !!emailQueryRes.errors?.length ||
      !!emailQueryRes.data?.checkoutEmailUpdate?.errors.length;

    if (
      shippingQueryHasErrors ||
      billingQueryHasErrors ||
      emailQueryHasErrors
    ) {
      logger.warn("Errors while updating the guest informations.");
      errorToast("An error occurred while submitting your informations.");
      return;
    }

    // Set the in-memory guest signup informations
    // for later, in case the user decides to create an account.
    // Here we are using the billing informations.
    setGuestOrderAccount({
      email,
      firstName: billingAddress.firstName,
      lastName: billingAddress.lastName,
    });

    router.push(checkoutShippingRoute);
  }, [
    router,
    data,
    billingSameAsShipping,
    updateShippingAddress,
    updateBillingAddress,
    updateEmail,
    setGuestOrderAccount,
  ]);

  const emailInitialValues = useMemo(
    () =>
      data?.email && data.email !== publicConfig.defaultCheckoutEmail
        ? { email: data.email }
        : undefined,
    [data]
  );

  const shippingAddressInitialValues = useMemo(
    () =>
      data?.shippingAddress
        ? addressToAddressForm(data.shippingAddress)
        : undefined,
    [data]
  );

  const billingAddressInitialValues = useMemo(
    () =>
      data?.billingAddress
        ? addressToAddressForm(data.billingAddress)
        : undefined,
    [data]
  );

  const handleFormSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      handleContinue();
    },
    [handleContinue]
  );

  if (!data) return <LoadingSpinner />;

  return (
    <div className="bg-white w-full">
      <CheckoutSteps currentStep={0} />
      <form className="w-full" onSubmit={handleFormSubmit}>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <div className="border-b border-gray-100 pb-12">
              <EmailForm
                ref={emailFormRef}
                initialValues={emailInitialValues}
              />

              <div className="mt-4">
                <span className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link
                    className="text-indigo-600 hover:underline"
                    href={loginRoute}
                  >
                    Login here
                  </Link>
                </span>
              </div>
            </div>

            <div className="border-b border-gray-100 pb-12 mt-12">
              <SectionHeading>Shipping address</SectionHeading>

              <div className="mt-8">
                <AddressForm
                  initialValues={shippingAddressInitialValues}
                  ref={shippingAddressFormRef}
                  asyncErrors={
                    updateShippingAddressData?.checkoutShippingAddressUpdate
                      ?.errors
                  }
                />
              </div>
            </div>

            <div className="mt-12">
              <SectionHeading>Billing address</SectionHeading>

              <div className="mt-8">
                {billingSameAsShipping ? (
                  <div className="flex flex-row items-center gap-4">
                    <span>Same as the shipping address.</span>

                    <div>
                      <TextButton
                        text="Change"
                        onClick={() => setBillingSameAsShipping(false)}
                        variant="primary"
                      />
                    </div>
                  </div>
                ) : (
                  <AddressForm
                    initialValues={billingAddressInitialValues}
                    ref={billingAddressFormRef}
                    asyncErrors={
                      updateBillingAddressData?.checkoutBillingAddressUpdate
                        ?.errors
                    }
                  />
                )}
              </div>
            </div>
          </section>

          <section
            aria-labelledby="summary-heading"
            className={classNames(
              "mt-16 lg:col-span-5 lg:mt-0",
              checkoutRefreshing ? "opacity-50" : ""
            )}
          >
            <CheckoutSummary
              checkout={data}
              isLoading={checkoutRefreshing}
              ctaText="Continue to shipping"
              onCtaClick={handleContinue}
              onCartEditClick={() => router.push(cartRoute)}
            />
          </section>
        </div>
      </form>
    </div>
  );
};
