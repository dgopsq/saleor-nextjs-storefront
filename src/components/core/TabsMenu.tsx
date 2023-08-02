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
    <nav aria-label="Sidebar">
      <ul className="space-x-1 flex flex-row md:flex-col md:space-y-1">
        {items.map((item) => {
          const isActive = !!active?.startsWith(item.id);

          return (
            <li key={item.id} className="flex-grow flex-shrink basis-full">
              <Link href={item.href}>
                <MenuItem isActive={isActive} Icon={item.Icon} compactOnMobile>
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
