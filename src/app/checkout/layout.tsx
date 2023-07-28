"use client";

import { useCheckoutInfo } from "@/misc/hooks/useCheckoutInfo";
import { LayoutProps } from "../../../.next/types/app/layout";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const checkout = useCheckoutInfo();

  // If the user has no items in the checkout
  // we redirect him to the cart page.
  useEffect(() => {
    const items = checkout.data?.lines ?? [];
    if (items.length <= 0) router.replace("/cart");
  }, [checkout, router]);

  return children;
}
