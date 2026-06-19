import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Space_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/lib/SmoothScrollProvider";

// 見出し：Chakra Petch
const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

// 数値・ラベル：Space Mono
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

// 本文：Noto Sans JP
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hybrid Seal × WARP ｜ 捨てられない。だから毎日100回見られる。",
  description:
    "捨てられず、毎日見られ、データで伸び続ける物理メディア。Hybrid Seal（主役）に、動的LP＋データ分析のWARPが付帯する共同サービス。",
  openGraph: {
    title: "Hybrid Seal × WARP",
    description:
      "捨てられない。だから毎日100回見られる。物理からデジタルへワープする新しい広告媒体。",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#04050A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ja"
      className={`${chakraPetch.variable} ${spaceMono.variable} ${notoSansJP.variable}`}
    >
      <body className="bg-base text-[#e9edf5] antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
