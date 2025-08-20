import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://res.cloudinary.com/**"),
      new URL("https://i.ibb.co/**"),
    ],
  },
};

export default nextConfig;
