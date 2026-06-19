"use client";

import { useState } from "react";
import Reveal from "@/components/motion/Reveal";
import WarpTunnel from "@/components/interactive/WarpTunnel";
import { trackEvent } from "@/lib/analytics";

type Stage = "sealed" | "qr" | "arrived";

/** 装飾用の擬似QRパターン（実QRは本番の発行URL確定後に差し替え） */
function FakeQR() {
  const cells = 9;
  const seed = [
    1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0,
    0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1,
    0, 1, 0, 1, 1, 1,
  ];
  return (
    <div
      className="grid h-32 w-32 gap-[2px] rounded-md bg-white p-2"
      style={{ gridTemplateColumns: `repeat(${cells}, 1fr)` }}
      aria-label="QRコード（サンプル）"
    >
      {Array.from({ length: cells * cells }).map((_, i) => (
        <div
          key={i}
          className={seed[i % seed.length] ? "bg-base" : "bg-transparent"}
        />
      ))}
    </div>
  );
}

export default function PeelToWarp() {
  const [stage, setStage] = useState<Stage>("sealed");
  const [warping, setWarping] = useState(false);

  const peel = () => {
    setStage("qr");
    trackEvent("interaction", { kind: "peel_to_qr" });
  };

  const scan = () => {
    setWarping(true);
    trackEvent("interaction", { kind: "warp_start" });
  };

  return (
    <section
      id="peel-to-warp"
      className="relative w-full overflow-hidden px-6 py-24 sm:py-32"
    >
      {/* 背景の宇宙感 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,108,255,0.12),transparent_70%)]" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
        <div>
          <Reveal>
            <p className="font-mono text-xs tracking-[0.4em] text-violet">
              + OPTION ｜ PHYSICAL &rarr; DIGITAL
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 font-heading text-3xl font-bold leading-tight sm:text-5xl">
              めくって、<span className="text-glow-cyan">QR</span>。
              <br />
              かざせば、<span className="text-glow-gold text-gold">ワープ</span>。
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/65">
              シールをめくると現れるQR。かざせば宇宙トンネルを抜けて、
              そのブランドの体験世界へ。物理メディアがそのまま、
              動的LPへの入口になる——これが付帯オプション
              <span className="text-violet">WARP</span>の目玉。
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <ol className="mt-8 space-y-3">
              {[
                ["STEP 1", "シールをめくる"],
                ["STEP 2", "QRが出現する"],
                ["STEP 3", "かざして体験世界へワープ"],
              ].map(([step, label], i) => (
                <li key={step} className="flex items-center gap-4">
                  <span
                    className={`font-mono text-xs ${
                      (stage === "qr" && i <= 1) ||
                      (stage === "arrived" && i <= 2) ||
                      (stage === "sealed" && i === 0)
                        ? "text-cyan"
                        : "text-white/40"
                    }`}
                  >
                    {step}
                  </span>
                  <span className="text-sm text-white/75">{label}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        {/* インタラクティブ：めくる → QR → ワープ */}
        <Reveal from="left" delay={0.15}>
          <div className="relative mx-auto flex h-80 w-full max-w-sm items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
            {/* 下地：QR（常に存在し、シールがめくれると見える） */}
            <div
              className={`absolute flex flex-col items-center gap-4 transition-opacity duration-500 ${
                stage === "sealed" ? "opacity-0" : "opacity-100"
              }`}
            >
              <FakeQR />
              {stage === "qr" && (
                <button
                  type="button"
                  onClick={scan}
                  className="rounded-full border border-cyan/60 bg-cyan/10 px-6 py-2 font-mono text-xs tracking-wider text-cyan shadow-cyan transition hover:bg-cyan/20"
                >
                  かざしてワープ
                </button>
              )}
              {stage === "arrived" && (
                <div className="text-center">
                  <p className="font-heading text-lg text-gold text-glow-gold">
                    体験世界へようこそ
                  </p>
                  <button
                    type="button"
                    onClick={() => setStage("sealed")}
                    className="mt-3 font-mono text-[10px] text-white/50 underline-offset-4 hover:underline"
                  >
                    もう一度めくる
                  </button>
                </div>
              )}
            </div>

            {/* シール（クリック/タップでめくれる） */}
            <button
              type="button"
              onClick={peel}
              aria-label="シールをめくる"
              className="absolute inset-4 cursor-pointer rounded-2xl border border-cyan/40 bg-gradient-to-br from-cyan/20 via-base to-violet/20 shadow-cyan transition-all duration-500"
              style={{
                transformOrigin: "top left",
                transform:
                  stage === "sealed"
                    ? "rotate(0deg)"
                    : "rotate(-12deg) translate(-30%, -30%) scale(0.6)",
                opacity: stage === "sealed" ? 1 : 0,
                pointerEvents: stage === "sealed" ? "auto" : "none",
              }}
            >
              <span className="flex h-full w-full flex-col items-center justify-center gap-2">
                <span className="font-mono text-xs tracking-[0.3em] text-cyan">
                  HYBRID SEAL
                </span>
                <span className="text-sm text-white/70">タップしてめくる</span>
              </span>
            </button>
          </div>
        </Reveal>
      </div>

      {warping && (
        <WarpTunnel
          onDone={() => {
            setWarping(false);
            setStage("arrived");
          }}
        />
      )}
    </section>
  );
}
