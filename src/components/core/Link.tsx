import { default as BaseLink, LinkProps } from "next/link";

type Props<T extends string> = LinkProps<T>;

/**
 *
 */
export const Link = <T extends string>(props: Props<T>) => {
  return <BaseLink className="text-indigo-600 hover:underline" {...props} />;
};
