import { Label } from "@/components/core/Label";
import { classNames } from "@/misc/styles";
import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props<T extends string> = {
  label: string;
  id: string;
  register?: UseFormRegisterReturn<T>;
  error?: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
  value?: InputHTMLAttributes<HTMLInputElement>["value"];
  disabled?: boolean;
};

/**
 * A managed form field to be used with a specific form library.
 */
export const Field = <T extends string>({
  label,
  id,
  register,
  error,
  type,
  autoComplete,
  onChange,
  value,
  disabled,
}: Props<T>) => {
  return (
    <>
      <Label htmlFor={id}>{label}</Label>

      <div className="mt-2">
        <input
          id={id}
          className={classNames(
            "block w-full rounded-md border-0 py-1.5 px-2 text-secondary-900 shadow-sm ring-1 ring-inset ring-secondary-300 placeholder:text-secondary-400 focus:ring-1 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6",
            disabled ? "bg-secondary-50 cursor-not-allowed" : "",
            error ? "ring-danger-600" : ""
          )}
          type={type}
          autoComplete={autoComplete}
          onChange={onChange}
          value={value}
          disabled={disabled}
          {...register}
        />
        {error ? (
          <p className="text-xs text-danger-600 mt-1">{error}</p>
        ) : undefined}
      </div>
    </>
  );
};
