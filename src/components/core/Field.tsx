import { HTMLInputTypeAttribute } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props<T extends string> = {
  label: string;
  id: string;
  register: UseFormRegisterReturn<T>;
  error?: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
};

/**
 *
 */
export const Field = <T extends string>({
  label,
  id,
  register,
  error,
  type,
  autoComplete,
}: Props<T>) => {
  return (
    <>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type={type}
          autoComplete={autoComplete}
          {...register}
        />
        {error ? (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        ) : undefined}
      </div>
    </>
  );
};
