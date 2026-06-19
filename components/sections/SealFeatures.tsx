"use client";

import Reveal from "@/components/motion/Reveal";
import WipeCanvas from "@/components/interactive/WipeCanvas";
import DragPeel from "@/components/interactive/DragPeel";
import SterilizeParticles from "@/components/interactive/SterilizeParticles";

const features = [
  {
    no: "01",
    title: "マルチクリーナー",
    desc: "画面・レンズ・メガネを拭ける極細繊維。実用機能があるから、捨てずに持ち歩く。",
    demo: <WipeCanvas />,
  },
  {
    no: "02",
    title: "洗って何度でも",
    desc: "水洗いするだけで粘着力が復活。貼って剥がして、半永久的に使える。",
    demo: <DragPeel />,
  },
  {
    no: "03",
    title: "光触媒で自己除菌",
    desc: "光に当たることで菌を分解。触れる場所に貼っても、清潔がずっと続く。",
    demo: <SterilizeParticles />,
  },
];

export default function SealFeatures() {
  return (
    <section
      id="features"
      className="relative w-full overflow-hidden px-6 py-24 sm:py-32"
    >
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.4em] text-cyan/80">
            FUNCTIONS&nbsp;OF&nbsp;THE&nbsp;SEAL
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 max-w-3xl font-heading text-3xl font-bold leading-tight sm:text-5xl">
            実用機能があるから、
            <span className="text-glow-cyan">捨てない</span>。
            <br />
            だから、毎日<span className="text-gold">貼りたくなる</span>。
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.no} delay={0.1 * i} className="h-full">
              <div className="flex h-full flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm transition hover:border-cyan/40">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-gold">{f.no}</span>
                  <span className="h-[1px] flex-1 bg-gradient-to-r from-cyan/40 to-transparent" />
                </div>
                {f.demo}
                <div>
                  <h3 className="font-heading text-xl font-semibold text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    {f.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
