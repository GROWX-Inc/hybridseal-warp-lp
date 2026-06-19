"use client";

import { useEffect, useState } from "react";

export type DeviceTier = "high" | "low";

interface DeviceCapability {
  /** 3Dの重い表現を出してよいか（high）／簡易フォールバックにすべきか（low） */
  tier: DeviceTier;
  /** モーションを抑制すべきか（OS設定） */
  reducedMotion: boolean;
  /** 判定が完了したか（SSR/初回は false） */
  ready: boolean;
}

/**
 * 端末性能のざっくり判定。
 * - prefers-reduced-motion → low / reducedMotion
 * - 論理コア数・メモリが少ない → low
 * - WebGL非対応 → low
 *
 * 「モバイル最優先・低スペックはフォールバック」のための軽量ヒューリスティック。
 * SSRでは常に high を仮定せず、クライアントで確定するまで ready=false にして
 * 3D描画の判断を遅延させる（ただし表示コンテンツ自体は常に出す）。
 */
export function useDeviceTier(): DeviceCapability {
  const [state, setState] = useState<DeviceCapability>({
    tier: "low",
    reducedMotion: false,
    ready: false,
  });

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const cores =
      typeof navigator.hardwareConcurrency === "number"
        ? navigator.hardwareConcurrency
        : 4;
    // deviceMemory は一部ブラウザのみ
    const memory =
      typeof (navigator as Navigator & { deviceMemory?: number })
        .deviceMemory === "number"
        ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory!
        : 4;

    let webglOk = false;
    try {
      const canvas = document.createElement("canvas");
      webglOk = !!(
        canvas.getContext("webgl2") || canvas.getContext("webgl")
      );
    } catch {
      webglOk = false;
    }

    const lowSpec = cores <= 4 || memory <= 4;
    const tier: DeviceTier =
      reducedMotion || !webglOk || lowSpec ? "low" : "high";

    setState({ tier, reducedMotion, ready: true });
  }, []);

  return state;
}
