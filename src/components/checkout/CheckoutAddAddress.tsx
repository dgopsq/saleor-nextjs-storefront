import { UserCreateAddressDocument } from "@/__generated__/graphql";
import { AddressForm, AddressFormRef } from "@/components/core/AddressForm";
import { Button } from "@/components/core/Button";
import { useMutation } from "@apollo/client";
import { useCallback, useEffect, useRef } from "react";

type Props = {
  onCancel?: () => void;
};

/**
 *
 */
export const CheckoutAddAddress: React.FC<Props> = ({ onCancel }) => {
  const formRef = useRef<AddressFormRef>(null);
  const [createAddress, { data, loading }] = useMutation(
    UserCreateAddressDocument
  );

  const handleSubmit = useCallback(async () => {
    const formData = (await formRef.current?.getValues()) ?? null;

    if (formData) {
      createAddress({
        variables: {
          input: formData,
        },
      });
    }
  }, [createAddress]);

  useEffect(() => {
    if (data?.accountAddressCreate?.user) onCancel?.();
  }, [data, onCancel]);

  return (
    <div>
      <AddressForm ref={formRef} compact />

      <div className="flex flex-row justify-end gap-4 mt-8">
        <div>
          <Button
            variant="secondary"
            size="medium"
            text="Cancel"
            onClick={onCancel}
            isDisabled={loading}
          />
        </div>

        <div>
          <Button
            variant="primary"
            size="medium"
            text="Create address"
            onClick={handleSubmit}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
};
