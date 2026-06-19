"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis（慣性スクロール）と GSAP ScrollTrigger を1箇所で接続する。
 *
 * 重要：このProviderは「スクロール演出」を担うが、コンテンツの表示自体は
 * 一切ここに依存させない。Lenis/GSAPが初期化できなくても、ページは
 * 通常のネイティブスクロールで全コンテンツが見える状態を維持する。
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // reduced-motion の場合は慣性スクロールを使わない（ネイティブのまま）
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // Lenis のスクロールを ScrollTrigger に同期
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // 画像/フォント読み込み後にレイアウトが変わるケースに備えて再計算
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 600);

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(refreshTimer);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
