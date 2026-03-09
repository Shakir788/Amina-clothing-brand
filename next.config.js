/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // 👈 Ye line Sanity ki images allow karegi
      },
       {
        protocol: 'https',
        hostname: 'images.unsplash.com', 
      },
    ],
  },
};

export default nextConfig;