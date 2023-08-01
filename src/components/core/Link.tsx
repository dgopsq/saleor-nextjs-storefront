import { default as BaseLink, LinkProps } from "next/link";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<LinkProps>;

/**
 *
 */
export const Link = (props: Props) => {
  return <BaseLink className="text-indigo-600 hover:underline" {...props} />;
};
