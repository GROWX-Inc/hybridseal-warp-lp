"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import Reveal from "@/components/motion/Reveal";
import { trackEvent } from "@/lib/analytics";

// 3DはクライアントのみでロードしSSRの負荷とちらつきを避ける
const StarfieldCanvas = dynamic(
  () => import("@/components/three/StarfieldCanvas"),
  {
    ssr: false,
    // 読み込み中も黒画面にしない：CSS星空を出しておく
    loading: () => (
      <div className="starfield-fallback absolute inset-0 h-full w-full" />
    ),
  }
);

export default function Hero() {
  useEffect(() => {
    trackEvent("page_view", { section: "hero" });
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden"
    >
      {/* 背景：3D星（フォールバックはCSS星空）。常に何かが描画される */}
      <StarfieldCanvas />

      {/* 上からの光のビーム */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[70vh] w-[60vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(63,227,255,0.22),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[55vh] w-[2px] -translate-x-1/2 bg-gradient-to-b from-cyan/80 via-cyan/20 to-transparent blur-[1px]"
      />

      {/* 下部グラデで次セクションへ繋ぐ（黒落ちを自然に） */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-base"
      />

      {/* 中身（常時表示。Revealは上乗せ演出のみ） */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <Reveal from="down" delay={0.05}>
          <p className="font-mono text-xs tracking-[0.5em] text-cyan/80 sm:text-sm">
            HYBRID&nbsp;SEAL&nbsp;&times;&nbsp;WARP
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.25] sm:text-6xl md:text-7xl">
            <span className="text-glow-cyan">捨てられない。</span>
            <br />
            <span className="text-white">だから毎日</span>
            <span className="text-glow-gold text-gold">100回</span>
            <span className="text-white">見られる。</span>
          </h1>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
            捨てられず、毎日見られ、データで伸び続ける。
            <br className="hidden sm:block" />
            実用機能で“貼りたくなる”物理メディア
            <span className="text-cyan">Hybrid Seal</span>
            に、動的LP＋データ分析の
            <span className="text-gold">WARP</span>
            が付帯する共同サービス。
          </p>
        </Reveal>

        <Reveal from="up" delay={0.45}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <a
              href="#peel-to-warp"
              className="group relative inline-flex items-center justify-center rounded-full border border-cyan/60 bg-cyan/10 px-8 py-3 font-mono text-sm tracking-wider text-cyan shadow-cyan transition hover:bg-cyan/20"
            >
              めくって体験する
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-3 font-mono text-sm tracking-wider text-white/80 transition hover:border-white/40"
            >
              3つの機能を見る
            </a>
          </div>
        </Reveal>
      </div>

      {/* スクロールキュー */}
      <div
        aria-hidden
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-pulse-glow"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.3em] text-white/50">
            SCROLL
          </span>
          <span className="h-8 w-[1px] bg-gradient-to-b from-cyan/80 to-transparent" />
        </div>
      </div>
    </section>
  );
}
