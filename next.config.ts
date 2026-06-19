import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three / R3F はトランスパイル対象に含める（ESM周りの安定化）
  transpilePackages: ["three"],
};

export default nextConfig;
