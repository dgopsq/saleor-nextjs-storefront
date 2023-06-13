import { Product } from "@/__generated__/graphql";
import Image from "next/image";
import React from "react";

type Props = {
  id: string;
  name: string;
  priceStartAmount: number;
  priceStartCurrency: string;
  imageSrc?: string;
  imageAlt?: string;
};

/**
 *
 */
export const SingleProduct: React.FC<Props> = ({
  id,
  name,
  imageSrc,
  imageAlt,
  priceStartAmount,
  priceStartCurrency,
}) => {
  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? ""}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
            width={200}
            height={200}
          />
        ) : undefined}
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <a href="#">
              <span aria-hidden="true" className="absolute inset-0" />
              {name}
            </a>
          </h3>
        </div>
        <p className="text-sm font-medium text-gray-900">
          From {priceStartAmount} {priceStartCurrency}
        </p>
      </div>
    </div>
  );
};
