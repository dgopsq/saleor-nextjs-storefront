import { Navbar } from "@/components/navigation/Navbar";
import "./globals.css";
import { ApolloWrapper } from "@/misc/apolloWrapper";
import { Inter } from "next/font/google";
import { getApolloClient } from "@/misc/apollo";
import { GetCategoriesDocument } from "@/__generated__/graphql";
import { parsePopulatedCategories } from "@/queries/categories/data";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
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
          <Navbar categories={parsedCategories} />

          <main className="flex min-h-screen flex-col items-center justify-between mt-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32">
            {children}
          </main>
        </ApolloWrapper>
      </body>
    </html>
  );
}
