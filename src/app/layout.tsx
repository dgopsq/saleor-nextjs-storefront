import "./globals.css";
import { Navbar } from "@/components/navigation/Navbar";
import { ApolloWrapper } from "@/misc/apollo/apolloWrapper";
import { Inter } from "next/font/google";
import { GetCategoriesDocument } from "@/__generated__/graphql";
import { parsePopulatedCategories } from "@/queries/categories/data";
import { Notifications } from "@/components/core/Notifications";
import { getApolloClient } from "@/misc/apollo/apollo";
import { Bootstrap } from "@/components/core/Bootstrap";
import { commonMetadata } from "@/misc/metadata";

const inter = Inter({ subsets: ["latin"] });

export const metadata = commonMetadata;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const apolloClient = getApolloClient();

  const { data } = await apolloClient.query({
    query: GetCategoriesDocument,
    variables: { first: 10 },
  });

  const parsedCategories = parsePopulatedCategories(
    data.categories?.edges ?? []
  );

  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          <Bootstrap />

          <Navbar categories={parsedCategories} />

          <main className="flex flex-col items-center justify-between mt-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32">
            {children}
          </main>

          <Notifications />
        </ApolloWrapper>
      </body>
    </html>
  );
}
