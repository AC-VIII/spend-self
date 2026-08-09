"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Lock,
  Volume2,
  VolumeX,
} from "lucide-react";
import Testimonials from "./components/testimonial/Testimonial";
import Hero from "./components/home/Hero";
import Statement from "./components/home/Statement";
import Idea from "./components/home/Idea";
import Experience from "./components/home/Experience";
import Device from "./components/home/Device";
import Philosophy from "./components/home/Philosophy";
import Future from "./components/home/Future";

export default function Home() {
  // const [menu, setMenu] = useState(false);
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

    if (!response.ok && response.status !== 409) {
      throw new Error("Failed to subscribe");
    }

    setJoined(true);
  } catch (error) {
    console.error("Newsletter subscription failed:", error);
  }
}

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f1eee5] text-[#171914]">

      {/* HERO — deliberately cinematic */}
      <Hero />

      {/* INTERRUPT / STATEMENT */}
      <Statement />

      {/* VISUAL MOSAIC */}
     <Idea />

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
      <Experience />

      {/* TESTIMONIALS */}
    <Testimonials />

      {/* DEVICE MOMENT */}
      <Device />

      {/* PHILOSOPHY */}
      <Philosophy />

      {/* FUTURE */}
      <Future />

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
    </main>
  );
}
