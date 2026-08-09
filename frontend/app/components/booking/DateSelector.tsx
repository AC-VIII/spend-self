"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

import DatePicker from "../DatePicker";

type DateSelectorProps = {
  checkIn: string;
  checkOut: string;
  setCheckIn: (value: string) => void;
  setCheckOut: (value: string) => void;
  disabledDates?: string[];
};

function formatDate(dateString: string) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getNextDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  date.setDate(date.getDate() + 1);

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

/**
 * Returns checkout dates that should be disabled.
 *
 * Rules:
 *
 * 1. If there is no check-in date,
 *    use the normal unavailable dates.
 *
 * 2. If the day immediately after check-in
 *    is unavailable, that day becomes a
 *    valid checkout date.
 *
 * 3. If the next day is available,
 *    keep the normal unavailable dates.
 */
function getCheckoutDisabledDates(
  checkIn: string,
  disabledDates: string[]
) {
  if (!checkIn) {
    return disabledDates;
  }

  const nextDay = getNextDate(checkIn);

  /*
   * The next day is unavailable for booking.
   *
   * The guest can still CHECK OUT on that day,
   * so remove it from the checkout disabled dates.
   */
  if (disabledDates.includes(nextDay)) {
    return disabledDates.filter((date) => date !== nextDay);
  }

  return disabledDates;
}

export default function DateSelector({
  checkIn,
  checkOut,
  setCheckIn,
  setCheckOut,
  disabledDates = [],
}: DateSelectorProps) {
  const [openPicker, setOpenPicker] = useState<
    "checkIn" | "checkOut" | null
  >(null);

  /*
   * If the day immediately after check-in is unavailable,
   * checkout must automatically be that day.
   *
   * Example:
   *
   * Check-in:  Aug 10
   * Aug 11:    unavailable
   *
   * Checkout:  Aug 11
   *
   * Checkout input becomes disabled.
   */
  const forcedCheckoutDate =
    checkIn && disabledDates.includes(getNextDate(checkIn))
      ? getNextDate(checkIn)
      : "";

  /*
   * Keep checkout synchronized when:
   *
   * - check-in changes
   * - disabled dates change
   *
   * This also handles cases where checkIn is populated
   * from parent state instead of being selected here.
   */
  useEffect(() => {
    if (!checkIn) {
      return;
    }

    const nextDay = getNextDate(checkIn);

    if (disabledDates.includes(nextDay)) {
      setCheckOut(nextDay);
      setOpenPicker(null);
    }
  }, [checkIn, disabledDates, setCheckOut]);

  /**
   * ---
   * CHECK-IN
   * ---
   */
  function handleCheckIn(date: string) {
    /*
     * A booked night cannot be selected
     * as a check-in date.
     */
    if (disabledDates.includes(date)) {
      return;
    }

    setCheckIn(date);

    const nextDay = getNextDate(date);

    /*
     * If the next day is unavailable,
     * it automatically becomes checkout.
     *
     * No need to open checkout picker because
     * there is only one possible checkout date.
     */
    if (disabledDates.includes(nextDay)) {
      setCheckOut(nextDay);
      setOpenPicker(null);
      return;
    }

    /*
     * Existing checkout becomes invalid
     * if it is before/equal to the new check-in.
     */
    if (checkOut && checkOut <= date) {
      setCheckOut("");
    }

    /*
     * Normal case:
     * move the user to checkout selection.
     */
    setOpenPicker("checkOut");
  }

  /**
   * ---
   * CHECK-OUT
   * ---
   */
  function handleCheckOut(date: string) {
    if (!checkIn) {
      return;
    }

    /*
     * Checkout must be after check-in.
     */
    if (date <= checkIn) {
      return;
    }

    setCheckOut(date);

    /*
     * Close the calendar after selection.
     */
    setOpenPicker(null);
  }

  /*
   * Calculate disabled dates specifically
   * for checkout.
   */
  const checkoutDisabledDates = getCheckoutDisabledDates(
    checkIn,
    disabledDates
  );

  /*
   * Checkout is locked when the next day
   * after check-in is unavailable.
   */
  const isCheckoutDisabled = Boolean(forcedCheckoutDate);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* ================================== */}
      {/* CHECK-IN                           */}
      {/* ================================== */}

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenPicker("checkIn")}
          className={`w-full rounded-2xl border bg-[#f7f6f2] px-4 py-4 text-left transition ${
            openPicker === "checkIn"
              ? "border-black"
              : "border-black/10 hover:border-black/30"
          }`}
        >
          <span className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-black/40">
            Check-in
          </span>

          <div className="flex items-center gap-3">
            <CalendarDays
              size={18}
              strokeWidth={1.5}
              className="text-black/40"
            />

            <span
              className={
                checkIn
                  ? "text-sm text-black"
                  : "text-sm text-black/35"
              }
            >
              {checkIn ? formatDate(checkIn) : "Select date"}
            </span>
          </div>
        </button>

        {openPicker === "checkIn" && (
          <DatePicker
            value={checkIn}
            mode="checkIn"
            disabledDates={disabledDates}
            onChange={handleCheckIn}
            onClose={() => setOpenPicker(null)}
          />
        )}
      </div>

      {/* ================================== */}
      {/* CHECK-OUT                          */}
      {/* ================================== */}

      <div className="relative">
        <button
          type="button"
          disabled={isCheckoutDisabled}
          onClick={() => {
            if (!isCheckoutDisabled) {
              setOpenPicker("checkOut");
            }
          }}
          className={`w-full rounded-2xl border bg-[#f7f6f2] px-4 py-4 text-left transition ${
            isCheckoutDisabled
              ? "cursor-not-allowed border-black/10 opacity-60"
              : openPicker === "checkOut"
                ? "border-black"
                : "border-black/10 hover:border-black/30"
          }`}
        >
          <span className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-black/40">
            Check-out
          </span>

          <div className="flex items-center gap-3">
            <CalendarDays
              size={18}
              strokeWidth={1.5}
              className="text-black/40"
            />

            <span
              className={
                checkOut
                  ? "text-sm text-black"
                  : "text-sm text-black/35"
              }
            >
              {checkOut ? formatDate(checkOut) : "Select date"}
            </span>
          </div>
        </button>

        {!isCheckoutDisabled && openPicker === "checkOut" && (
          <DatePicker
            value={checkOut}
            mode="checkOut"
            minDate={checkIn ? getNextDate(checkIn) : undefined}
            disabledDates={checkoutDisabledDates}
            onChange={handleCheckOut}
            onClose={() => setOpenPicker(null)}
          />
        )}
      </div>
    </div>
  );
}