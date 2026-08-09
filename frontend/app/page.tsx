"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Lock,
  Menu,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import Navbar from "./components/Navbar";

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);
  const [outgoingVideo, setOutgoingVideo] = useState<number | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const transitionStarted = useRef(false);

  const journeyVideos = [
    {
      src: "/videos/01-manang-horses.mp4",
      label: "01 / somewhere quiet",
      title: "Wake up where the mountains begin."
    },
    {
      src: "/videos/02-wood-chopping.mp4",
      label: "02 / use your hands",
      title: "Spend a morning doing something real."
    },
    {
      src: "/videos/03-himalayan-valley.mp4",
      label: "03 / go somewhere wild",
      title: "Leave enough room to feel small again."
    }
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const current = videoRefs.current[activeVideo];
    if (!current) return;
    current.muted = muted;
    current.play().catch(() => {});
  }, [activeVideo, muted]);

  function beginVideoTransition(index: number) {
    if (index >= journeyVideos.length || transitionStarted.current) return;

    transitionStarted.current = true;
    setOutgoingVideo(activeVideo);
    setActiveVideo(index);

    window.setTimeout(() => {
      const outgoing = videoRefs.current[activeVideo];
      if (outgoing) {
        outgoing.pause();
        outgoing.currentTime = 0;
      }
      setOutgoingVideo(null);
      transitionStarted.current = false;
    }, 1900);
  }

  useEffect(() => {
    const first = videoRefs.current[0];
    if (first) {
      first.muted = true;
      first.play().catch(() => {});
    }
  }, []);

async function submit(e: FormEvent) {
  e.preventDefault();

  if (!email.trim()) return;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to subscribe");
    }

    setJoined(true);
  } catch (error) {
    console.error("Newsletter subscription failed:", error);
  }
}

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f1eee5] text-[#171914]">
      {/* NAV */}
      <Navbar />

      {/* HERO — deliberately cinematic */}
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

      {/* INTERRUPT / STATEMENT */}
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

      {/* VISUAL MOSAIC */}
      <section id="why" className="bg-[#f1eee5] px-5 py-20 md:px-8 md:py-32">
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

      {/* CINEMATIC JOURNEY */}
      <section id="journey" className="relative bg-[#10130f] text-[#f3f0e7]">
        <div className="cinematic-scroll">
          <div className="cinematic-sticky">
            <div className="cinematic-stage">
              {journeyVideos.map((video, index) => (
                <video
                  key={video.src}
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  className={`cinematic-video ${activeVideo === index ? "is-active" : ""} ${outgoingVideo === index ? "is-outgoing" : ""}`}
                  src={video.src}
                  autoPlay={index === 0}
                  muted={muted}
                  playsInline
                  preload={index === 0 ? "auto" : "metadata"}
                  onTimeUpdate={(e) => {
                    if (index === activeVideo && index < journeyVideos.length - 1) {
                      const remaining = e.currentTarget.duration - e.currentTarget.currentTime;
                      if (remaining <= 1.8) beginVideoTransition(index + 1);
                    }
                  }}
                  onEnded={() => {
                    if (index < journeyVideos.length - 1) beginVideoTransition(index + 1);
                  }}
                  aria-hidden={activeVideo !== index}
                />
              ))}

              <div className="cinematic-vignette" />
              <div className="cinematic-grain" />

              <div className="absolute inset-x-5 top-8 z-10 flex items-center justify-between md:inset-x-8 md:top-10">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                    Imagine this
                  </p>
                  <p className="mt-3 text-xs text-white/45">
                    A morning with nothing to check.
                  </p>
                </div>

                <button
                  onClick={() => setMuted(!muted)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/15 backdrop-blur-md transition hover:bg-white hover:text-black"
                  aria-label={muted ? "Turn video sound on" : "Mute video sound"}
                >
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>

              <div className="absolute inset-x-5 bottom-8 z-10 md:inset-x-8 md:bottom-10">
                <div className="flex items-end justify-between gap-8">
                  <div className="max-w-2xl">
                    <p className="text-[9px] uppercase tracking-[0.28em] text-white/55">
                      {journeyVideos[activeVideo].label}
                    </p>
                    <h2 className="mt-3 font-display text-[clamp(2.6rem,5vw,5.8rem)] leading-[0.86] tracking-[-0.055em]">
                      {journeyVideos[activeVideo].title}
                    </h2>
                  </div>

                  <div className="hidden shrink-0 gap-2 md:flex">
                    {journeyVideos.map((_, index) => (
                      <span
                        key={index}
                        className={`h-1 w-12 rounded-full transition-all duration-500 ${
                          activeVideo === index ? "bg-white" : "bg-white/25"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
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

      {/* DEVICE MOMENT */}
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

      {/* PHILOSOPHY */}
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

      {/* FUTURE */}
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

      {/* WAITLIST */}
      <section id="waitlist" className="bg-[#171914] px-5 py-28 text-[#f2efe7] md:px-8 md:py-40">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-16 md:grid-cols-[1.25fr_.75fr]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">Coming soon</p>
              <h2 className="mt-8 max-w-5xl font-display text-[clamp(4rem,8vw,9rem)] leading-[0.78] tracking-[-0.07em]">
                We'll tell you when there's something worth <em>leaving home for.</em>
              </h2>
            </div>
            <div className="flex flex-col justify-end">
              <p className="max-w-sm text-sm leading-6 text-white/50">
                We're building the first experience carefully. Join the list and you'll hear about it before everyone else.
              </p>
              {!joined ? (
                <form onSubmit={submit} className="mt-8">
                  <div className="flex border-b border-white/20 py-3">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                      placeholder="Your email"
                      className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/30"
                    />
                    <button className="ml-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] transition hover:text-white/60">
                      Join <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-8 flex items-center gap-3 border-b border-white/20 py-4 text-sm text-white/70">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d7decd] text-[#171914]">
                    <Check size={15} />
                  </span>
                  You're on the list.
                </div>
              )}
              <div className="mt-5 flex items-center gap-2 text-[10px] text-white/25">
                <Lock size={12} /> No spam. No daily newsletters. Promise.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0d0f0c] px-5 py-8 text-[#f2efe7] md:px-8">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="font-display text-2xl tracking-[-0.055em]">spendself.</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/25">Spend time on yourself.</div>
          </div>
          <div className="text-[10px] text-white/25">© 2026 SpendSelf</div>
        </div>
      </footer>
    </main>
  );
}
