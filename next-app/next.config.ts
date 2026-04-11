import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  turbopack: {
    root: path.join(__dirname)
  }
};

export default nextConfig;
