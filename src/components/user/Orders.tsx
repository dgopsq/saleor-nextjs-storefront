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
import { useMemo } from "react";

/**
 *
 */
export const Orders: React.FC = () => {
  const { data, loading } = useQuery(GetMyOrdersDocument, {
    variables: { first: 10 },
  });

  const parsedOrders = useMemo(() => {
    return (
      data?.me?.orders?.edges.map((o) => {
        const orderFragment = getFragmentData(GenericOrderFragmentDoc, o?.node);
        return parseOrder(orderFragment);
      }) ?? []
    );
  }, [data]);

  console.log(parsedOrders);

  const ordersRenderer = useMemo(() => {
    return parsedOrders.map((order) => (
      <li key={order.id}>
        <Island variant="outline">
          <SingleOrder order={order} />
        </Island>
      </li>
    ));
  }, [parsedOrders]);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <PageHeading>Orders</PageHeading>

      <ul className="mt-8">{ordersRenderer}</ul>
    </>
  );
};
