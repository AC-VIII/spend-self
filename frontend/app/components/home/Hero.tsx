
import {
  ArrowDown,
} from "lucide-react";

export default function Hero() {
  return (
      <section className="relative min-h-[100svh] overflow-hidden bg-[#10130f] text-[#f5f2e9]">
        <div className="absolute inset-0">
          <video
            className="hero-video absolute inset-0"
            src="/videos/himalayan-hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,5,.28)_0%,rgba(5,7,5,.08)_34%,rgba(5,7,5,.72)_100%)]" />
          <div className="film-grain absolute inset-0" />
        </div>

        <div className="absolute left-5 top-28 z-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/50 md:left-8">
          <span className="signal-dot" /> A different kind of travel
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-5 pb-8 pt-40 md:px-8 md:pb-10">
          <div className="hero-kicker mb-7 text-xs uppercase tracking-[0.28em] text-white/55">
            Disconnect to reconnect
          </div>

          <h1 className="max-w-6xl font-display text-[clamp(4.2rem,11.2vw,10.5rem)] leading-[0.79] tracking-[-0.065em]">
            When was the
            <br />
            last time you
            <br />
            <em>disappeared?</em>
          </h1>

          <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-[470px] text-[15px] leading-7 text-white/72 md:text-lg">
              A few days somewhere remote. Your phone stays behind.
              The rest of the world can wait.
            </p>
            <a href="#why" className="group flex items-center gap-3 text-[11px] uppercase tracking-[0.24em]">
              See what we mean
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 transition duration-300 group-hover:bg-white group-hover:text-black">
                <ArrowDown size={15} />
              </span>
            </a>
          </div>
        </div>
      </section>
  );
}