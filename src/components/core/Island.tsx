import { classNames } from "@/misc/styles";
import { PropsWithChildren } from "react";
import { match } from "ts-pattern";

type Props = PropsWithChildren<{
  variant: "outline";
  className?: string;
}>;

/**
 *
 */
export const Island: React.FC<Props> = ({ variant, className, children }) => {
  const computedVariant = match(variant)
    .with("outline", () => "border border-gray-100")
    .exhaustive();

  return (
    <div
      className={classNames(
        computedVariant,
        "rounded-lg h-full w-full p-6",
        className ?? ""
      )}
    >
      {children}
    </div>
  );
};
