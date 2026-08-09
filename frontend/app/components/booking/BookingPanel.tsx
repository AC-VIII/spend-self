"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";

import DateSelector from "./DateSelector";
import GuestInformation, {
  GuestInformationData,
} from "./GuestInformation";

function formatDate(dateString: string) {
  if (!dateString) return "";

  const [year, month, day] =
    dateString.split("-").map(Number);

  return new Date(
    year,
    month - 1,
    day
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function dateToKey(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isDateInRange(
  date: string,
  start: string,
  end: string
) {
  return (
    date >= start &&
    date < end
  );
}

export default function BookingPanel({
  stay,
}: BookingPanelProps) {
  const [step, setStep] =
    useState<BookingStep>("booking");

  const [checkIn, setCheckIn] =
    useState("");

  const [checkOut, setCheckOut] =
    useState("");

  const [guests, setGuests] =
    useState(1);

  const [guest, setGuest] =
    useState<GuestInformationData | null>(
      null
    );

  const [bookingNumber, setBookingNumber] =
    useState("");

  const [bookingLoading, setBookingLoading] =
    useState(false);

  const [bookingError, setBookingError] =
    useState("");

  /*
   * --------------------------------------------
   * AVAILABILITY
   * --------------------------------------------
   */

  const [
    unavailableDates,
    setUnavailableDates,
  ] = useState<string[]>([]);

  const [
    availabilityLoading,
    setAvailabilityLoading,
  ] = useState(true);

  const [
    availabilityError,
    setAvailabilityError,
  ] = useState(false);

  /*
   * Load unavailable dates for this stay.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      try {
        setAvailabilityLoading(true);
        setAvailabilityError(false);

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not configured."
          );
        }

        const response =
          await fetch(
            `${apiUrl}/api/stays/${stay.id}/availability`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to load availability."
          );
        }

        if (!cancelled) {
          setUnavailableDates(
            data.unavailable_dates || []
          );
        }
      } catch (error) {
        console.error(
          "Failed to load stay availability:",
          error
        );

        if (!cancelled) {
          setAvailabilityError(true);
        }
      } finally {
        if (!cancelled) {
          setAvailabilityLoading(false);
        }
      }
    }

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [stay.id]);

  /*
   * Convert to Set so date checks are fast.
   */
  const unavailableDateSet =
    useMemo(
      () =>
        new Set(unavailableDates),
      [unavailableDates]
    );

  /*
   * Check whether a particular
   * YYYY-MM-DD date is unavailable.
   */
  function isUnavailable(
    date: string
  ) {
    return unavailableDateSet.has(
      date
    );
  }

  /*
   * Check whether ANY night between
   * check-in and check-out is booked.
   *
   * Check-out itself is not included.
   *
   * Example:
   *
   * check-in  Aug 15
   * check-out Aug 18
   *
   * checks:
   * Aug 15
   * Aug 16
   * Aug 17
   */
  function rangeHasUnavailableDate(
    startDate: string,
    endDate: string
  ) {
    if (!startDate || !endDate) {
      return false;
    }

    const current =
      new Date(
        `${startDate}T00:00:00`
      );

    const end =
      new Date(
        `${endDate}T00:00:00`
      );

    while (current < end) {
      const key = dateToKey(current);

      if (isUnavailable(key)) {
        return true;
      }

      current.setDate(
        current.getDate() + 1
      );
    }

    return false;
  }

  /*
   * --------------------------------------------
   * DATE SELECTION
   * --------------------------------------------
   */

  function handleCheckInChange(
    date: string
  ) {
    setBookingError("");

    /*
     * Don't allow booked check-in.
     */
    if (isUnavailable(date)) {
      setBookingError(
        "This date is already booked. Please choose another date or stay."
      );

      return;
    }

    /*
     * If the existing checkout is
     * before/equal to the new check-in,
     * reset it.
     */
    if (
      checkOut &&
      checkOut <= date
    ) {
      setCheckOut("");
    }

    /*
     * If an existing checkout now creates
     * a booked range, reset checkout.
     */
    if (
      checkOut &&
      rangeHasUnavailableDate(
        date,
        checkOut
      )
    ) {
      setCheckOut("");

      setBookingError(
        "Some nights in your selected range are already booked. Please choose different dates."
      );
    }

    setCheckIn(date);
  }

  function handleCheckOutChange(
    date: string
  ) {
    setBookingError("");

    if (!checkIn) {
      setBookingError(
        "Please choose your check-in date first."
      );

      return;
    }

    if (date <= checkIn) {
      setBookingError(
        "Check-out must be after check-in."
      );

      return;
    }

    /*
     * Check all nights in the range.
     */
    if (
      rangeHasUnavailableDate(
        checkIn,
        date
      )
    ) {
      setBookingError(
        "Some of these dates are already booked. Please choose different dates or another stay."
      );

      return;
    }

    setCheckOut(date);
  }

  /*
   * --------------------------------------------
   * Calculate nights
   * --------------------------------------------
   */

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start = new Date(
      `${checkIn}T00:00:00`
    );

    const end = new Date(
      `${checkOut}T00:00:00`
    );

    const difference =
      end.getTime() - start.getTime();

    if (difference <= 0) {
      return 0;
    }

    return Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );
  }, [checkIn, checkOut]);

  /*
   * Display-only total.
   *
   * Backend remains the source of truth.
   */
  const estimatedTotal =
    nights *
    Number(
      stay.price_per_night
    );

  const canContinue =
    Boolean(checkIn) &&
    Boolean(checkOut) &&
    nights > 0 &&
    !rangeHasUnavailableDate(
      checkIn,
      checkOut
    );

  /*
   * --------------------------------------------
   * STEP 1
   * Start booking
   * --------------------------------------------
   */

  function handleStartBooking() {
    if (!canContinue) {
      return;
    }

    setBookingError("");
    setStep("guest");
  }

  /*
   * --------------------------------------------
   * STEP 2
   * Guest information
   * --------------------------------------------
   */

  function handleGuestContinue(
    data: GuestInformationData
  ) {
    setGuest(data);
    setBookingError("");
    setStep("review");
  }

  /*
   * --------------------------------------------
   * Refresh availability
   * --------------------------------------------
   */

  async function refreshAvailability() {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        return;
      }

      const response =
        await fetch(
          `${apiUrl}/api/stays/${stay.id}/availability`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

      const data =
        await response.json();

      if (
        response.ok &&
        data.success
      ) {
        setUnavailableDates(
          data.unavailable_dates || []
        );
      }
    } catch (error) {
      console.error(
        "Failed to refresh availability:",
        error
      );
    }
  }

  /*
   * --------------------------------------------
   * STEP 3
   * Send booking to backend
   * --------------------------------------------
   */

  async function handleConfirmBooking() {
    if (!guest || bookingLoading) {
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError("");

      /*
       * Check availability one more time
       * immediately before submitting.
       */
      await refreshAvailability();

      /*
       * Local availability may have changed
       * while the user was entering guest info.
       *
       * Re-check the currently selected range
       * against the latest state.
       */
      if (
        rangeHasUnavailableDate(
          checkIn,
          checkOut
        )
      ) {
        setBookingError(
          "These dates are no longer available. Please choose another stay or different dates."
        );

        setStep("booking");

        return;
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not configured."
        );
      }

      const response =
        await fetch(
          `${apiUrl}/api/bookings`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              stayId: stay.id,

              checkIn,
              checkOut,

              guests,

              guest: {
                fullName:
                  guest.fullName.trim(),

                country:
                  guest.country.trim(),

                phone:
                  guest.phone.trim(),

                email:
                  guest.email
                    .trim()
                    .toLowerCase(),

                specialRequests:
                  guest.specialRequests?.trim() ||
                  "",
              },
            }),
          }
        );

      const data: BookingResponse =
        await response.json();

      /*
       * Another guest may have booked
       * the dates between our availability
       * check and this POST.
       */
      if (response.status === 409) {
        await refreshAvailability();

        setBookingError(
          data.message ||
            "These dates are no longer available. Please choose another stay or different dates."
        );

        setStep("booking");

        return;
      }

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to create booking."
        );
      }

      /*
       * Booking number comes from backend.
       */
      setBookingNumber(
        data.booking.bookingNumber
      );

      /*
       * Backend is the source of truth.
       */
      setStep("confirmation");
    } catch (error) {
      console.error(
        "Booking error:",
        error
      );

      setBookingError(
        error instanceof Error
          ? error.message
          : "Unable to complete booking."
      );
    } finally {
      setBookingLoading(false);
    }
  }

  /*
   * --------------------------------------------
   * Reset booking
   * --------------------------------------------
   */

  function handleDone() {
    setStep("booking");

    setCheckIn("");
    setCheckOut("");

    setGuests(1);

    setGuest(null);

    setBookingNumber("");

    setBookingError("");
  }

  /*
   * --------------------------------------------
   * STEP 1 — BOOKING
   * --------------------------------------------
   */

  if (step === "booking") {
    return (
      <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-8">

        <div className="mb-7">
          <p className="text-xs uppercase tracking-[0.15em] text-black/40">
            Starting from
          </p>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-medium">
              {stay.currency ||
                "NPR"}{" "}
              {Number(
                stay.price_per_night
              ).toLocaleString()}
            </span>

            <span className="text-sm text-black/40">
              / night
            </span>
          </div>
        </div>

        {availabilityLoading && (
          <div className="mb-4 rounded-2xl bg-[#f7f6f2] px-4 py-3 text-xs text-black/45">
            Checking availability...
          </div>
        )}

        {availabilityError && (
          <div className="mb-4 rounded-2xl bg-[#f7f6f2] px-4 py-3 text-xs leading-5 text-black/50">
            We couldn't load the latest
            availability. Please try again.
          </div>
        )}

        <DateSelector
          checkIn={checkIn}
          checkOut={checkOut}
          setCheckIn={
            handleCheckInChange
          }
          setCheckOut={
            handleCheckOutChange
          }
          disabledDates={
            unavailableDates
          }
        />

        {!availabilityLoading &&
          unavailableDates.length >
            0 && (
            <p className="mt-3 text-[11px] leading-5 text-black/35">
              Dates that are already
              booked are disabled. If your
              preferred dates aren't
              available, you can explore
              another stay.
            </p>
          )}

        <div className="mt-5">
          <label
            htmlFor="guests"
            className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-black/50"
          >
            Guests
          </label>

          <div className="relative">
            <Users
              size={17}
              strokeWidth={1.5}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
            />

            <select
              id="guests"
              value={guests}
              onChange={(event) =>
                setGuests(
                  Number(
                    event.target.value
                  )
                )
              }
              className="w-full appearance-none rounded-2xl border border-black/10 bg-[#f7f6f2] py-4 pl-11 pr-4 text-sm outline-none transition focus:border-black"
            >
              {Array.from(
                {
                  length:
                    Number(
                      stay.max_guests ||
                        6
                    ),
                },
                (_, index) =>
                  index + 1
              ).map((number) => (
                <option
                  key={number}
                  value={number}
                >
                  {number}{" "}
                  {number === 1
                    ? "guest"
                    : "guests"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {nights > 0 && (
          <div className="mt-7 border-t border-black/10 pt-6">

            <div className="flex justify-between text-sm text-black/60">
              <span>
                {stay.currency ||
                  "NPR"}{" "}
                {Number(
                  stay.price_per_night
                ).toLocaleString()}{" "}
                × {nights}{" "}
                {nights === 1
                  ? "night"
                  : "nights"}
              </span>

              <span>
                {stay.currency ||
                  "NPR"}{" "}
                {estimatedTotal.toLocaleString()}
              </span>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="font-medium">
                Estimated total
              </span>

              <span className="text-xl font-medium">
                {stay.currency ||
                  "NPR"}{" "}
                {estimatedTotal.toLocaleString()}
              </span>
            </div>

          </div>
        )}

        {bookingError && (
          <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
            {bookingError}

            {bookingError.includes(
              "another stay"
            ) && (
              <a
                href="/stays"
                className="mt-2 inline-block font-medium underline underline-offset-4"
              >
                Explore other stays →
              </a>
            )}
          </div>
        )}

        <button
          type="button"
          disabled={
            !canContinue ||
            availabilityLoading
          }
          onClick={
            handleStartBooking
          }
          className={`mt-7 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-medium transition ${
            canContinue &&
            !availabilityLoading
              ? "bg-black text-white hover:bg-black/80"
              : "cursor-not-allowed bg-black/10 text-black/30"
          }`}
        >
          {canContinue
            ? "Book Now"
            : "Select your dates"}

          {canContinue && (
            <ArrowRight size={17} />
          )}
        </button>

        <p className="mt-4 text-center text-xs text-black/40">
          You won't be charged yet.
        </p>
      </div>
    );
  }

  /*
   * --------------------------------------------
   * STEP 2 — GUEST INFORMATION
   * --------------------------------------------
   */

  if (step === "guest") {
    return (
      <GuestInformation
        initialData={
          guest ?? undefined
        }
        onBack={() =>
          setStep("booking")
        }
        onContinue={
          handleGuestContinue
        }
      />
    );
  }

  /*
   * --------------------------------------------
   * STEP 3 — REVIEW
   * --------------------------------------------
   */

  if (
    step === "review" &&
    guest
  ) {
    return (
      <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-8">

        <button
          type="button"
          onClick={() =>
            setStep("guest")
          }
          className="mb-6 flex items-center gap-2 text-sm text-black/45 transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
          Review booking
        </p>

        <h2 className="mt-3 text-3xl font-medium tracking-tight">
          Almost there.
        </h2>

        <p className="mt-3 text-sm leading-6 text-black/50">
          Please check your details
          before confirming your stay.
        </p>

        {/* Stay */}
        <div className="mt-7 rounded-2xl bg-[#f7f6f2] p-5">

          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-lg font-medium">
                {stay.name}
              </p>

              <div className="mt-1 flex items-center gap-1.5 text-sm text-black/45">
                <MapPin size={14} />

                <span>
                  {stay.location}
                </span>
              </div>
            </div>

            <span className="text-right text-sm font-medium">
              {stay.currency ||
                "NPR"}{" "}
              {estimatedTotal.toLocaleString()}
            </span>

          </div>

          <div className="my-5 border-t border-black/10" />

          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <CalendarDays
                size={17}
                strokeWidth={1.5}
                className="text-black/40"
              />

              <div>
                <p className="text-xs text-black/40">
                  Stay
                </p>

                <p className="mt-0.5 text-sm">
                  {formatDate(
                    checkIn
                  )}{" "}
                  →{" "}
                  {formatDate(
                    checkOut
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users
                size={17}
                strokeWidth={1.5}
                className="text-black/40"
              />

              <div>
                <p className="text-xs text-black/40">
                  Guests
                </p>

                <p className="mt-0.5 text-sm">
                  {guests}{" "}
                  {guests === 1
                    ? "guest"
                    : "guests"}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Guest */}
        <div className="mt-5 rounded-2xl border border-black/10 p-5">

          <div className="mb-5 flex items-center justify-between">

            <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/40">
              Guest
            </p>

            <button
              type="button"
              onClick={() =>
                setStep("guest")
              }
              className="text-xs font-medium underline underline-offset-4"
            >
              Edit
            </button>

          </div>

          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <User
                size={17}
                className="text-black/40"
              />

              <div>
                <p className="text-xs text-black/40">
                  Name
                </p>

                <p className="mt-0.5 text-sm">
                  {guest.fullName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin
                size={17}
                className="text-black/40"
              />

              <div>
                <p className="text-xs text-black/40">
                  Country
                </p>

                <p className="mt-0.5 text-sm">
                  {guest.country}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone
                size={17}
                className="text-black/40"
              />

              <div>
                <p className="text-xs text-black/40">
                  Contact
                </p>

                <p className="mt-0.5 text-sm">
                  {guest.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail
                size={17}
                className="text-black/40"
              />

              <div className="min-w-0">
                <p className="text-xs text-black/40">
                  Email
                </p>

                <p className="mt-0.5 truncate text-sm">
                  {guest.email}
                </p>
              </div>
            </div>

            {guest.specialRequests && (
              <div className="border-t border-black/10 pt-4">

                <p className="text-xs text-black/40">
                  Special requests
                </p>

                <p className="mt-1 text-sm leading-6 text-black/70">
                  {
                    guest.specialRequests
                  }
                </p>

              </div>
            )}

          </div>
        </div>

        {/* Total */}
        <div className="mt-6 flex items-center justify-between">

          <div>
            <p className="text-sm text-black/40">
              {nights}{" "}
              {nights === 1
                ? "night"
                : "nights"}
            </p>

            <p className="mt-1 font-medium">
              Total
            </p>
          </div>

          <p className="text-2xl font-medium">
            {stay.currency ||
              "NPR"}{" "}
            {estimatedTotal.toLocaleString()}
          </p>

        </div>

        {bookingError && (
          <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
            {bookingError}
          </div>
        )}

        <button
          type="button"
          disabled={bookingLoading}
          onClick={
            handleConfirmBooking
          }
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-sm font-medium text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {bookingLoading
            ? "Confirming..."
            : "Confirm Booking"}

          {!bookingLoading && (
            <Check size={17} />
          )}
        </button>

        <p className="mt-4 text-center text-xs leading-5 text-black/35">
          No payment is required at this stage.
        </p>

      </div>
    );
  }

  /*
   * --------------------------------------------
   * STEP 4 — CONFIRMATION
   * --------------------------------------------
   */

  if (
    step === "confirmation" &&
    guest
  ) {
    return (
      <div className="rounded-[28px] border border-black/10 bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-9">

        <div className="flex justify-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black">

            <Check
              size={28}
              strokeWidth={1.8}
              className="text-white"
            />

          </div>

        </div>

        <div className="mt-6 text-center">

          <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
            Booking confirmed
          </p>

          <h2 className="mt-3 text-3xl font-medium tracking-tight">
            You're going somewhere.
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-black/50">
            Your time away from everything
            is officially on the calendar.
          </p>

        </div>

        <div className="mt-8 rounded-2xl bg-[#f7f6f2] p-5">

          <p className="text-lg font-medium">
            {stay.name}
          </p>

          <div className="mt-1 flex items-center gap-1.5 text-sm text-black/45">
            <MapPin size={14} />

            <span>
              {stay.location}
            </span>
          </div>

          <div className="my-5 border-t border-black/10" />

          <div className="space-y-4">

            <div className="flex items-center gap-3">

              <CalendarDays
                size={17}
                className="text-black/40"
              />

              <div>
                <p className="text-xs text-black/40">
                  Dates
                </p>

                <p className="mt-0.5 text-sm">
                  {formatDate(
                    checkIn
                  )}{" "}
                  →{" "}
                  {formatDate(
                    checkOut
                  )}
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <Users
                size={17}
                className="text-black/40"
              />

              <div>
                <p className="text-xs text-black/40">
                  Guests
                </p>

                <p className="mt-0.5 text-sm">
                  {guests}{" "}
                  {guests === 1
                    ? "guest"
                    : "guests"}
                </p>
              </div>

            </div>

          </div>

          <div className="my-5 border-t border-black/10" />

          <div className="flex items-center justify-between">

            <span className="text-sm text-black/50">
              Total
            </span>

            <span className="text-xl font-medium">
              {stay.currency ||
                "NPR"}{" "}
              {estimatedTotal.toLocaleString()}
            </span>

          </div>

        </div>

        <div className="mt-5 flex items-center justify-between text-xs">

          <span className="text-black/40">
            Booking number
          </span>

          <span className="font-medium">
            {bookingNumber}
          </span>

        </div>

        <p className="mt-3 text-center text-xs text-black/35">
          Confirmation details would be
          sent to {guest.email}
        </p>

        <button
          type="button"
          onClick={handleDone}
          className="mt-7 w-full rounded-full bg-black px-6 py-4 text-sm font-medium text-white transition hover:bg-black/80"
        >
          Done
        </button>

      </div>
    );
  }

  return null;
}