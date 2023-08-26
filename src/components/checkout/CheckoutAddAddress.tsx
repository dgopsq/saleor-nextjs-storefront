import { getFragmentData } from "@/__generated__";
import {
  GenericAddressFragmentDoc,
  UserCreateAddressDocument,
} from "@/__generated__/graphql";
import { AddressForm, AddressFormRef } from "@/components/core/AddressForm";
import { Button } from "@/components/core/Button";
import { Address, parseAddress } from "@/queries/user/data";
import { useMutation } from "@apollo/client";
import { useTranslations } from "next-intl";
import { FormEventHandler, useCallback, useRef } from "react";

type Props = {
  onCancel?: () => void;
  onAddressCreated?: (address: Address) => void;
};

/**
 * The form to add a new address in the checkout.
 */
export const CheckoutAddAddress: React.FC<Props> = ({
  onCancel,
  onAddressCreated,
}) => {
  const t = useTranslations("Checkout");
  const formRef = useRef<AddressFormRef>(null);
  const [createAddress, { loading, data }] = useMutation(
    UserCreateAddressDocument
  );

  const handleSubmit = useCallback(async () => {
    const formData = (await formRef.current?.getValues()) ?? null;

    if (formData) {
      createAddress({
        variables: {
          input: formData,
        },
        onCompleted: (data) => {
          const maybeAddress =
            getFragmentData(
              GenericAddressFragmentDoc,
              data.accountAddressCreate?.address
            ) ?? null;

          if (maybeAddress) {
            onAddressCreated?.(parseAddress(maybeAddress));
            onCancel?.();
          }
        },
      });
    }
  }, [createAddress, onCancel, onAddressCreated]);

  const handleFormSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      handleSubmit();
    },
    [handleSubmit]
  );

  return (
    <form onSubmit={handleFormSubmit}>
      <AddressForm
        ref={formRef}
        asyncErrors={data?.accountAddressCreate?.errors}
        compact
      />

      <div className="flex flex-row justify-end gap-4 mt-8">
        <div>
          <Button
            variant="secondary"
            size="medium"
            text={t("Cancel")}
            onClick={onCancel}
            isDisabled={loading}
          />
        </div>

        <div>
          <Button
            variant="primary"
            size="medium"
            type="submit"
            text={t("Create address")}
            onClick={handleSubmit}
            isLoading={loading}
          />
        </div>
      </div>
    </form>
  );
};
