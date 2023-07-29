"use client";

import {
  GenericOrderFragmentDoc,
  GetMyOrdersDocument,
} from "@/__generated__/graphql";
import { CartProducts } from "@/components/checkout/CartProducts";
import { PageHeading, SectionHeading } from "@/components/core/Headings";
import { Island } from "@/components/core/Island";
import { KeyValue } from "@/components/core/KeyValue";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";
import { SingleAddress } from "@/components/core/SingleAddress";
import { publicConfig } from "@/misc/config";
import { formatDateFull } from "@/misc/date";
import { parseOrder } from "@/queries/checkout/data";
import { useQuery } from "@apollo/client";
import { useFragment } from "@apollo/experimental-nextjs-app-support/ssr";
import { useMemo } from "react";

type Props = {
  number: string;
};

/**
 *
 */
export const OrderDetails: React.FC<Props> = ({ number }) => {
  const { data, complete } = useFragment({
    fragment: GenericOrderFragmentDoc,
    fragmentName: "GenericOrder",
    from: { __typename: "Order", number },
  });

  useQuery(GetMyOrdersDocument, {
    variables: { first: publicConfig.lastOrdersShowed },
    skip: complete,
  });

  const parsedOrder = useMemo(() => {
    if (!complete) return null;
    return parseOrder(data);
  }, [data, complete]);

  if (!parsedOrder) return <LoadingSpinner />;

  return (
    <>
      <PageHeading>{`Order ${parsedOrder.number}`}</PageHeading>

      <div className="mt-8">
        <Island variant="outline">
          <ul className="flex flex-col gap-1">
            <li>
              <KeyValue label="Status" value={parsedOrder.statusDisplay} />
            </li>

            <li>
              <KeyValue
                label="Created at"
                value={formatDateFull(new Date(parsedOrder.createdAt))}
              />
            </li>
          </ul>
        </Island>
      </div>

      <div className="mt-4">
        <Island variant="outline">
          <div className="grid grid-cols-2">
            {parsedOrder?.shippingAddress ? (
              <div>
                <SectionHeading>Shipping address</SectionHeading>

                <div className="mt-4">
                  <SingleAddress
                    address={parsedOrder.shippingAddress}
                    multiline
                  />
                </div>
              </div>
            ) : undefined}

            {parsedOrder?.billingAddress ? (
              <div>
                <SectionHeading>Billing address</SectionHeading>

                <div className="mt-4">
                  <SingleAddress
                    address={parsedOrder.billingAddress}
                    multiline
                  />
                </div>
              </div>
            ) : undefined}
          </div>
        </Island>
      </div>

      <div className="mt-4">
        <Island variant="outline">
          <CartProducts products={parsedOrder.lines} compact />
        </Island>
      </div>
    </>
  );
};
