import { Navbar } from "@/components/navigation/Navbar";
import "./globals.css";
import { ApolloWrapper } from "@/misc/apolloWrapper";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          <Navbar />

          <main className="flex min-h-screen flex-col items-center justify-between mt-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32">
            {children}
          </main>
        </ApolloWrapper>
      </body>
    </html>
  );
}
