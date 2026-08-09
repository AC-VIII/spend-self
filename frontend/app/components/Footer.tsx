
export default function Footer() {

  return (
      <footer className="bg-[#0d0f0c] px-5 py-8 text-[#f2efe7] md:px-8">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="font-display text-2xl tracking-[-0.055em]">
              spendself.
            </div>

            <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/25">
              Spend time on yourself.
            </div>
          </div>

          <div className="text-[10px] text-white/25">
            © 2026 SpendSelf
          </div>
        </div>
      </footer>
  );
}