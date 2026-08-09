import Link from "next/link";

import { getStays } from "../services/stayServices";
import Navbar from "../components/Navbar";

export const dynamic = "force-dynamic";

export default async function StaysPage() {

  let stays: Stay[] = [];

  try {
    const response = await getStays();
    stays = response.stays;
  } catch (error) {
    console.error(
      "🔥 Failed to load stays:",
      error
    );
  }


  return (
    <main className="min-h-screen bg-[#f1eee5]">
      <Navbar />
      <section className="mx-auto max-w-[1400px] px-5 pb-20 pt-32 md:px-8">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-black/40">
            Stay with us
          </p>

          <h1 className="mt-4 text-5xl font-medium tracking-[-0.04em] md:text-7xl">
            A little time
            <br />
            for yourself.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-black/50">
            Spaces designed to help you slow down,
            disconnect, and spend meaningful time
            with yourself.
          </p>
        </div>

        {stays.length === 0 ? (
          <div className="mt-16 rounded-[28px] border border-black/10 bg-white p-10 text-center">
            <p className="text-black/50">
              No stays are available right now.
            </p>
          </div>
        ) : (
          <div className="mt-16 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {stays.map((stay) => (
              <Link
                key={stay.id}
                href={`/stays/${stay.slug}`}
                className="group overflow-hidden rounded-[28px] bg-white transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
                  {stay.image_url ? (
                    <img
                      src={stay.image_url}
                      alt={stay.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-black/30">
                      Image coming soon
                    </div>
                  )}

                  <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-xs backdrop-blur">
                    {stay.location}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <h2 className="text-2xl font-medium tracking-tight">
                        {stay.name}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-black/45">
                        {stay.short_description ||
                          stay.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-end justify-between border-t border-black/10 pt-5">
                    <div>
                      <span className="text-xl font-medium">
                        {stay.currency}{" "}
                        {Number(
                          stay.price_per_night
                        ).toLocaleString()}
                      </span>

                      <span className="ml-1 text-xs text-black/40">
                        / night
                      </span>
                    </div>

                    <span className="text-sm font-medium transition group-hover:translate-x-1">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}