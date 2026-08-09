
export default function Experience() {
  return (
       <section id="experience" className="overflow-hidden bg-[#20261d] text-[#f3f0e7]">
               <div className="mx-auto grid max-w-[1400px] md:grid-cols-[1.05fr_.95fr]">
                 <div className="experience-image min-h-[600px] md:min-h-[820px]" />
                 <div className="flex flex-col justify-center px-5 py-24 md:px-16 lg:px-24">
                   <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">The experience</p>
                   <h2 className="mt-7 font-display text-[clamp(3.5rem,6vw,6.7rem)] leading-[0.86] tracking-[-0.055em]">
                     You don't come to
                     <br />
                     <em>document</em> life.
                   </h2>
                   <p className="mt-8 max-w-lg text-lg leading-8 text-white/60">
                     You come to experience it.
                   </p>
       
                   <div className="mt-12 grid gap-0 border-y border-white/12">
                     {[
                       ["Wake", "with the light."],
                       ["Eat", "what the place grows."],
                       ["Work", "with your hands."],
                       ["Walk", "until you stop checking the time."],
                       ["Talk", "to people who don't know your feed."],
                     ].map(([a, b], i) => (
                       <div key={a} className="flex items-center justify-between border-b border-white/10 py-5 last:border-0">
                         <span className="text-[10px] uppercase tracking-[0.25em] text-white/35">0{i + 1}</span>
                         <span className="w-24 text-sm">{a}</span>
                         <span className="flex-1 text-sm text-white/50">{b}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             </section>
  );
}