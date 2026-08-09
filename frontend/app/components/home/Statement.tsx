
export default function Statement() {
  return (
      <section className="relative overflow-hidden bg-[#11140f] px-5 py-24 text-[#f3f0e7] md:px-8 md:py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-16 md:grid-cols-[.7fr_1.8fr]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">A small question</p>
              <div className="mt-8 flex items-center gap-3 text-sm text-white/50">
                <span className="pulse-ring" />
                Think about it.
              </div>
            </div>
            <h2 className="font-display text-[clamp(3.2rem,7vw,7.2rem)] leading-[0.86] tracking-[-0.055em]">
              How much of your life
              <br />
              is spent <em>looking at it?</em>
            </h2>
          </div>
        </div>
      </section>
  );
}