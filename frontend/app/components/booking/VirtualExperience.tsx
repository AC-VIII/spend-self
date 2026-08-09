"use client";

import { useRef } from "react";
import { Play, Pause } from "lucide-react";

type VirtualExperienceProps = {
  videoUrl: string;
  poster?: string | null;
};

export default function VirtualExperience({
  videoUrl,
  poster,
}: VirtualExperienceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      await video.play();
    } catch (error) {
      console.error(
        "Failed to play virtual experience:",
        error
      );
    }
  };

  return (
    <div className="grid lg:grid-cols-[0.8fr_1.2fr]">

      {/* Text */}
      <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">

        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
          Virtual experience
        </p>

        <h2 className="mt-6 font-display text-4xl leading-[0.95] tracking-[-0.045em] md:text-6xl">
          Experience it
          <br />
          before you arrive.
        </h2>

        <p className="mt-7 max-w-md text-sm leading-7 text-white/45">
          Take a quiet look around before you
          make the journey. Explore the
          surroundings, spaces and atmosphere
          from wherever you are.
        </p>

        <button
          type="button"
          onClick={handlePlay}
          className="mt-9 flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3.5 text-[11px] uppercase tracking-[0.15em] text-black transition hover:bg-white/90"
        >
          <Play
            size={14}
            fill="currentColor"
          />

          Watch experience
        </button>
      </div>

      {/* Video */}
      <div className="relative min-h-[400px] bg-white/5 lg:min-h-[560px]">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster || undefined}
          controls
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

    </div>
  );
}