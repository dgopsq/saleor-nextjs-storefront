"use client";

import { getFragmentData } from "@/__generated__";
import {
  GenericOrderFragmentDoc,
  GetMyOrdersDocument,
} from "@/__generated__/graphql";
import { PageHeading } from "@/components/core/Headings";
import { Island } from "@/components/core/Island";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";
import { SingleOrder } from "@/components/core/SingleOrder";
import { parseOrder } from "@/queries/checkout/data";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useMemo } from "react";

/**
 *
 */
export const Orders: React.FC = () => {
  const { data, loading } = useQuery(GetMyOrdersDocument, {
    variables: { first: 10 },
  });

  const parserOrders = useMemo(() => {
    return (
      data?.me?.orders?.edges.map((o) => {
        const orderFragment = getFragmentData(GenericOrderFragmentDoc, o?.node);
        return parseOrder(orderFragment);
      }) ?? []
    );
  }, [data]);

  const ordersRenderer = useMemo(() => {
    return parserOrders.map((order) => (
      <li key={order.id}>
        <Link href="/account/orders/[id]" as={`/account/orders/${order.id}`}>
          <Island variant="outline">
            <SingleOrder order={order} />
          </Island>
        </Link>
      </li>
    ));
  }, [parserOrders]);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <PageHeading>Orders</PageHeading>

      <ul className="mt-8">{ordersRenderer}</ul>
    </>
  );
};
