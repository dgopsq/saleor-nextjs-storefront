import { Spinner } from "@/components/core/Spinner";
import { classNames } from "@/misc/styles";
import { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { match } from "ts-pattern";

type BaseButtonProps = {
  text: string;
  size: "large" | "medium";
  variant: "primary" | "danger";
  isLoading?: boolean;
  isDisabled?: boolean;
} & Omit<
  HTMLAttributes<HTMLButtonElement> & ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "style" | "disabled"
>;

/**
 *
 */
export const Button: React.FC<BaseButtonProps> = ({
  text,
  size,
  variant,
  isLoading,
  isDisabled,
  ...props
}) => {
  const computedSize = match(size)
    .with("large", () => "h-12 w-full")
    .with("medium", () => "h-10 w-full")
    .exhaustive();

  const computedVariant = match(variant)
    .with("primary", () => "bg-indigo-600 enabled:hover:bg-indigo-700")
    .with("danger", () => "bg-red-600 enabled:hover:bg-red-700")
    .exhaustive();

  const disabledState = isLoading || isDisabled;

  return (
    <button
      type="button"
      className={classNames(
        "flex flex-1 items-center justify-center rounded-md border border-transparent  text-base font-medium text-white focus:outline-none",
        computedSize,
        computedVariant,
        disabledState ? "opacity-75 cursor-not-allowed" : ""
      )}
      disabled={disabledState}
      {...props}
    >
      {isLoading ? <Spinner size="button" variant="white" /> : text}
    </button>
  );
};
