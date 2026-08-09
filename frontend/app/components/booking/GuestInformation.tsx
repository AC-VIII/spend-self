"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, Mail, Phone, User } from "lucide-react";

export type GuestInformationData = {
  fullName: string;
  country: string;
  phone: string;
  email: string;
  specialRequests: string;
};

type GuestInformationProps = {
  initialData?: GuestInformationData;
  onBack: () => void;
  onContinue: (data: GuestInformationData) => void;
};

const countries = [
  "Nepal",
  "India",
  "United States",
  "United Kingdom",
  "Australia",
  "Canada",
  "Germany",
  "France",
  "Japan",
  "South Korea",
  "Singapore",
  "Thailand",
  "Other",
];

export default function GuestInformation({
  initialData,
  onBack,
  onContinue,
}: GuestInformationProps) {
  const [fullName, setFullName] = useState(
    initialData?.fullName ?? ""
  );

  const [country, setCountry] = useState(
    initialData?.country ?? ""
  );

  const [phone, setPhone] = useState(
    initialData?.phone ?? ""
  );

  const [email, setEmail] = useState(
    initialData?.email ?? ""
  );

  const [specialRequests, setSpecialRequests] = useState(
    initialData?.specialRequests ?? ""
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onContinue({
      fullName: fullName.trim(),
      country,
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      specialRequests: specialRequests.trim(),
    });
  }

  const isValid =
    fullName.trim().length >= 2 &&
    country.length > 0 &&
    phone.trim().length >= 7 &&
    email.includes("@");

  return (
    <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm text-black/45 transition hover:text-black"
        >
          <ArrowLeft size={16} />

          Back
        </button>

        <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
          Guest information
        </p>

        <h2 className="mt-3 text-3xl font-medium tracking-tight">
          Tell us about you.
        </h2>

        <p className="mt-3 text-sm leading-6 text-black/50">
          We need a few details to complete your stay.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Full name */}
        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-black/50"
          >
            Full name
          </label>

          <div className="relative">
            <User
              size={17}
              strokeWidth={1.5}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
            />

            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              required
              className="w-full rounded-2xl border border-black/10 bg-[#f7f6f2] py-4 pl-11 pr-4 text-sm outline-none transition placeholder:text-black/25 focus:border-black"
            />
          </div>
        </div>

        {/* Country */}
        <div className="mt-5">
          <label
            htmlFor="country"
            className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-black/50"
          >
            Country
          </label>

          <select
            id="country"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            required
            className="w-full rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="" disabled>
              Where are you coming from?
            </option>

            {countries.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Phone */}
        <div className="mt-5">
          <label
            htmlFor="phone"
            className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-black/50"
          >
            Contact number
          </label>

          <div className="relative">
            <Phone
              size={17}
              strokeWidth={1.5}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
            />

            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+977 98XXXXXXXX"
              autoComplete="tel"
              required
              className="w-full rounded-2xl border border-black/10 bg-[#f7f6f2] py-4 pl-11 pr-4 text-sm outline-none transition placeholder:text-black/25 focus:border-black"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mt-5">
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-black/50"
          >
            Email address
          </label>

          <div className="relative">
            <Mail
              size={17}
              strokeWidth={1.5}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
            />

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full rounded-2xl border border-black/10 bg-[#f7f6f2] py-4 pl-11 pr-4 text-sm outline-none transition placeholder:text-black/25 focus:border-black"
            />
          </div>
        </div>

        {/* Special requests */}
        <div className="mt-5">
          <label
            htmlFor="specialRequests"
            className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-black/50"
          >
            Special requests
            <span className="ml-1 normal-case tracking-normal text-black/30">
              (optional)
            </span>
          </label>

          <textarea
            id="specialRequests"
            value={specialRequests}
            onChange={(event) =>
              setSpecialRequests(event.target.value)
            }
            placeholder="Anything we should know before your stay?"
            rows={4}
            className="w-full resize-none rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-4 text-sm outline-none transition placeholder:text-black/25 focus:border-black"
          />
        </div>

        {/* Continue */}
        <button
          type="submit"
          disabled={!isValid}
          className={`mt-7 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-medium transition ${
            isValid
              ? "bg-black text-white hover:bg-black/80"
              : "cursor-not-allowed bg-black/10 text-black/30"
          }`}
        >
          Review Booking

          <ArrowRight size={17} />
        </button>
      </form>

      <p className="mt-4 text-center text-xs leading-5 text-black/35">
        Your information is only used to manage your stay.
      </p>
    </div>
  );
}