"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

import BookingPanel from "./BookingPanel";

type BookingPanelTriggerProps = {
  stay: Stay;
};

export default function BookingPanelTrigger({
  stay,
}: BookingPanelTriggerProps) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className="mt-7">
        <BookingPanel stay={stay} />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-sm font-medium text-white transition hover:bg-black/80"
    >
      Book your stay
      <ArrowRight size={17} />
    </button>
  );
}