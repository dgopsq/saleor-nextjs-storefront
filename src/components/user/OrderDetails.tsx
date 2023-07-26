"use client";

import {
  GenericOrderFragmentDoc,
  GetMyOrdersDocument,
} from "@/__generated__/graphql";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";
import { SingleOrder } from "@/components/core/SingleOrder";
import { publicConfig } from "@/misc/config";
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
    console.log("data", data);
    return parseOrder(data);
  }, [data, complete]);

  if (!parsedOrder) return <LoadingSpinner />;

  return <SingleOrder order={parsedOrder} />;
};
