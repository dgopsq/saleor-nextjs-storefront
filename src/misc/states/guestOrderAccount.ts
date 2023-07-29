import { SignupForm } from "@/components/core/SignupForm";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type GuestOrderAccountStoreValue = Partial<SignupForm> | null;

type GuestOrderAccountStore = {
  value: GuestOrderAccountStoreValue;
  setValue: (newValue: GuestOrderAccountStoreValue) => void;
};

/**
 *
 */
export const useGuestOrderAccountStore = create<GuestOrderAccountStore>()(
  persist(
    (set) => ({
      /**
       *
       */
      value: null,

      /**
       *
       */
      setValue: (newValue) => {
        set({
          value: newValue,
        });
      },
    }),
    {
      name: "guestOrderAccount",
    }
  )
);
