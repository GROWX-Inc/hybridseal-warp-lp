"use client";

import { Canvas } from "@react-three/fiber";
import Starfield from "./Starfield";
import { useDeviceTier } from "@/lib/useDeviceTier";

/**
 * 星空3Dのラッパー。
 * - 低スペック / reduced-motion / WebGL非対応 → CSSのみの簡易星空にフォールバック
 * - それ以外 → R3F Canvas（dpr上限を絞って軽量化）
 *
 * いずれの場合も「黒一色」にはならず、必ず星空/グラデが表示される。
 */
export default function StarfieldCanvas() {
  const { tier, ready } = useDeviceTier();

  // 判定確定前、および低スペックは CSS フォールバック
  if (!ready || tier === "low") {
    return (
      <div
        className="starfield-fallback absolute inset-0 h-full w-full"
        aria-hidden
      />
    );
  }

  return (
    <div className="absolute inset-0 h-full w-full" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 70 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        // WebGLが落ちても背景CSSが残るように透過
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#04050A", 20, 110]} />
        <Starfield count={1800} />
      </Canvas>
    </div>
  );
}
