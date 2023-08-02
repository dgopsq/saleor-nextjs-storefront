"use client";

import { CloseIcon } from "@/components/core/Icon";
import { Link } from "@/components/core/Link";
import { accountRoute, generateCategoryRoute } from "@/misc/navigation";
import { Category } from "@/queries/categories/data";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

type Props = {
  categories: Array<Category>;
  open: boolean;
  setOpen: (open: boolean) => void;
};

/**
 *
 */
export const MobileNavbar: React.FC<Props> = ({
  categories,
  open,
  setOpen,
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl p-8">
              <div className="flex pb-2">
                <button
                  type="button"
                  className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <CloseIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-4">
                <ul className="space-y-8">
                  {categories.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={generateCategoryRoute(category.slug)}
                        className="text-lg font-medium text-gray-900"
                        onClick={() => setOpen(false)}
                      >
                        {category.name}
                      </Link>

                      <div>
                        <ul
                          role="list"
                          aria-labelledby="desktop-collection-heading"
                          className="mt-4 space-y-4 flex flex-col"
                        >
                          {category.children.map((subCategory) => (
                            <li key={subCategory.name}>
                              <Link
                                href={generateCategoryRoute(subCategory.slug)}
                                className="text-gray-500 hover:text-gray-800 text-sm font-medium"
                                onClick={() => setOpen(false)}
                              >
                                {subCategory.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6 border-t border-gray-200 mt-8 pt-8">
                <div className="flow-root">
                  <Link
                    href={accountRoute}
                    className="text-lg font-medium text-gray-900"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
