"use client";

import { Link } from "@/components/core/Link";
import { generateCategoryRoute } from "@/misc/navigation";
import { classNames } from "@/misc/styles";
import { Category } from "@/queries/categories/data";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";

type Props = {
  categories: Array<Category>;
};

/**
 *
 */
export const Categories: React.FC<Props> = ({ categories }) => {
  return (
    <Popover.Group className="ml-8 z-10">
      <div className="flex h-full justify-center space-x-8">
        {categories.map((category) => (
          <Popover key={category.name} className="flex">
            {({ open }) => (
              <>
                <div className="relative flex">
                  <Popover.Button
                    className={classNames(
                      open
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-800",
                      "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out outline-none"
                    )}
                  >
                    {category.name}
                  </Popover.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Popover.Panel className="absolute inset-x-0 top-full text-gray-500 sm:text-sm">
                    <div
                      className="absolute inset-0 top-1/2 bg-white shadow"
                      aria-hidden="true"
                    />

                    <div className="relative bg-white">
                      <div className="mx-auto max-w-7xl px-8 my-10">
                        <div>
                          <Link
                            href={generateCategoryRoute(category.slug)}
                            className="text-lg font-medium text-gray-900"
                          >
                            {category.name}
                          </Link>
                        </div>

                        <ul
                          role="list"
                          aria-labelledby="desktop-collection-heading"
                          className="mt-6 space-x-8 flex flex-row items-center"
                        >
                          {category.children.map((subCategory) => (
                            <li key={subCategory.name}>
                              <Popover.Button
                                as={Link}
                                href={generateCategoryRoute(subCategory.slug)}
                                className="text-gray-500 hover:text-gray-800 text-sm font-medium"
                              >
                                {subCategory.name}
                              </Popover.Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        ))}
      </div>
    </Popover.Group>
  );
};
