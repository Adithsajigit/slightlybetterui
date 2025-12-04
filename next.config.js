/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable server actions
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Environment variables that should be available on the client side
  env: {
    NEXT_PUBLIC_APP_NAME: 'Kerala Fresh Fish',
  },
};

module.exports = nextConfig;
