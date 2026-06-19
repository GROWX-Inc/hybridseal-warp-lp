"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  r: number;
}

/**
 * 機能③光触媒で自己除菌：除菌パーティクルが分解されて消える。
 * - canvas で軽量に描画。reduced-motion では静止表示にフォールバック
 * - 「光を当てる」ボタンで分解アニメ
 */
export default function SterilizeParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particles = useRef<P[]>([]);
  const [reduced, setReduced] = useState(false);

  const seed = (w: number, h: number) => {
    const arr: P[] = [];
    const n = 26;
    for (let i = 0; i < n; i++) {
      arr.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
        life: 1,
        max: 1,
        r: 3 + Math.random() * 4,
      });
    }
    particles.current = arr;
  };

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles.current) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      const alpha = Math.max(0, p.life);
      ctx.fillStyle = `rgba(139, 108, 255, ${alpha * 0.9})`;
      ctx.shadowColor = "rgba(63,227,255,0.8)";
      ctx.shadowBlur = 8;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setReduced(prefersReduced);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    seed(rect.width, rect.height);
    draw(ctx, rect.width, rect.height);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const sterilize = () => {
    trackEvent("interaction", { kind: "sterilize" });
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();

    if (reduced) {
      // モーション抑制時は即時クリア（消える結果だけ見せる）
      particles.current = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      window.setTimeout(() => {
        seed(rect.width, rect.height);
        draw(ctx, rect.width, rect.height);
      }, 600);
      return;
    }

    // 分解：散って消える
    for (const p of particles.current) {
      p.vx = (Math.random() - 0.5) * 2.4;
      p.vy = -1 - Math.random() * 1.6;
      p.max = 0.5 + Math.random() * 0.5;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      for (const p of particles.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life = Math.max(0, 1 - t / p.max);
        p.r *= 0.992;
      }
      draw(ctx, rect.width, rect.height);
      if (t < 1.4) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // 除菌完了 → 少し置いて再シード（リピート可能）
        window.setTimeout(() => {
          seed(rect.width, rect.height);
          draw(ctx, rect.width, rect.height);
        }, 700);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  return (
    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(63,227,255,0.12),transparent_70%)]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-x-0 bottom-2 flex items-center justify-between px-3">
        <span className="font-mono text-[10px] text-white/60">
          光触媒で菌を分解
        </span>
        <button
          type="button"
          onClick={sterilize}
          className="rounded-full border border-violet/50 px-3 py-1 font-mono text-[10px] text-violet transition hover:bg-violet/20"
        >
          光を当てる
        </button>
      </div>
    </div>
  );
}
