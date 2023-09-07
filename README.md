
[Saleor](https://saleor.io/) storefront built using [Next.js](https://nextjs.org/) 13 and the new **App Router**.

## Features

- 🕺 Fully functional Saleor storefront using the new Next 13 app router
- 💅 Styled using [Tailwind](https://tailwindcss.com/) and [Tailwind UI](https://tailwindui.com/)
- 🛒 Multi steps checkout with Stripe (using the [Saleor Stripe App](https://docs.saleor.io/docs/3.x/developer/app-store/apps/stripe))
- 📚 Out of the box i18n with [next-intl](https://next-intl-docs.vercel.app/)
- 💁‍♀️ User profile page handling the latest orders, all the personal addresses and the security informations
- 🏛️ Fully developed using Apollo with the new [`useFragment`](https://www.apollographql.com/docs/react/api/react/hooks/#usefragment) hook in order to react to data changes

## Getting Started

**Requirements:**
- An instance of the _Saleor_ backend up and running in order to successfully run this project (the easiest way is probably to use [Saleor Cloud](https://cloud.saleor.io/) and its free tier)
- The [Saleor Stripe App](https://docs.saleor.io/docs/3.x/developer/app-store/apps/stripe) installed in the dashboard

**Follow these steps in order to execute the project correctly:**

1. Rename the `.env.local.example` into `.env.local` and fill the `NEXT_PUBLIC_GRAPHQL_URL` environment variable with the correct URL to your GraphQL API;

2. Start the project in development mode using `pnpm dev`;
3. Open [http://localhost:3000](http://localhost:3000) with your browser;
4. 🎉

## Configuration

You can configure your storefront using the environment variables in [`src/misc/config.ts`](https://github.com/dgopsq/saleor-nextjs-base/blob/main/src/misc/config.ts). The only required configuration is `NEXT_PUBLIC_GRAPHQL_URL`, everything else is optional and has been documented directly in the file.

