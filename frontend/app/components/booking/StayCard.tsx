"use client";

import Link from "next/link";
import { Stay } from "../../lib/stay"

type Props = {
  stay: Stay;
};

export default function StayCard({ stay }: Props) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-72 overflow-hidden">
        <img
          src={stay.image}
          alt={stay.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <p className="text-sm text-white/80">{stay.location}</p>
          <h2 className="mt-1 text-2xl font-medium text-white">
            {stay.name}
          </h2>
        </div>
      </div>

      <div className="p-6">
        <p className="line-clamp-2 text-sm leading-6 text-gray-600">
          {stay.description}
        </p>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-500">From</p>

            <p className="text-xl font-semibold text-gray-900">
              NPR {stay.pricePerNight.toLocaleString()}
            </p>

            <p className="text-xs text-gray-500">per night</p>
          </div>

          <Link
            href={`/booking/${stay.id}`}
            className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            View Stay
          </Link>
        </div>
      </div>
    </div>
  );
}