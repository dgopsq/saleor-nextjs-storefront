"use client";

import { Fragment, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import { classNames } from "@/misc/styles";
import Image from "next/image";
import { Category } from "@/queries/categories/data";
import { CartButton } from "@/components/checkout/CartButton";
import { UserButton } from "@/components/user/UserButton";
import { useCheckoutIdStore } from "@/misc/states/checkoutIdStore";
import { Spinner } from "@/components/core/Spinner";
import { CloseIcon, HamburgerIcon, SearchIcon } from "@/components/core/Icon";
import Link from "next/link";
import { Route } from "next";
import { accountRoute, cartRoute, homeRoute } from "@/misc/navigation";

type Props = {
  categories: Array<Category>;
};

/**
 *
 */
export const Navbar: React.FC<Props> = ({ categories }) => {
  const [open, setOpen] = useState(false);
  const checkoutToken = useCheckoutIdStore((state) => state.value);

  const isCheckoutTokenLoading =
    checkoutToken.kind === "Loading" || checkoutToken.kind === "NotAsked";

  const isUserLoading = isCheckoutTokenLoading;

  return (
    <div className="bg-white">
      {/* Mobile menu */}
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
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <CloseIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Links */}
                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200">
                    <Tab.List className="-mb-px flex space-x-8 px-4">
                      {categories.map((category) => (
                        <Tab
                          key={category.name}
                          className={({ selected }) =>
                            classNames(
                              selected
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-gray-900",
                              "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium"
                            )
                          }
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    {categories.map((category, categoryIdx) => (
                      <Tab.Panel
                        key={category.name}
                        className="space-y-12 px-4 pb-6 pt-10"
                      >
                        <div className="grid grid-cols-1 items-start gap-x-6 gap-y-10">
                          <div className="grid grid-cols-1 gap-x-6 gap-y-10">
                            <div>
                              <ul
                                role="list"
                                aria-labelledby={`mobile-featured-heading-${categoryIdx}`}
                                className="mt-6 space-y-6"
                              >
                                {category.children.map((subCategory) => (
                                  <li key={subCategory.name} className="flex">
                                    <Link
                                      href={`/categories/${subCategory.slug}`}
                                      className="text-gray-500"
                                      onClick={() => setOpen(false)}
                                    >
                                      {subCategory.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  <div className="flow-root">
                    <Link
                      href={accountRoute}
                      className="-m-2 block p-2 font-medium text-gray-900"
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

      <header className="relative">
        <nav aria-label="Top">
          {/* Secondary navigation */}
          <div className="bg-white border-b border-gray-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div>
                <div className="flex h-20 items-center justify-between">
                  {/* Logo (lg+) */}
                  <div className="hidden lg:flex lg:items-center">
                    <Link href={homeRoute}>
                      <span className="sr-only">Your Company</span>
                      <Image
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg"
                        alt=""
                        width={100}
                        height={100}
                      />
                    </Link>
                  </div>

                  <div className="hidden h-full lg:flex">
                    {/* Mega menus */}
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
                                        : "border-transparent text-gray-700 hover:text-gray-800",
                                      "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out"
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
                                    {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                    <div
                                      className="absolute inset-0 top-1/2 bg-white shadow"
                                      aria-hidden="true"
                                    />

                                    <div className="relative bg-white">
                                      <div className="mx-auto max-w-7xl px-8">
                                        <div className="grid grid-cols-2 items-start gap-x-8 gap-y-10 pb-12 pt-10">
                                          <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                                            <ul
                                              role="list"
                                              aria-labelledby="desktop-collection-heading"
                                              className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                            >
                                              {category.children.map(
                                                (subCategory) => (
                                                  <li
                                                    key={subCategory.name}
                                                    className="flex"
                                                  >
                                                    <Popover.Button
                                                      as={Link}
                                                      href={
                                                        // FIXME: This is unsafe.
                                                        `/categories/${subCategory.slug}` as Route
                                                      }
                                                      className="hover:text-gray-800"
                                                    >
                                                      {subCategory.name}
                                                    </Popover.Button>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        </div>
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
                  </div>

                  {/* Mobile menu and search (lg-) */}
                  <div className="flex flex-1 items-center lg:hidden">
                    <button
                      type="button"
                      className="-ml-2 rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setOpen(true)}
                    >
                      <span className="sr-only">Open menu</span>
                      <HamburgerIcon className="h-6 w-6" />
                    </button>

                    {/* Search */}
                    <a
                      href="#"
                      className="ml-2 p-2 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Search</span>
                      <SearchIcon className="h-6 w-6" />
                    </a>
                  </div>

                  {/* Logo (lg-) */}
                  <a href="#" className="lg:hidden">
                    <Image
                      src="https://tailwindui.com/img/logos/mark.svg"
                      alt=""
                      className="h-8 w-auto"
                      width={100}
                      height={100}
                    />
                  </a>

                  <div className="flex flex-1 items-center justify-end">
                    <div className="flex items-center lg:ml-8">
                      {isUserLoading ? (
                        <div>
                          <Spinner variant="main" size="button" />
                        </div>
                      ) : (
                        <>
                          <div className="flex space-x-8">
                            <Link href={accountRoute}>
                              <UserButton />
                            </Link>
                          </div>

                          <span
                            className="mx-4 h-6 w-px bg-gray-200 lg:mx-6"
                            aria-hidden="true"
                          />

                          <div className="flow-root">
                            <Link href={cartRoute}>
                              <CartButton />
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};
