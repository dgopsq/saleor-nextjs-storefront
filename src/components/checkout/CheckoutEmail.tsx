import { Field } from "@/components/core/Field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "usehooks-ts";
import { z } from "zod";

const checkoutEmailFormSchema = z.object({
  email: z.string().email(),
});

type CheckoutEmailForm = z.infer<typeof checkoutEmailFormSchema>;

type Props = {
  checkoutToken: string;
  email?: string;
  onChange?: (email: string) => void;
  isLoading?: boolean;
};

/**
 *
 */
export const CheckoutEmail: React.FC<Props> = ({
  checkoutToken,
  email,
  onChange,
  isLoading,
}) => {
  const stableInitialValues = useMemo<CheckoutEmailForm>(
    () => ({ email: email ?? "" }),
    [email]
  );

  const {
    register,
    formState: { errors },
    watch,
  } = useForm<CheckoutEmailForm>({
    resolver: zodResolver(checkoutEmailFormSchema),
    mode: "onChange",
    values: stableInitialValues,
  });

  const watchedEmail = watch("email");
  const debouncedEmail = useDebounce(watchedEmail, 1000);

  useEffect(() => {
    if (errors || isLoading || !debouncedEmail) return;
    onChange?.(debouncedEmail);
  }, [debouncedEmail, onChange, isLoading, errors, checkoutToken]);

  return (
    <div>
      <Field
        id="checkoutEmail"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        disabled={email !== undefined}
        register={register("email")}
      />
    </div>
  );
};
