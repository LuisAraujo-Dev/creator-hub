/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "github.com", 
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", 
      }
    ],
  },
  transpilePackages: ["@uploadthing/react", "uploadthing"],
  
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;