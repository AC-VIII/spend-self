
export default function Future() {
  return (
      <section className="relative overflow-hidden bg-[#c9d4bf] px-5 py-28 md:px-8 md:py-40">
        <div className="future-image absolute inset-0 opacity-25" />
        <div className="relative mx-auto max-w-[1400px]">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-50">Where we're starting</p>
          <h2 className="mt-8 max-w-6xl font-display text-[clamp(4rem,9vw,10rem)] leading-[0.78] tracking-[-0.07em]">
            Somewhere
            <br />
            <em>worth disappearing to.</em>
          </h2>
          <div className="mt-12 flex flex-col gap-5 text-sm md:flex-row md:items-center">
            <span className="rounded-full border border-black/15 px-5 py-3">The Himalayas · First experience</span>
            <span className="opacity-50">More places to follow.</span>
          </div>
        </div>
      </section>
  );
}