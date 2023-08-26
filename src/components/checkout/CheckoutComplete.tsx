"use client";

import { Island } from "@/components/core/Island";
import { Link } from "@/components/core/Link";
import { Signup } from "@/components/user/Signup";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { homeRoute, ordersRoute } from "@/misc/navigation";
import { useGuestOrderAccountStore } from "@/misc/states/guestOrderAccount";
import { useTranslations } from "next-intl";

/**
 * The checkout complete page.
 */
export const CheckoutComplete: React.FC = () => {
  const t = useTranslations("Checkout");
  const user = useUserInfo();
  const guestOrderAccount = useGuestOrderAccountStore(({ value }) => value);

  return (
    <>
      <div className="mt-6">
        <h2 className="text-3xl font-medium">Your order is complete 🎉</h2>
      </div>

      <div className="mt-4">
        <p className="text-xl text-gray-600">
          {t("You will receive an email confirmation shortly")}
        </p>
      </div>

      {!user ? (
        <div className="mt-16 max-w-xl w-full">
          <Island variant="solid">
            <h4 className="text-md font-medium">
              {t("Create an account to keep track of your orders!")}
            </h4>

            <div className="mt-10">
              <Signup
                initialValues={guestOrderAccount ?? undefined}
                hideLoginLink
              />
            </div>
          </Island>
        </div>
      ) : (
        <div>
          <div className="mt-14">
            <p className="text-md text-gray-500">
              {t.rich(
                "Keep track of your order in your Profile Page or Continue your shopping",
                {
                  ProfileLink: (chunk) => (
                    <Link href={ordersRoute}>{chunk}</Link>
                  ),
                  ContinueLink: (chunk) => (
                    <Link href={homeRoute}>{chunk}</Link>
                  ),
                }
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
