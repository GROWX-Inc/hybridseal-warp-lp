"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: React.ReactNode;
  /** 出現方向 */
  from?: Direction;
  /** 開始ディレイ（秒） */
  delay?: number;
  /** 移動量(px) */
  distance?: number;
  className?: string;
}

const offset: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * スクロール出現アニメ。ただし表示は決してトリガーに依存させない。
 *
 * 設計：
 * 1. デフォルト(.reveal)は opacity:1。CSSだけで常に見える。
 * 2. JSが動き、reduced-motionでない時だけ「一時的に」隠して(.reveal-armed)、
 *    GSAPが viewport到達時 or 既に画面内なら即座に表示へ戻す。
 * 3. 何が起きても、安全タイマーで必ず opacity:1 / transform:none に復帰させる。
 *    → トリガー不発でもブラックアウトしない。
 */
export default function Reveal({
  children,
  from = "up",
  delay = 0,
  distance = 28,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return; // 常時表示のまま

    gsap.registerPlugin(ScrollTrigger);

    const dir = offset[from];

    // 安全装置：万一トリガーが発火しなくても確実に見えるようにする
    const safety = window.setTimeout(() => {
      gsap.set(el, { opacity: 1, x: 0, y: 0, clearProps: "transform,opacity" });
    }, 2500);

    const ctx = gsap.context(() => {
      el.classList.add("reveal-armed");
      gsap.set(el, {
        opacity: 0,
        x: dir.x * distance,
        y: dir.y * distance,
      });

      gsap.to(el, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.9,
        delay,
        ease: "power3.out",
        onComplete: () => {
          window.clearTimeout(safety);
          // transformを消してレイアウトに副作用を残さない
          gsap.set(el, { clearProps: "transform" });
        },
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      });
    }, el);

    return () => {
      window.clearTimeout(safety);
      ctx.revert();
      // revert後も最終表示を担保
      gsap.set(el, { opacity: 1, x: 0, y: 0, clearProps: "transform" });
    };
  }, [from, delay, distance]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
