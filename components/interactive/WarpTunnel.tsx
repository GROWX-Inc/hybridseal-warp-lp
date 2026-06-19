"use client";

import { useEffect, useRef } from "react";

/**
 * 宇宙トンネルのワープ遷移オーバーレイ。
 * QRを「かざした」後に再生。中心へ向かう光の筋が加速 → 体験世界の入口へ。
 * - canvas 2D で軽量に。reduced-motion では短いフェードのみ
 * - 一定時間で必ず onDone を呼び、永続的な黒画面を残さない
 */
export default function WarpTunnel({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 安全装置：何があっても 3秒で終了させる
    const safety = window.setTimeout(onDone, 3000);

    if (prefersReduced) {
      const t = window.setTimeout(onDone, 700);
      return () => {
        window.clearTimeout(t);
        window.clearTimeout(safety);
      };
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return () => window.clearTimeout(safety);
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return () => window.clearTimeout(safety);
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = (canvas.width = window.innerWidth * dpr);
    const h = (canvas.height = window.innerHeight * dpr);
    const cx = w / 2;
    const cy = h / 2;

    const stars = Array.from({ length: 260 }, () => ({
      a: Math.random() * Math.PI * 2,
      r: Math.random() * 20,
      speed: 2 + Math.random() * 6,
      hue: Math.random(),
    }));

    const colors = ["#3FE3FF", "#7CECFF", "#E8C56B", "#8B6CFF", "#ffffff"];
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const accel = 1 + t * 4;

      ctx.fillStyle = "rgba(4,5,10,0.35)";
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        const prevR = s.r;
        s.r += s.speed * accel;
        const x1 = cx + Math.cos(s.a) * prevR;
        const y1 = cy + Math.sin(s.a) * prevR;
        const x2 = cx + Math.cos(s.a) * s.r;
        const y2 = cy + Math.sin(s.a) * s.r;

        ctx.strokeStyle =
          colors[Math.floor(s.hue * colors.length)] ?? "#ffffff";
        ctx.lineWidth = Math.min(3 * dpr, (s.r / 200) * 4 * dpr + 0.5);
        ctx.globalAlpha = Math.min(1, s.r / 100);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        if (s.r > Math.max(w, h)) {
          s.a = Math.random() * Math.PI * 2;
          s.r = Math.random() * 10;
          s.speed = 2 + Math.random() * 6;
        }
      }
      ctx.globalAlpha = 1;

      if (t < 1.9) {
        raf = requestAnimationFrame(tick);
      } else {
        onDone();
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
    };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[60] bg-base">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="animate-pulse-glow font-mono text-sm tracking-[0.4em] text-cyan">
          WARPING&hellip;
        </span>
      </div>
    </div>
  );
}
