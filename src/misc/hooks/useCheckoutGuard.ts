import { useCheckoutInfo } from "@/misc/hooks/useCheckoutInfo";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type UseCheckoutGuardReturn = { showCheckout: boolean };

/**
 *
 */
export function useCheckoutGuard(): UseCheckoutGuardReturn {
  const checkout = useCheckoutInfo();
  const router = useRouter();

  useEffect(() => {
    if (checkout.data && checkout.data.lines.length <= 0)
      router.replace("/cart");
  }, [checkout, router]);

  return { showCheckout: !!checkout.data && checkout.data.lines.length > 0 };
}
