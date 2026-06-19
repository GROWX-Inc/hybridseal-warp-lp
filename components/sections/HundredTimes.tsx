"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/interactive/CountUp";

/**
 * ④ 1日100回（オウンドメディア）
 * 背景が朝→夜へ移ろい、数字が 0→100 にカウントアップ。
 *
 * 背景はデフォルトで可視のグラデを敷き、スクロールに応じて
 * 夜レイヤーの不透明度を上げる（scrub）。トリガー不発でも黒くならない。
 */
export default function HundredTimes() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const nightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const section = sectionRef.current;
    const night = nightRef.current;
    if (!section || !night) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        night,
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hundred-times"
      className="relative w-full overflow-hidden px-6 py-28 sm:py-40"
    >
      {/* 朝の層（デフォルト可視） */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#0a1430_0%,#1a1330_45%,#04050A_100%)]" />
      {/* 夜の層（scrubで濃くなる）。デフォルトでも薄く見える */}
      <div
        ref={nightRef}
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#04050A_0%,#070a18_55%,#04050A_100%)] opacity-30"
      />
      {/* 朝日/星の差し色 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(232,197,107,0.18),transparent_55%)]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.4em] text-gold/90">
            OWNED MEDIA ｜ 広告費ゼロ
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mt-6 font-heading text-2xl font-medium leading-snug text-white/90 sm:text-3xl">
            手元に置かれたシールは、1日に
          </h2>
        </Reveal>

        <div className="my-6 flex items-end justify-center gap-3">
          <CountUp
            to={100}
            duration={2}
            className="font-mono text-7xl font-bold leading-none text-glow-gold text-gold sm:text-9xl"
          />
          <span className="mb-2 font-heading text-2xl text-white/80 sm:text-4xl">
            回
          </span>
        </div>

        <Reveal delay={0.2}>
          <h3 className="font-heading text-2xl font-medium leading-snug text-white/90 sm:text-3xl">
            見られる。
          </h3>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-white/65">
            朝、メガネを拭くとき。昼、スマホを清めるとき。夜、もう一度。
            <br className="hidden sm:block" />
            広告費をかけずに、ブランドが毎日“視界”に入り続ける。
            これが捨てられない物理メディアの最大価値。
          </p>
        </Reveal>

        {/* 朝→夜のタイムライン目盛り */}
        <Reveal delay={0.4}>
          <div className="mx-auto mt-12 flex max-w-md items-center justify-between font-mono text-[10px] tracking-widest text-white/40">
            <span>06:00 朝</span>
            <span className="mx-3 h-[1px] flex-1 bg-gradient-to-r from-gold/50 via-cyan/40 to-violet/50" />
            <span>22:00 夜</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
