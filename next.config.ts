import type { NextConfig } from "next";

/**
 * GitHub Pages（github.io）で配信するときは静的書き出し（static export）にする。
 * - CI（GitHub Actions）では GITHUB_PAGES=true を渡してこのモードでビルド
 * - ローカル開発（npm run dev）や Vercel では通常モードのまま影響しない
 *
 * Pages はサブパス（/hybridseal-warp-lp/）配下に出るため basePath / assetPrefix を付ける。
 */
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "hybridseal-warp-lp";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three / R3F はトランスパイル対象に含める（ESM周りの安定化）
  transpilePackages: ["three"],
  ...(isPages
    ? {
        output: "export",
        basePath: `/${repo}`,
        assetPrefix: `/${repo}/`,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
