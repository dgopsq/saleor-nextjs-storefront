import { classNames } from "@/misc/styles";
import { default as BaseLink, LinkProps } from "next/link";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<LinkProps & { className?: string }>;

/**
 * Component used to display a link.
 */
export const Link = ({ className, ...props }: Props) => {
  return (
    <BaseLink
      className={classNames(className ?? "text-primary-600 hover:underline")}
      {...props}
    />
  );
};
