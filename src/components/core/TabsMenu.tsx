import { classNames } from "@/misc/styles";
import Link from "next/link";

type TabItem<T extends string> = {
  id: T;
  label: string;
  href: string;
  Icon?: React.FC<{ className?: string }>;
};

type Props<T extends string> = {
  items: Array<TabItem<T>>;
  active?: T;
};

/**
 *
 */
export const TabsMenu = <T extends string>({ active, items }: Props<T>) => {
  return (
    <nav className="flex flex-1 flex-col" aria-label="Sidebar">
      <ul role="list" className="space-y-1">
        {items.map((item) => {
          const isActive = item.id === active;

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className={classNames(
                  isActive
                    ? "bg-gray-50 text-indigo-600"
                    : "text-gray-700  hover:bg-gray-50",
                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                )}
              >
                {item.Icon ? (
                  <item.Icon
                    className={classNames(
                      isActive ? "text-indigo-600" : "text-gray-400",
                      "h-6 w-6 shrink-0"
                    )}
                  />
                ) : undefined}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
