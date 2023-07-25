import { classNames } from "@/misc/styles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useCallback, useMemo } from "react";

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
  const router = useRouter();

  const initialValue = useMemo(() => {
    return items.find((items) => active === items.id)?.id;
  }, [items, active]);

  const handleChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (e) => {
      console.log(e.target.value);
      const maybeHref = items.find((item) => item.id === e.target.value)?.href;

      if (maybeHref) router.push(maybeHref);
    },
    [router, items]
  );

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>

        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue={initialValue}
          onChange={handleChange}
        >
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {items.map((item) => {
              const isCurrent = item.id === active;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={classNames(
                    isCurrent
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
                  )}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {item.Icon ? (
                    <item.Icon
                      className={classNames(
                        isCurrent
                          ? "text-indigo-500"
                          : "text-gray-400 group-hover:text-gray-500",
                        "-ml-0.5 mr-2 h-5 w-5"
                      )}
                    />
                  ) : undefined}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};
