import { classNames } from "@/misc/styles";

type SidebarItem<T extends string> = {
  id: T;
  label: string;
  href: string;
};

type Props<T extends string> = {
  items: Array<SidebarItem<T>>;
  active: T;
};

/**
 *
 */
export const Sidebar = <T extends string>({ active, items }: Props<T>) => (
  <nav className="flex flex-1 flex-col">
    <ul role="list">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href="#"
            className={classNames(
              active === item.id
                ? "bg-gray-50 text-indigo-600"
                : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
              "group flex gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold"
            )}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);
