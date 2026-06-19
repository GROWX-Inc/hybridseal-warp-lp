"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StarfieldProps {
  count?: number;
}

/**
 * 奥から手前へ流れる星。スクロール速度に応じて加速し「ワープ」感を出す。
 * R3F の useFrame で z を進め、カメラを通り過ぎたら奥へ再配置する。
 */
export default function Starfield({ count = 1800 }: StarfieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const lastScroll = useRef(0);
  const speed = useRef(0);

  // 星の初期位置と色
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#7CECFF"),
      new THREE.Color("#3FE3FF"),
      new THREE.Color("#E8C56B"),
      new THREE.Color("#8B6CFF"),
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 60; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60; // y
      positions[i * 3 + 2] = Math.random() * -120; // z (奥)

      const c =
        palette[Math.floor(Math.random() * palette.length)] ?? palette[0];
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    // スクロール速度を取得して加速量を算出
    const currentScroll =
      typeof window !== "undefined" ? window.scrollY : 0;
    const scrollDelta = Math.abs(currentScroll - lastScroll.current);
    lastScroll.current = currentScroll;

    // ベース速度 + スクロール加速（上限あり）。緩やかに減衰。
    const boost = Math.min(scrollDelta * 0.6, 80);
    speed.current += (boost - speed.current) * 0.08;
    const baseSpeed = 6;
    const totalSpeed = (baseSpeed + speed.current) * delta;

    const geom = points.geometry;
    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const zi = i * 3 + 2;
      arr[zi] += totalSpeed;
      // カメラ(z=0付近)を通り過ぎたら奥へ戻す
      if (arr[zi] > 8) {
        arr[zi] = -120;
        arr[i * 3 + 0] = (Math.random() - 0.5) * 60;
        arr[i * 3 + 1] = (Math.random() - 0.5) * 60;
      }
    }
    posAttr.needsUpdate = true;

    // ゆっくり回転して立体感
    points.rotation.z += delta * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.35}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
