import { Spinner } from "@/components/core/Spinner";
import { classNames } from "@/misc/styles";
import { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { match } from "ts-pattern";

type BaseButtonProps = {
  text: string;
  size: "large";
  variant: "primary";
  isLoading?: boolean;
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
  ...props
}) => {
  const computedSize = match(size)
    .with("large", () => "h-12 w-full")
    .exhaustive();

  const computedVariant = match(variant)
    .with("primary", () => "bg-indigo-600 enabled:hover:bg-indigo-700")
    .exhaustive();

  return (
    <button
      type="button"
      className={classNames(
        "flex flex-1 items-center justify-center rounded-md border border-transparent  text-base font-medium text-white focus:outline-none",
        computedSize,
        computedVariant,
        isLoading ? "opacity-75 cursor-not-allowed" : ""
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Spinner size="button" variant="white" /> : text}
    </button>
  );
};
