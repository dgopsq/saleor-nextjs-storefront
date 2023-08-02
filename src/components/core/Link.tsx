import { classNames } from "@/misc/styles";
import { default as BaseLink, LinkProps } from "next/link";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<LinkProps & { className?: string }>;

/**
 *
 */
export const Link = ({ className, ...props }: Props) => {
  return (
    <BaseLink
      className={classNames(className ?? "text-indigo-600 hover:underline")}
      {...props}
    />
  );
};
