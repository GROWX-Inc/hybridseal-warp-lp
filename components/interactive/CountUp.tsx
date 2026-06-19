"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
  suffix?: string;
}

/**
 * 数字のカウントアップ。
 * ブラックアウト防止と同じ思想で「最終値」を初期表示しておく。
 * → JSが動かなくても意味のある数字(to)が見える。
 *   モーション可能時だけ from から数え上げる。
 */
export default function CountUp({
  to,
  from = 0,
  duration = 1.8,
  className = "",
  suffix = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return; // 最終値のまま表示

    gsap.registerPlugin(ScrollTrigger);

    const obj = { v: from };
    el.textContent = `${Math.round(from)}${suffix}`;

    // 安全装置：必ず最終値に戻す
    const safety = window.setTimeout(() => {
      el.textContent = `${to}${suffix}`;
    }, (duration + 2) * 1000);

    const tween = gsap.to(obj, {
      v: to,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = `${Math.round(obj.v)}${suffix}`;
      },
      onComplete: () => window.clearTimeout(safety),
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    });

    return () => {
      window.clearTimeout(safety);
      tween.scrollTrigger?.kill();
      tween.kill();
      el.textContent = `${to}${suffix}`;
    };
  }, [to, from, duration, suffix]);

  return (
    <span ref={ref} className={className}>
      {to}
      {suffix}
    </span>
  );
}
