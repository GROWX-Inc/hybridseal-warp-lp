"use client";

import { useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * 機能②洗って何度でも：シールをドラッグで貼り剥がし。
 * - シール本体はドラッグで持ち上がり（角がめくれる）、離すと戻る
 * - 下地は常に見えている
 */
export default function DragPeel() {
  const [lift, setLift] = useState(0); // 0..1
  const dragging = useRef(false);
  const startY = useRef(0);
  const tracked = useRef(false);

  const onDown = (y: number) => {
    dragging.current = true;
    startY.current = y;
  };
  const onMove = (y: number) => {
    if (!dragging.current) return;
    const dy = startY.current - y; // 上に動かすほど剥がれる
    const next = Math.max(0, Math.min(1, dy / 90));
    setLift(next);
    if (next > 0.3 && !tracked.current) {
      tracked.current = true;
      trackEvent("interaction", { kind: "peel" });
    }
  };
  const onUp = () => {
    dragging.current = false;
    setLift(0); // 何度でも貼り直せる＝戻る
  };

  return (
    <div className="relative h-44 w-full select-none overflow-hidden rounded-xl border border-white/10 bg-[#0a0d16]">
      {/* 下地（貼られていた跡） */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/30">
          RE-STICKABLE
        </span>
      </div>

      {/* シール本体 */}
      <div
        className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-2xl border border-cyan/50 bg-gradient-to-br from-cyan/25 to-violet/25 shadow-cyan active:cursor-grabbing"
        style={{
          transform: `translate(-50%, calc(-50% - ${lift * 26}px)) rotateX(${
            lift * 38
          }deg)`,
          transformOrigin: "bottom center",
          transition: dragging.current ? "none" : "transform 0.35s ease",
        }}
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          onDown(e.clientY);
        }}
        onPointerMove={(e) => onMove(e.clientY)}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-1">
          <span className="font-mono text-[10px] tracking-wider text-cyan">
            SEAL
          </span>
          <span className="text-[10px] text-white/60">上にドラッグ</span>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-2 left-3">
        <span className="font-mono text-[10px] text-white/60">
          水洗いで粘着力が復活・半永久
        </span>
      </div>
    </div>
  );
}
