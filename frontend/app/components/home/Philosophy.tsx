
export default function Philosophy() {
  return (
       <section className="bg-[#f1eee5] px-5 py-28 md:px-8 md:py-40">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-45">The philosophy</p>
          <div className="mt-9 max-w-6xl">
            <h2 className="font-display text-[clamp(3.5rem,8vw,9.2rem)] leading-[0.82] tracking-[-0.065em]">
              Leave the digital world.
              <br />
              <em>Come back to yourself.</em>
            </h2>
          </div>
          <div className="mt-20 grid gap-8 border-t border-black/12 pt-8 md:grid-cols-3">
            <p className="text-sm leading-6">Remote places where life moves differently.</p>
            <p className="text-sm leading-6">Local food, local people, real work, real landscapes.</p>
            <p className="text-sm leading-6">A temporary reset — not an escape from modern life forever.</p>
          </div>
        </div>
      </section>
  );
}