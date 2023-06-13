"use client";

import { GetProductsDocument } from "@/__generated__/graphql";
import { useQuery } from "@apollo/client";

export const Products: React.FC = () => {
  const { loading, error, data } = useQuery(GetProductsDocument, {
    variables: { first: 1 },
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  console.log(data);

  return <div>Products...</div>;
};
