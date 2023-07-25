"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/core/Field";
import { useMemo } from "react";
import { Button } from "@/components/core/Button";

/**
 *
 */
const ChangeInfoFormSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
});

/**
 *
 */
export type ChangeInfoForm = z.infer<typeof ChangeInfoFormSchema>;

type Props = {
  onSubmit: (data: ChangeInfoForm) => void;
  initialValues?: Partial<ChangeInfoForm>;
  isLoading?: boolean;
};

/**
 *
 */
export const ChangeInfoForm: React.FC<Props> = ({
  initialValues,
  onSubmit,
  isLoading,
}) => {
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
    resolver: zodResolver(ChangeInfoFormSchema),
    values: stableInitialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Field
              id="firstName"
              label="First name"
              register={register("firstName")}
              error={errors.firstName?.message}
            />
          </div>

          <div className="sm:col-span-3">
            <Field
              id="lastName"
              label="Last name"
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
            text="Change info"
            type="submit"
            isLoading={isLoading}
          />
        </div>
      </div>
    </form>
  );
};
