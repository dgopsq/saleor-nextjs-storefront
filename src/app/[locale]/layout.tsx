import { FormBootstrap } from "@/components/core/Bootstrap";
import { NextIntlClientProvider, useLocale, useMessages } from "next-intl";
import { notFound } from "next/navigation";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // FIXME: At the moment we are providing all the translations
  // from client to server. Ideally we'd like to fix this sending
  // to the client only the translations that are needed.
  // For reference: https://next-intl-docs.vercel.app/docs/environments/server-client-components#option-4-providing-all-messages
  const locale = useLocale();
  const messages = useMessages();

  if (params.locale !== locale) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <FormBootstrap />
      {children}
    </NextIntlClientProvider>
  );
}
