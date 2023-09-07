import { Spinner } from "@/components/core/Spinner";
import { classNames } from "@/misc/styles";
import { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { match } from "ts-pattern";

type BaseButtonProps = {
  text: string;
  size: "large" | "medium";
  variant: "primary" | "secondary" | "danger";
  isLoading?: boolean;
  isDisabled?: boolean;
} & Omit<
  HTMLAttributes<HTMLButtonElement> & ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "style" | "disabled"
>;

/**
 * Generic button component with various variants and styles.
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
    .with("primary", () => "bg-primary-600 enabled:hover:bg-primary-700")
    .with("secondary", () => "bg-secondary-400 enabled:hover:bg-secondary-500")
    .with("danger", () => "bg-danger-600 enabled:hover:bg-danger-700")
    .exhaustive();

  const disabledState = isLoading || isDisabled;

  return (
    <button
      type="button"
      className={classNames(
        "relative flex flex-1 items-center justify-center rounded-md border border-transparent text-base font-medium text-white focus:outline-none px-8",
        computedSize,
        computedVariant,
        disabledState ? "opacity-75 cursor-not-allowed" : ""
      )}
      disabled={disabledState}
      {...props}
    >
      <span className={isLoading ? "invisible" : undefined}>{text}</span>

      {isLoading ? (
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <Spinner size="button" variant="white" />
        </div>
      ) : undefined}
    </button>
  );
};

/**
 * Generic text-button component with various variants and styles.
 */
export const TextButton: React.FC<
  Omit<BaseButtonProps, "size" | "isLoading">
> = ({ text, variant, isDisabled, ...props }) => {
  const computedVariant = match(variant)
    .with("primary", () => "text-primary-600 enabled:hover:text-primary-700")
    .with(
      "secondary",
      () => "text-secondary-600 enabled:hover:text-secondary-700"
    )
    .with("danger", () => "text-danger-600 enabled:hover:text-danger-700")
    .exhaustive();

  const disabledState = isDisabled;

  return (
    <button
      type="button"
      className={classNames(
        "relative flex flex-1 items-center justify-center rounded-md border border-transparent text-sm font-medium focus:outline-none hover:underline",
        computedVariant,
        disabledState ? "opacity-75 cursor-not-allowed" : ""
      )}
      disabled={disabledState}
      {...props}
    >
      {text}
    </button>
  );
};
