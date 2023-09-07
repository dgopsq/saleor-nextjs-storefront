import { BaseIconPublicProps } from "@/components/core/Icon";
import { classNames } from "@/misc/styles";

type Props = {
  isActive?: boolean;
  Icon?: React.FC<BaseIconPublicProps>;
  compactOnMobile?: boolean;
  children: string;
};

/**
 * Component used to display a menu with a list of items.
 */
export const MenuItem: React.FC<Props> = ({
  isActive,
  Icon,
  children,
  compactOnMobile,
}) => {
  return (
    <div
      className={classNames(
        isActive
          ? "bg-secondary-50 border-secondary-50 text-primary-600"
          : "text-secondary-700  hover:bg-secondary-50",
        "flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold justify-center md:justify-start"
      )}
    >
      {Icon ? (
        <Icon
          className={classNames(
            isActive ? "text-primary-600" : "text-secondary-400",
            "h-6 w-6 shrink-0"
          )}
        />
      ) : undefined}

      <span className={compactOnMobile ? "hidden sm:inline" : ""}>
        {children}
      </span>
    </div>
  );
};
