import { CartProducts } from "@/components/checkout/CartProducts";
import { CartSummary } from "@/components/checkout/CartSummary";
import { Button, TextButton } from "@/components/core/Button";
import { SectionHeading } from "@/components/core/Headings";
import { Island } from "@/components/core/Island";
import { Checkout } from "@/queries/checkout/data";

type Props = {
  checkout: Checkout;
  ctaText?: string;
  onCtaClick?: () => void;
  onCartEditClick?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
};

/**
 *
 */
export const CheckoutSummary: React.FC<Props> = ({
  checkout,
  isLoading,
  isDisabled,
  ctaText,
  onCtaClick,
  onCartEditClick,
}) => {
  return (
    <Island variant="solid">
      <div className="flex flex-row items-center">
        <SectionHeading>Order summary</SectionHeading>

        <div className="ml-4">
          <TextButton variant="primary" text="Edit" onClick={onCartEditClick} />
        </div>
      </div>

      <div className="mt-8">
        <CartProducts products={checkout.lines} compact />
      </div>

      <div className="mt-8">
        <CartSummary checkout={checkout} />
      </div>

      {ctaText ? (
        <div className="mt-8">
          <Button
            type="button"
            variant="primary"
            size="large"
            text={ctaText}
            isLoading={isLoading}
            isDisabled={isDisabled}
            onClick={onCtaClick}
          />
        </div>
      ) : undefined}
    </Island>
  );
};
