/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "orologiomalvagio.eu.saleor.cloud",
      },
    ],
  },
};

module.exports = nextConfig;
