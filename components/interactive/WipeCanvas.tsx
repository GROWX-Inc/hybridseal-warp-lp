"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * 機能①マルチクリーナー：指で拭くと曇りが晴れる。
 * - 下地（クリーンな面）は常に見えている＝ブラックアウトしない
 * - 上に半透明の「曇り」キャンバスを重ね、ポインタ操作で消す
 * - 操作しない/できない環境向けに「晴らす」ボタンも用意
 */
export default function WipeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [tracked, setTracked] = useState(false);

  const paintFog = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "source-over";
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "rgba(180, 200, 210, 0.82)");
    grad.addColorStop(1, "rgba(120, 150, 170, 0.82)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    paintFog(canvas);
  }, []);

  const erase = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = canvas.width / rect.width;
    const x = (clientX - rect.left) * dpr;
    const y = (clientY - rect.top) * dpr;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26 * dpr, 0, Math.PI * 2);
    ctx.fill();

    if (!tracked) {
      setTracked(true);
      trackEvent("interaction", { kind: "wipe" });
    }
  };

  const clearAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-white/10">
      {/* 下地（クリーンな面）。常に見える */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan/15 via-base to-violet/15">
        <span className="font-mono text-xs tracking-[0.3em] text-cyan">
          CLEAN
        </span>
      </div>

      {/* 曇りレイヤー */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full cursor-pointer touch-none"
        onPointerDown={(e) => {
          drawing.current = true;
          erase(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (drawing.current) erase(e.clientX, e.clientY);
        }}
        onPointerUp={() => (drawing.current = false)}
        onPointerLeave={() => (drawing.current = false)}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-2 flex items-center justify-between px-3">
        <span className="font-mono text-[10px] text-white/60">
          指でこすって拭く
        </span>
        <button
          type="button"
          onClick={clearAll}
          className="pointer-events-auto rounded-full border border-white/20 px-3 py-1 font-mono text-[10px] text-white/70 transition hover:border-cyan/60 hover:text-cyan"
        >
          晴らす
        </button>
      </div>
    </div>
  );
}
