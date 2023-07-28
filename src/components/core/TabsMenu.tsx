import { BaseIconPublicProps } from "@/components/core/Icon";
import { MenuItem } from "@/components/core/MenuItem";
import { Route } from "next";
import Link from "next/link";

type TabItem<T extends string> = {
  id: T;
  label: string;
  href: Route;
  Icon?: React.FC<BaseIconPublicProps>;
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
              <Link href={item.href}>
                <MenuItem isActive={isActive} Icon={item.Icon}>
                  {item.label}
                </MenuItem>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
