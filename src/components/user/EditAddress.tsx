"use client";

import {
  AddressTypeEnum,
  GenericAddressFragmentDoc,
  UserDeleteAddressDocument,
  UserSetDefaultAddressDocument,
  UserUpdateAddressDocument,
} from "@/__generated__/graphql";
import { AddressForm, AddressFormRef } from "@/components/core/AddressForm";
import { Button } from "@/components/core/Button";
import { PageHeading } from "@/components/core/Headings";
import { errorToast, successToast } from "@/components/core/Notifications";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { logger } from "@/misc/logger";
import { addressesRoute } from "@/misc/navigation";
import { addressToAddressForm, parseAddress } from "@/queries/user/data";
import { useFragment, useMutation } from "@apollo/client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";

type Props = {
  id: string;
};

/**
 * Renders the page to edit an address.
 */
export const EditAddress = ({ id }: Props) => {
  const t = useTranslations("User");
  const router = useRouter();
  const userInfo = useUserInfo();
  const maybeFallbackAddressId = useMemo(
    () =>
      userInfo?.addresses?.find(({ id: addressId }) => addressId !== id)?.id ??
      null,
    [userInfo, id]
  );

  const { data, complete } = useFragment({
    fragment: GenericAddressFragmentDoc,
    fragmentName: "GenericAddress",
    from: {
      __typename: "Address",
      id,
    },
  });

  const addressFormRef = useRef<AddressFormRef>(null);

  const [updateAddress, { loading: updateLoading, data: updateData }] =
    useMutation(UserUpdateAddressDocument);

  const [deleteAddress, { loading: deleteLoading, data: deleteData }] =
    useMutation(UserDeleteAddressDocument);

  const [
    setDefaultBillingAddress,
    { loading: setDefaultBillingLoading, data: setDefaultBillingData },
  ] = useMutation(UserSetDefaultAddressDocument);

  const [
    setDefaultShippingAddress,
    { loading: setDefaultShippingLoading, data: setDefaultShippingData },
  ] = useMutation(UserSetDefaultAddressDocument);

  const handleUpdate = useCallback(async () => {
    const data = (await addressFormRef.current?.getValues()) ?? null;

    if (data)
      updateAddress({
        variables: {
          id: id,
          input: data,
        },
      });
  }, [updateAddress, id]);

  const handleDelete = useCallback(() => {
    if (!maybeFallbackAddressId) return;

    if (data.isDefaultBillingAddress)
      setDefaultBillingAddress({
        variables: {
          addressId: maybeFallbackAddressId,
          addressType: AddressTypeEnum.Billing,
        },
      });

    if (data.isDefaultShippingAddress)
      setDefaultShippingAddress({
        variables: {
          addressId: maybeFallbackAddressId,
          addressType: AddressTypeEnum.Shipping,
        },
      });

    deleteAddress({
      variables: { id },
    });
  }, [
    data.isDefaultBillingAddress,
    data.isDefaultShippingAddress,
    maybeFallbackAddressId,
    setDefaultBillingAddress,
    setDefaultShippingAddress,
    deleteAddress,
    id,
  ]);

  const handleSetBillingDefault = useCallback(() => {
    setDefaultBillingAddress({
      variables: { addressId: id, addressType: AddressTypeEnum.Billing },
    });
  }, [setDefaultBillingAddress, id]);

  const handleSetShippingDefault = useCallback(() => {
    setDefaultShippingAddress({
      variables: { addressId: id, addressType: AddressTypeEnum.Shipping },
    });
  }, [setDefaultShippingAddress, id]);

  useEffect(() => {
    if (updateData?.accountAddressUpdate?.user)
      successToast(t("The address has been updated"));
    else if (updateData?.accountAddressUpdate?.errors.length) {
      logger.error(
        "Address update errors",
        updateData.accountAddressUpdate.errors
      );

      errorToast(t("There was an error updating the address"));
    }
  }, [updateData, t]);

  useEffect(() => {
    if (setDefaultBillingData?.accountSetDefaultAddress?.user)
      successToast(t("The address has been set as default for billing"));
    else if (setDefaultBillingData?.accountSetDefaultAddress?.errors.length) {
      logger.error(
        "Address set default billing errors",
        setDefaultBillingData.accountSetDefaultAddress.errors
      );

      errorToast(
        t("There was an error setting the address as default for billing")
      );
    }
  }, [setDefaultBillingData, t]);

  useEffect(() => {
    if (setDefaultShippingData?.accountSetDefaultAddress?.user)
      successToast(t("The address has been set as default for shipping"));
    else if (setDefaultShippingData?.accountSetDefaultAddress?.errors.length) {
      logger.error(
        "Address set default shipping errors",
        setDefaultShippingData.accountSetDefaultAddress.errors
      );

      errorToast(
        t("There was an error setting the address as default for shipping")
      );
    }
  }, [setDefaultShippingData, t]);

  useEffect(() => {
    if (deleteData?.accountAddressDelete?.user) {
      successToast(t("The address has been deleted"));
      router.push(addressesRoute);
    } else if (deleteData?.accountAddressDelete?.errors.length) {
      logger.error(
        "Address delete errors",
        deleteData.accountAddressDelete.errors
      );

      errorToast(t("There was an error deleting the address"));
    }
  }, [deleteData, router, t]);

  if (!data || !complete) return null;

  return (
    <div>
      <PageHeading>{t("Edit address")}</PageHeading>

      <div className="mt-8 pb-16 border-b border-secondary-100">
        <AddressForm
          ref={addressFormRef}
          initialValues={addressToAddressForm(parseAddress(data))}
          asyncErrors={updateData?.accountAddressUpdate?.errors ?? []}
        />

        <div className="bg-secondary-50 rounded-lg mt-16">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-secondary-900">
              {t("Set this address as default")}
            </h3>

            <div className="mt-4 flex flex-row items-center gap-4">
              <div>
                <Button
                  text={t("Default for shipping")}
                  type="submit"
                  variant="primary"
                  size="medium"
                  isLoading={setDefaultShippingLoading && !deleteLoading}
                  onClick={handleSetShippingDefault}
                  isDisabled={!!data.isDefaultShippingAddress}
                />
              </div>

              <div>
                <Button
                  text={t("Default for billing")}
                  type="submit"
                  variant="primary"
                  size="medium"
                  isLoading={setDefaultBillingLoading && !deleteLoading}
                  onClick={handleSetBillingDefault}
                  isDisabled={!!data.isDefaultBillingAddress}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 flex justify-end gap-4">
        <div>
          <Button
            text={t("Delete")}
            type="submit"
            variant="danger"
            size="medium"
            isLoading={deleteLoading}
            onClick={handleDelete}
            isDisabled={!maybeFallbackAddressId}
          />
        </div>

        <div>
          <Button
            text={t("Save changes")}
            type="submit"
            variant="primary"
            size="medium"
            isLoading={updateLoading}
            onClick={handleUpdate}
          />
        </div>
      </div>
    </div>
  );
};
