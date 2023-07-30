/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "orologiomalvagio.eu.saleor.cloud",
      },
      {
        protocol: "https",
        hostname: "tailwindui.com",
      },
    ],
  },
  experimental: {
    serverActions: true,
    typedRoutes: false,
  },
};

module.exports = nextConfig;
