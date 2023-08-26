"use client";

import { CountryCode } from "@/__generated__/graphql";
import { CountrySelect } from "@/components/core/CountrySelect";
import { Field } from "@/components/core/Field";
import { classNames } from "@/misc/styles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { forwardRef, useCallback, useImperativeHandle, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const defaultCountry = CountryCode.It;

/**
 * The schema for the address form.
 */
const addressFormSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  companyName: z.string().trim().optional(),
  streetAddress1: z.string().trim().min(1),
  streetAddress2: z.string().trim().optional(),
  city: z.string().trim().min(1),
  postalCode: z.string().trim().min(1),
  country: z.nativeEnum(CountryCode),
  countryArea: z.string().trim().optional(),
  phone: z.string().trim().optional(),
});

/**
 * Type describing the address form.
 */
export type AddressForm = z.infer<typeof addressFormSchema>;

export type AddressFormRef = {
  getValues: () => Promise<AddressForm | null>;
};

type Props = {
  initialValues?: Partial<AddressForm>;
  compact?: boolean;
  asyncErrors?: Array<{ field?: string | null; message?: string | null }>;
};

/**
 * The form to add a new address in the checkout.
 */
export const AddressForm = forwardRef<AddressFormRef, Props>(
  ({ initialValues, compact, asyncErrors }, ref) => {
    const t = useTranslations("User");
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
      resolver: zodResolver(addressFormSchema),
      mode: "onChange",

      // We want this form to initialize values
      // even after the first render due to async
      // issues in the `Profile` component.
      values: stableInitialValues,
    });

    const asyncErrorsMap = useMemo(() => {
      const map = new Map<string, string>();

      if (asyncErrors)
        asyncErrors.forEach(({ field, message }) => {
          if (field && message) map.set(field, message);
        });

      return map;
    }, [asyncErrors]);

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

    const retrieveFieldError = useCallback(
      (field: keyof AddressForm) => {
        return errors[field]?.message || asyncErrorsMap.get(field);
      },
      [errors, asyncErrorsMap]
    );

    return (
      <div
        className={classNames(
          "grid grid-cols-1 sm:grid-cols-6",
          compact ? "gap-x-4 gap-y-4" : "gap-x-6 gap-y-8"
        )}
      >
        <div className="sm:col-span-3">
          <Field
            id="firstName"
            label={t("First name")}
            register={register("firstName")}
            error={retrieveFieldError("firstName")}
          />
        </div>

        <div className="sm:col-span-3">
          <Field
            id="lastName"
            label={t("Last name")}
            register={register("lastName")}
            error={retrieveFieldError("lastName")}
          />
        </div>

        <div className="col-span-full">
          <Field
            id="streetAddress1"
            label={t("Address")}
            register={register("streetAddress1")}
            error={retrieveFieldError("streetAddress1")}
          />
        </div>

        <div className="sm:col-span-3 sm:col-start-1">
          <Field
            id="city"
            label={t("City")}
            register={register("city")}
            error={retrieveFieldError("city")}
          />
        </div>

        <div className="sm:col-span-3">
          <Controller
            name="country"
            control={control}
            render={({ field, fieldState }) => (
              <CountrySelect
                label={t("Country")}
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
            label={t("Country area")}
            register={register("countryArea")}
            error={retrieveFieldError("countryArea")}
          />
        </div>

        <div className="sm:col-span-3">
          <Field
            id="postalCode"
            label={t("Postal code")}
            register={register("postalCode")}
            error={retrieveFieldError("postalCode")}
          />
        </div>
      </div>
    );
  }
);
