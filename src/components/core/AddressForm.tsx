"use client";

import { CountryCode } from "@/__generated__/graphql";
import { CountrySelect } from "@/components/core/CountrySelect";
import { Field } from "@/components/core/Field";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const defaultCountry = CountryCode.It;

/**
 *
 */
const AddressFormSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  companyName: z.string().trim().optional(),
  streetAddress1: z.string().trim().min(1),
  streetAddress2: z.string().trim().optional(),
  city: z.string().trim().min(1),
  postalCode: z.string().trim().min(1),
  country: z.nativeEnum(CountryCode),
  countryArea: z.string().trim().min(1),
  phone: z.string().trim().optional(),
});

/**
 *
 */
export type AddressForm = z.infer<typeof AddressFormSchema>;

export type AddressFormRef = {
  getValues: () => Promise<AddressForm | null>;
};

type Props = {
  initialValues?: Partial<AddressForm>;
};

/**
 *
 */
export const AddressForm = forwardRef<AddressFormRef, Props>(
  ({ initialValues }, ref) => {
    const stableInitialValues = useMemo<AddressForm>(
      () => ({
        firstName: "",
        lastName: "",
        companyName: "",
        streetAddress1: "",
        streetAddress2: "",
        city: "",
        postalCode: "",
        country: defaultCountry,
        countryArea: "",
        phone: "",
        ...initialValues,
      }),
      [initialValues]
    );

    const {
      register,
      formState: { errors },
      control,
      getValues,
      trigger,
    } = useForm<AddressForm>({
      resolver: zodResolver(AddressFormSchema),
      mode: "onChange",

      // We want this form to initialize values
      // even after the first render due to async
      // issues in the `Profile` component.
      values: stableInitialValues,
    });

    useImperativeHandle<AddressFormRef, Pick<AddressFormRef, "getValues">>(
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
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 max-w-3xl">
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

        <div className="sm:col-span-3">
          <Field
            id="companyNamy"
            label="Company name"
            register={register("companyName")}
            error={errors.companyName?.message}
          />
        </div>

        <div className="col-span-full">
          <Field
            id="streetAddress1"
            label="Street address 1"
            register={register("streetAddress1")}
            error={errors.streetAddress1?.message}
          />
        </div>

        <div className="col-span-full">
          <Field
            id="streetAddress2"
            label="Street address 2"
            register={register("streetAddress2")}
            error={errors.streetAddress2?.message}
          />
        </div>

        <div className="sm:col-span-3 sm:col-start-1">
          <Field
            id="city"
            label="City"
            register={register("city")}
            error={errors.city?.message}
          />
        </div>

        <div className="sm:col-span-3">
          <Controller
            name="country"
            control={control}
            render={({ field, fieldState }) => (
              <CountrySelect
                label="Country"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div className="sm:col-span-3">
          <Field
            id="countryArea"
            label="Country area"
            register={register("countryArea")}
            error={errors.countryArea?.message}
          />
        </div>

        <div className="sm:col-span-3">
          <Field
            id="postalCode"
            label="Postal code"
            register={register("postalCode")}
            error={errors.postalCode?.message}
          />
        </div>
      </div>
    );
  }
);
