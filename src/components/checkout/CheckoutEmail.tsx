import { UpdateCheckoutEmailDocument } from "@/__generated__/graphql";
import { Field } from "@/components/core/Field";
import { useMutation } from "@apollo/client";
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
};

/**
 *
 */
export const CheckoutEmail: React.FC<Props> = ({ checkoutToken, email }) => {
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

  const [updateEmail, { loading }] = useMutation(UpdateCheckoutEmailDocument);

  const watchedEmail = watch("email");
  const debouncedEmail = useDebounce(watchedEmail, 1000);

  useEffect(() => {
    if (errors || loading || !debouncedEmail) return;

    updateEmail({
      variables: {
        checkoutToken,
        email: debouncedEmail,
      },
    });
  }, [debouncedEmail, updateEmail, loading, errors, checkoutToken]);

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
