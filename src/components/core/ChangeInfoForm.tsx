"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/core/Field";
import { forwardRef, useImperativeHandle, useMemo } from "react";

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

export type ChangeInfoFormRef = {
  getValues: () => Promise<ChangeInfoForm | null>;
};

type Props = {
  initialValues?: Partial<ChangeInfoForm>;
};

/**
 *
 */
export const ChangeInfoForm = forwardRef<ChangeInfoFormRef, Props>(
  ({ initialValues }, ref) => {
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
      getValues,
      trigger,
    } = useForm<ChangeInfoForm>({
      resolver: zodResolver(ChangeInfoFormSchema),
      values: stableInitialValues,
    });

    useImperativeHandle<
      ChangeInfoFormRef,
      Pick<ChangeInfoFormRef, "getValues">
    >(
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
    );
  }
);
