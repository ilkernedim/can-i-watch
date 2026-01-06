/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
      serverActions: {
          allowedOrigins: ['localhost:3000', '192.168.1.32:3000', '*'] 
      }
  }
};

export default nextConfig;