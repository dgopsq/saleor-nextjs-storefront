import { BaseIconPublicProps } from "@/components/core/Icon";
import { classNames } from "@/misc/styles";

type Props = {
  isActive?: boolean;
  Icon?: React.FC<BaseIconPublicProps>;
  children: string;
};

/**
 *
 */
export const MenuItem: React.FC<Props> = ({ isActive, Icon, children }) => {
  return (
    <div
      className={classNames(
        isActive
          ? "bg-gray-50 text-indigo-600"
          : "text-gray-700  hover:bg-gray-50",
        "flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
      )}
    >
      {Icon ? (
        <Icon
          className={classNames(
            isActive ? "text-indigo-600" : "text-gray-400",
            "h-6 w-6 shrink-0"
          )}
        />
      ) : undefined}

      {children}
    </div>
  );
};
