
export default function Device() {
  return (
    <section className="relative overflow-hidden bg-[#0d0f0c] px-5 py-28 text-[#f3f0e7] md:px-8 md:py-40">
        <div className="mx-auto grid max-w-[1400px] items-center gap-16 md:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">One rule</p>
            <h2 className="mt-7 max-w-4xl font-display text-[clamp(4rem,8.5vw,9rem)] leading-[0.78] tracking-[-0.07em]">
              Your phone
              <br />
              stays <em>with us.</em>
            </h2>
          </div>
          <div className="device-illustration mx-auto">
            <div className="phone">
              <div className="phone-screen">
                <div className="phone-time">7:14</div>
                <div className="phone-notification">No new notifications.</div>
              </div>
            </div>
            <div className="phone-shadow" />
          </div>
        </div>
        <p className="mx-auto mt-20 max-w-[1400px] text-center text-xs text-white/35">
          Voluntarily. Safely. Temporarily. The point isn't to punish technology — it's to create room for something else.
        </p>
      </section>   
  );
}