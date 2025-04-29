/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
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
