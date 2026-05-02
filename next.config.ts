import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/packages/Solana',
        destination: 'https://www.npmjs.com/package/solana-deploy-sdk',
        permanent: true,
      },
      {
        source: '/packages/Solana/',
        destination: 'https://www.npmjs.com/package/solana-deploy-sdk',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
