"use client";

import { Check, MapPin, CalendarDays, Users } from "lucide-react";

type BookingConfirmationProps = {
  stay: Stay;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  total: number;
  onClose: () => void;
};

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function generateBookingNumber() {
  return `SS-${Math.floor(100000 + Math.random() * 900000)}`;
}

export default function BookingConfirmation({
  stay,
  checkIn,
  checkOut,
  guests,
  nights,
  total,
  onClose,
}: BookingConfirmationProps) {
  const bookingNumber = generateBookingNumber();

  return (
    <div className="rounded-[28px] border border-black/10 bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-9">
      {/* Success icon */}
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black">
          <Check size={28} strokeWidth={1.8} className="text-white" />
        </div>
      </div>

      {/* Heading */}
      <div className="mt-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
          Booking confirmed
        </p>

        <h2 className="mt-3 text-3xl font-medium tracking-tight">
          Your reset is booked.
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-black/50">
          Your time away from everything is officially on the calendar.
        </p>
      </div>

      {/* Booking details */}
      <div className="mt-8 rounded-2xl bg-[#f7f6f2] p-5">
        <div>
          <p className="text-lg font-medium">{stay.name}</p>

          <div className="mt-1 flex items-center gap-1.5 text-sm text-black/45">
            <MapPin size={14} />

            <span>{stay.location}</span>
          </div>
        </div>

        <div className="my-5 border-t border-black/10" />

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CalendarDays
                size={17}
                strokeWidth={1.5}
                className="text-black/40"
              />

              <div>
                <p className="text-xs text-black/40">Dates</p>

                <p className="mt-0.5 text-sm">
                  {formatDate(checkIn)} – {formatDate(checkOut)}
                </p>
              </div>
            </div>

            <span className="text-xs text-black/40">
              {nights} {nights === 1 ? "night" : "nights"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Users
              size={17}
              strokeWidth={1.5}
              className="text-black/40"
            />

            <div>
              <p className="text-xs text-black/40">Guests</p>

              <p className="mt-0.5 text-sm">
                {guests} {guests === 1 ? "guest" : "guests"}
              </p>
            </div>
          </div>
        </div>

        <div className="my-5 border-t border-black/10" />

        <div className="flex items-center justify-between">
          <span className="text-sm text-black/50">Total</span>

          <span className="text-xl font-medium">
            NPR {total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Booking number */}
      <div className="mt-5 flex items-center justify-between text-xs">
        <span className="text-black/40">Booking number</span>

        <span className="font-medium">{bookingNumber}</span>
      </div>

      {/* Done */}
      <button
        type="button"
        onClick={onClose}
        className="mt-7 w-full rounded-full bg-black px-6 py-4 text-sm font-medium text-white transition hover:bg-black/80"
      >
        Done
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-black/35">
        A confirmation would be sent to your email once the booking system is
        connected.
      </p>
    </div>
  );
}