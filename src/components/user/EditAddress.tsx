"use client";

import {
  AddressTypeEnum,
  GenericAddressFragmentDoc,
  UserSetDefaultAddressDocument,
  UserUpdateAddressDocument,
} from "@/__generated__/graphql";
import { AddressForm, AddressFormRef } from "@/components/core/AddressForm";
import { Button } from "@/components/core/Button";
import { errorToast, successToast } from "@/components/core/Notifications";
import { logger } from "@/misc/logger";
import { addressToAddressForm, parseAddress } from "@/queries/user/data";
import { useFragment, useMutation } from "@apollo/client";
import { useCallback, useEffect, useRef } from "react";

type Props = {
  id: string;
};

/**
 *
 */
export const EditAddress = ({ id }: Props) => {
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

  const [
    setDefaultAddress,
    { loading: setDefaultLoading, data: setDefaultData },
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

  const handleSetBillingDefault = useCallback(() => {
    setDefaultAddress({
      variables: { addressId: id, addressType: AddressTypeEnum.Billing },
    });
  }, [setDefaultAddress, id]);

  const handleSetShippingDefault = useCallback(() => {
    setDefaultAddress({
      variables: { addressId: id, addressType: AddressTypeEnum.Shipping },
    });
  }, [setDefaultAddress, id]);

  useEffect(() => {
    if (updateData?.accountAddressUpdate?.user)
      successToast("The address has been updated.");
    else if (updateData?.accountAddressUpdate?.errors.length) {
      logger.error(
        "Address update errors",
        updateData.accountAddressUpdate.errors
      );

      errorToast("There was an error updating the address.");
    }
  }, [updateData]);

  useEffect(() => {
    if (setDefaultData?.accountSetDefaultAddress?.user)
      successToast("The address has been set as default.");
    else if (setDefaultData?.accountSetDefaultAddress?.errors.length) {
      logger.error(
        "Address set default errors",
        setDefaultData.accountSetDefaultAddress.errors
      );

      errorToast("There was an error setting the address as default.");
    }
  }, [updateData, setDefaultData]);

  if (!data || !complete) return null;

  console.log(data);

  return (
    <div>
      <h3 className="text-xl font-semibold">Edit address</h3>

      <div className="mt-8 pb-16 border-b border-gray-100">
        <AddressForm
          ref={addressFormRef}
          initialValues={addressToAddressForm(parseAddress(data))}
        />
      </div>

      <div className="mt-16 flex justify-end">
        <div className="ml-4 w-48">
          <Button
            text="Default for shipping"
            type="submit"
            variant="primary"
            size="medium"
            isLoading={setDefaultLoading}
            onClick={handleSetShippingDefault}
            isDisabled={!!data.isDefaultShippingAddress}
          />
        </div>

        <div className="ml-4 w-48">
          <Button
            text="Default for billing"
            type="submit"
            variant="primary"
            size="medium"
            isLoading={setDefaultLoading}
            onClick={handleSetBillingDefault}
            isDisabled={!!data.isDefaultBillingAddress}
          />
        </div>

        <div className="ml-4 w-48">
          <Button
            text="Save changes"
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
