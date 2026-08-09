
export default function Idea() {
  return (
       <section id="why" className="bg-[#f1eee5] px-5  md:px-8 md:py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-45">The idea</p>
              <h2 className="mt-5 max-w-3xl font-display text-[clamp(3.5rem,7vw,7.5rem)] leading-[0.85] tracking-[-0.06em]">
                Put the screen
                <br />
                <em>down.</em>
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-6 opacity-55">
              Not forever. Just long enough to remember there is a world outside it.
            </p>
          </div>

          <div className="mosaic-grid">
            <div className="mosaic-card tall image-mountain">
              <div className="mosaic-label">01 / somewhere quiet</div>
            </div>
            <div className="mosaic-card image-table">
              <div className="mosaic-label">02 / eat slowly</div>
            </div>
            <div className="mosaic-card image-hands">
              <div className="mosaic-label">03 / use your hands</div>
            </div>
            <div className="mosaic-card wide image-village">
              <div className="mosaic-label">04 / live locally</div>
            </div>
          </div>
        </div>
      </section>
  );
}