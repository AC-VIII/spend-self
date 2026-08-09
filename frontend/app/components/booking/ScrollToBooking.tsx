"use client";

import { ArrowRight } from "lucide-react";

export default function ScrollToBooking() {
  const handleClick = () => {
    const booking = document.getElementById("booking");

    if (!booking) return;

    booking.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mx-auto mt-9 flex w-fit items-center gap-3 rounded-full bg-black px-7 py-4 text-[11px] font-medium uppercase tracking-[0.15em] text-white transition hover:bg-black/80"
    >
      Book your stay
      <ArrowRight size={15} />
    </button>
  );
}