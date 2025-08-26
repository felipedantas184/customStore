import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'agprata.vercel.app',
        pathname: '**'
      }
    ]
  },
};

export default nextConfig;
