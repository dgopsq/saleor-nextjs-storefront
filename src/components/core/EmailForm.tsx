"use client";

import { Field } from "@/components/core/Field";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/**
 * The schema for the email form.
 */
const EmailFormSchema = z.object({
  email: z.string().email(),
});

/**
 * Type describing the email form.
 */
export type EmailForm = z.infer<typeof EmailFormSchema>;

export type EmailFormRef = {
  getValues: () => Promise<EmailForm | null>;
};

type Props = {
  initialValues?: Partial<EmailForm>;
};

/**
 * The form used by the user to change her/his email.
 */
export const EmailForm = forwardRef<EmailFormRef, Props>(
  ({ initialValues }, ref) => {
    const stableInitialValues = useMemo<EmailForm>(
      () => ({
        email: "",
        ...initialValues,
      }),
      [initialValues]
    );

    const {
      register,
      formState: { errors },
      getValues,
      trigger,
    } = useForm<EmailForm>({
      resolver: zodResolver(EmailFormSchema),
      mode: "onChange",
      values: stableInitialValues,
    });

    useImperativeHandle<EmailFormRef, Pick<EmailFormRef, "getValues">>(
      ref,
      () => ({
        getValues: async () => {
          const isValid = await trigger();
          return isValid ? getValues() : null;
        },
      }),
      [getValues, trigger]
    );

    return (
      <div>
        <Field
          id="email"
          label="Email"
          register={register("email")}
          error={errors.email?.message}
        />
      </div>
    );
  }
);
