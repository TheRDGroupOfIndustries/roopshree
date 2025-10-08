import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "c8.alamy.com",
      "atlas-content-cdn.pixelsquid.com",
      "img.freepik.com",
      "thumbs.dreamstime.com",
      "images.unsplash.com",
      "plus.unsplash.com"
    ],
    formats: ["image/avif", "image/webp"], 
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;