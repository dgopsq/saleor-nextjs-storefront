"use client";

import { UserCreateAddressDocument } from "@/__generated__/graphql";
import { AddressForm, AddressFormRef } from "@/components/core/AddressForm";
import { Button } from "@/components/core/Button";
import { PageHeading } from "@/components/core/Headings";
import { errorToast, successToast } from "@/components/core/Notifications";
import { logger } from "@/misc/logger";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

/**
 *
 */
export const NewAddress: React.FC = () => {
  const router = useRouter();
  const addressFormRef = useRef<AddressFormRef>(null);

  const [createAddress, { loading: createLoading, data: createData }] =
    useMutation(UserCreateAddressDocument);

  const handleCreate = useCallback(async () => {
    const data = (await addressFormRef.current?.getValues()) ?? null;

    if (data)
      createAddress({
        variables: {
          input: data,
        },
      });
  }, [createAddress]);

  useEffect(() => {
    if (createData?.accountAddressCreate?.user) {
      successToast("The address has been created.");
      router.push("/account/addresses");
    } else if (createData?.accountAddressCreate?.errors.length) {
      logger.error(
        "Address create errors",
        createData?.accountAddressCreate.errors
      );

      errorToast("There was an error creating the address.");
    }
  }, [createData, router]);

  return (
    <div>
      <PageHeading>Add new address</PageHeading>

      <div className="mt-8 pb-16 border-b border-gray-100">
        <AddressForm
          ref={addressFormRef}
          asyncErrors={createData?.accountAddressCreate?.errors ?? []}
        />
      </div>

      <div className="mt-16 flex justify-end">
        <div className="w-48">
          <Button
            text="Save changes"
            type="submit"
            variant="primary"
            size="medium"
            isLoading={createLoading}
            onClick={handleCreate}
          />
        </div>
      </div>
    </div>
  );
};
