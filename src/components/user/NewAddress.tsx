"use client";

import { UserCreateAddressDocument } from "@/__generated__/graphql";
import { AddressForm, AddressFormRef } from "@/components/core/AddressForm";
import { Button } from "@/components/core/Button";
import { PageHeading } from "@/components/core/Headings";
import { errorToast, successToast } from "@/components/core/Notifications";
import { logger } from "@/misc/logger";
import { addressesRoute } from "@/misc/navigation";
import { useMutation } from "@apollo/client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

/**
 * Renders the page to create a new address.
 */
export const NewAddress: React.FC = () => {
  const t = useTranslations("User");
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
      successToast(t("The address has been created"));
      router.push(addressesRoute);
    } else if (createData?.accountAddressCreate?.errors.length) {
      logger.error(
        "Address create errors",
        createData?.accountAddressCreate.errors
      );

      errorToast(t("There was an error creating the address"));
    }
  }, [createData, router, t]);

  return (
    <div>
      <PageHeading>{t("Add new address")}</PageHeading>

      <div className="mt-8 pb-16 border-b border-secondary-100">
        <AddressForm
          ref={addressFormRef}
          asyncErrors={createData?.accountAddressCreate?.errors ?? []}
        />
      </div>

      <div className="mt-16 flex justify-end">
        <div className="w-48">
          <Button
            text={t("Save changes")}
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
