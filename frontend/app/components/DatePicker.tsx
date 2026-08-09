"use client";

import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

type DatePickerProps = {
  value?: string;
  minDate?: string;
  maxDate?: string;
  disabledDates?: string[];
  onChange: (date: string) => void;
  onClose: () => void;
  mode: "checkIn" | "checkOut";
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateString?: string) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeDate(date: Date) {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

export default function DatePicker({
  value,
  minDate,
  maxDate,
  disabledDates = [],
  onChange,
  onClose,
  mode
}: DatePickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

  const today = normalizeDate(new Date());

  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      const [year, month] = value.split("-").map(Number);

      return new Date(year, month - 1, 1);
    }

    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  /*
   * Close when clicking outside.
   */
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  function previousMonth() {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    );
  }

  function nextMonth() {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );
  }

  function isDisabled(date: Date) {
    const normalized = normalizeDate(date);
    const dateString = toDateString(date);

    if (normalized < today) {
      return true;
    }

    if (minDate && dateString < minDate) {
      return true;
    }

    if (maxDate && dateString > maxDate) {
      return true;
    }

    if (disabledDates.includes(dateString)) {
      return true;
    }

    return false;
  }

  function getCalendarDays() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }

  const calendarDays = getCalendarDays();

  return (
    <div
      ref={pickerRef}
      className="absolute left-0 top-full z-[100] mt-3 w-full min-w-[320px] max-w-[390px] rounded-[24px] border border-black/10 bg-white p-5 shadow-[0_25px_80px_rgba(0,0,0,0.14)]"
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={previousMonth}
          className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-black/5"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="text-sm font-medium">
          {MONTHS[currentMonth.getMonth()]}{" "}
          {currentMonth.getFullYear()}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={nextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-black/5"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-black/5"
            aria-label="Close date picker"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {/* Selected date */}
      <div className="mb-5 flex items-center gap-3 rounded-2xl bg-[#f7f6f2] px-4 py-3">
        <CalendarDays
          size={17}
          strokeWidth={1.5}
          className="text-black/40"
        />

        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-black/35">
            Selected date
          </p>

          <p className="mt-0.5 text-sm font-medium">
            {value ? formatDate(value) : "Choose a date"}
          </p>
        </div>
      </div>

      {/* Weekdays */}
      <div className="mb-2 grid grid-cols-7">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-[11px] font-medium uppercase text-black/35"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-y-1">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} />;
          }

          const dateString = toDateString(date);
          const disabled = isDisabled(date);
          const selected = dateString === value;

          return (
            <button
              key={dateString}
              type="button"
              disabled={disabled}
              onClick={() => {
                onChange(dateString);
                onClose();
              }}
              className={`flex h-10 items-center justify-center rounded-full text-sm transition ${
                disabled
                  ? "cursor-not-allowed text-black/15"
                  : "text-black hover:bg-black/5"
              } ${
                selected
                  ? "bg-black font-medium text-white hover:bg-black"
                  : ""
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
