"use client";

import { useState } from "react";
import { Category } from "@/queries/categories/data";
import { CartButton } from "@/components/checkout/CartButton";
import { UserButton } from "@/components/user/UserButton";
import { useCheckoutIdStore } from "@/misc/states/checkoutIdStore";
import { Spinner } from "@/components/core/Spinner";
import { HamburgerIcon } from "@/components/core/Icon";
import Link from "next/link";
import { accountRoute, cartRoute } from "@/misc/navigation";
import { MobileNavbar } from "@/components/navigation/MobileNavbar";
import { Logo } from "@/components/navigation/Logo";
import { Categories } from "@/components/navigation/Categories";

type Props = {
  categories: Array<Category>;
};

/**
 * The main Navbar component.
 */
export const Navbar: React.FC<Props> = ({ categories }) => {
  const [open, setOpen] = useState(false);
  const checkoutToken = useCheckoutIdStore((state) => state.value);

  const isCheckoutTokenLoading =
    checkoutToken.kind === "Loading" || checkoutToken.kind === "NotAsked";

  const isUserLoading = isCheckoutTokenLoading;

  return (
    <div className="bg-white">
      <MobileNavbar categories={categories} open={open} setOpen={setOpen} />

      <header className="relative">
        <nav aria-label="Top">
          <div className="bg-white border-b border-secondary-200">
            <div className="mx-auto max-w-7xl px-4">
              <div>
                <div className="flex h-20 items-center justify-between">
                  <div className="hidden lg:flex lg:items-center">
                    <Logo />
                  </div>

                  <div className="hidden h-full lg:flex">
                    <Categories categories={categories} />
                  </div>

                  <div className="flex flex-1 items-center lg:hidden">
                    <button
                      type="button"
                      className="-ml-2 rounded-md bg-white p-2 text-secondary-400"
                      onClick={() => setOpen(true)}
                    >
                      <HamburgerIcon className="h-6 w-6" />
                    </button>

                    <div className="lg:hidden ml-4">
                      <Logo />
                    </div>
                  </div>

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
                            className="mx-4 h-6 w-px bg-secondary-200 lg:mx-6"
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
