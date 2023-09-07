"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/core/Field";
import { useMemo } from "react";
import { Button } from "@/components/core/Button";
import { useTranslations } from "next-intl";

/**
 * The schema for the change informations form.
 */
const changeInfoFormSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
});

/**
 * Type describing the change informations form.
 */
export type ChangeInfoForm = z.infer<typeof changeInfoFormSchema>;

type Props = {
  onSubmit: (data: ChangeInfoForm) => void;
  initialValues?: Partial<ChangeInfoForm>;
  isLoading?: boolean;
};

/**
 * The form used by the user to change her/his informations.
 */
export const ChangeInfoForm: React.FC<Props> = ({
  initialValues,
  onSubmit,
  isLoading,
}) => {
  const t = useTranslations("User");
  const stableInitialValues = useMemo<ChangeInfoForm>(
    () => ({
      firstName: "",
      lastName: "",
      ...initialValues,
    }),
    [initialValues]
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ChangeInfoForm>({
    resolver: zodResolver(changeInfoFormSchema),
    values: stableInitialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Field
              id="firstName"
              label={t("First name")}
              register={register("firstName")}
              error={errors.firstName?.message}
            />
          </div>

          <div className="sm:col-span-3">
            <Field
              id="lastName"
              label={t("Last name")}
              register={register("lastName")}
              error={errors.lastName?.message}
            />
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-end">
        <div>
          <Button
            variant="primary"
            size="medium"
            text={t("Change info")}
            type="submit"
            isLoading={isLoading}
          />
        </div>
      </div>
    </form>
  );
};
