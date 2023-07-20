import { classNames } from "@/misc/styles";
import { PropsWithChildren } from "react";
import { match } from "ts-pattern";

type Props = PropsWithChildren<{
  variant: "outline" | "outline-selected" | "solid" | "solid-darker";
  className?: string;
  noPadding?: boolean;
}>;

/**
 *
 */
export const Island: React.FC<Props> = ({
  variant,
  className,
  children,
  noPadding,
}) => {
  const computedVariant = match(variant)
    .with("outline", () => "border border-gray-100")
    .with(
      "outline-selected",
      () =>
        "border border-gray-100 outline outline-2 outline-offset-2 outline-indigo-600"
    )
    .with("solid", () => "bg-gray-50 border border-gray-50")
    .with("solid-darker", () => "bg-gray-200 border border-gray-200")
    .exhaustive();

  return (
    <div
      className={classNames(
        computedVariant,
        "rounded-lg h-full w-full",
        noPadding ? "" : "p-6",
        className ?? ""
      )}
    >
      {children}
    </div>
  );
};
