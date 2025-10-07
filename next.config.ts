import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["c8.alamy.com","atlas-content-cdn.pixelsquid.com", "img.freepik.com","thumbs.dreamstime.com"], // ✅ allow images from this domain
    formats: ["image/avif", "image/webp"], // ✅ faster formats
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
