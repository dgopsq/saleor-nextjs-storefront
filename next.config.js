/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "saleor-next-storefront-dgopsq.eu.saleor.cloud",
      },
    ],
  },
  experimental: {
    serverActions: true,
    typedRoutes: false,
  },
};

const withNextIntl = require("next-intl/plugin")("./src/misc/i18n.ts");

module.exports = withNextIntl(nextConfig);
