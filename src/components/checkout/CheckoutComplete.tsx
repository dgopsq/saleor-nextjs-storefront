"use client";

import { Island } from "@/components/core/Island";
import { Link } from "@/components/core/Link";
import { Signup } from "@/components/user/Signup";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { useGuestOrderAccountStore } from "@/misc/states/guestOrderAccount";

/**
 *
 */
export const CheckoutComplete: React.FC = () => {
  const user = useUserInfo();
  const guestOrderAccount = useGuestOrderAccountStore(({ value }) => value);

  console.log("CheckoutComplete", { user, guestOrderAccount });

  return (
    <>
      <div className="mt-6">
        <h2 className="text-3xl font-medium">Your order is complete 🎉</h2>
      </div>

      <div className="mt-4">
        <p className="text-xl text-gray-600">
          You will receive an email confirmation shortly.
        </p>
      </div>

      {!user ? (
        <div className="mt-16 max-w-xl w-full">
          <Island variant="solid">
            <h4 className="text-md font-medium">
              Create an account to keep track of your orders!
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
              Keep track of your order in your{" "}
              <Link href="/account/orders">Profile Page</Link> or{" "}
              <Link href="/">Continue your shopping</Link>.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
