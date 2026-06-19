import Hero from "@/components/sections/Hero";
import SealFeatures from "@/components/sections/SealFeatures";
import HundredTimes from "@/components/sections/HundredTimes";
import PeelToWarp from "@/components/sections/PeelToWarp";

export default function Home() {
  return (
    <main className="relative w-full">
      {/* ① HERO */}
      <Hero />
      {/* ③ シールの3つの機能 */}
      <SealFeatures />
      {/* ④ 1日100回（オウンドメディア） */}
      <HundredTimes />
      {/* ⑥ ＋付帯オプション：めくってQR → WARP */}
      <PeelToWarp />

      <footer className="border-t border-white/10 px-6 py-12 text-center">
        <p className="font-mono text-xs tracking-[0.3em] text-white/40">
          HYBRID SEAL &times; WARP
        </p>
        <p className="mt-3 text-xs text-white/30">
          捨てられず、毎日見られ、データで伸び続ける。これ以上の広告媒体が、ありますか。
        </p>
      </footer>
    </main>
  );
}
