import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  Check,
  MapPin,
  Users,
} from "lucide-react";

import { getStay } from "../../services/stayServices";
import BookingPanelTrigger from "../../components/booking/BookingPanelTrigger";
import ScrollToBooking from "../../components/booking/ScrollToBooking";
import VirtualExperience from "../../components/booking/VirtualExperience";
import Navbar from "../../components/Navbar";



type StayDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StayDetailsPage({
  params,
}: StayDetailsPageProps) {
  const { id } = await params;

  let stay: Stay;

  

  try {
    const response = await getStay(id);

    if (!response.success || !response.stay) {
      notFound();
    }

    stay = response.stay;

    console.log("Stay details loaded:", stay);
  } catch (error) {
    console.error("Failed to load stay:", error);
    notFound();
  }

  const amenities = stay.amenities || [];

  const uniqueAmenities = [
  ...new Set(amenities),
];

  /*
   * ---------------------------------------------------------
   * MEDIA
   * ---------------------------------------------------------
   *
   * We support both:
   *
   * gallery: ["image1.jpg", "image2.jpg"]
   *
   * OR:
   *
   * gallery: [
   *   {
   *     url: "image1.jpg",
   *     title: "The lake"
   *   }
   * ]
   */

  const gallery: StayMedia[] = (
    stay.gallery || []
  ).map((item, index) => {
    if (typeof item === "string") {
      return {
        id: index,
        url: item,
      };
    }

    return item;
  });

  /*
   * Temporary fallback:
   *
   * Until the backend provides gallery images,
   * use the existing image_url.
   */
  const galleryImages =
    gallery.length > 0
      ? gallery
      : stay.image_url
        ? [
            {
              id: 0,
              url: stay.image_url,
            },
          ]
        : [];

  const virtualExperience =
    stay.virtual_experience;

  return (
    <main className="min-h-screen bg-[#f1eee5] text-black">
      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      {/* =====================================================
          FULL SCREEN HERO
      ====================================================== */}

      <section className="relative min-h-[100svh] overflow-hidden bg-black text-white">

        {/* Background video */}
        {stay.video_url ? (
          <video
            src={stay.video_url}
            autoPlay
            muted
            loop
            playsInline
            poster={
              stay.image_url || undefined
            }
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : stay.image_url ? (
          <img
            src={stay.image_url}
            alt={stay.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-black" />
        )}

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/5 to-black/75" />

        {/* Hero content */}
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-5 pb-8 pt-40 md:px-8 md:pb-10">

          {/* Back */}
          <Link
            href="/stays"
            className="mb-8 flex w-fit items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/55 transition hover:text-white"
          >
            <ArrowLeft size={14} />
            All stays
          </Link>

          {/* Location */}
          <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/55">
            <MapPin
              size={13}
              strokeWidth={1.5}
            />

            {stay.location}
          </div>

          {/* Stay name */}
          <h1 className="max-w-6xl font-display text-[clamp(4.2rem,11.2vw,10.5rem)] leading-[0.79] tracking-[-0.065em]">
            {stay.name}
          </h1>

          {/* Bottom content */}
          <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">

            <p className="max-w-[500px] text-[15px] leading-7 text-white/72 md:text-lg">
              {stay.short_description ||
                stay.description}
            </p>

            <Link
              href="#stay"
              className="group flex w-fit items-center gap-3 text-[11px] uppercase tracking-[0.24em]"
            >
              Explore this stay

              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 transition duration-300 group-hover:bg-white group-hover:text-black">
                <ArrowDown size={15} />
              </span>
            </Link>

          </div>
        </div>

        {/* Video indicator */}
        {stay.video_url && (
          <div className="absolute bottom-7 right-6 hidden items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            Cinematic preview
          </div>
        )}
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <section
        id="stay"
        className="mx-auto max-w-[1400px] px-5 pb-28 pt-20 md:px-8 md:pt-28"
      >

        {/* ===================================================
            INTRO + BOOKING
        ==================================================== */}

        <div className="grid gap-16 lg:grid-cols-[1fr_440px]">

          {/* Introduction */}
          <div>

            <div className="max-w-3xl">
              <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                About this stay
              </p>

              <h2 className="mt-5 font-display text-4xl leading-[0.95] tracking-[-0.045em] md:text-6xl">
                A place to
                <br />
                slow down.
              </h2>

              <p className="mt-8 max-w-2xl text-[15px] leading-8 text-black/55 md:text-lg">
                {stay.description}
              </p>
            </div>

            {/* Stay facts */}
            <div className="mt-14 grid max-w-3xl border-y border-black/10 sm:grid-cols-2">

              <div className="border-b border-black/10 py-7 sm:border-b-0 sm:border-r sm:pr-8">
                <Users
                  size={20}
                  strokeWidth={1.4}
                  className="text-black/40"
                />

                <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-black/40">
                  Guests
                </p>

                <p className="mt-2 text-lg font-medium">
                  Up to {stay.max_guests}{" "}
                  {stay.max_guests === 1
                    ? "guest"
                    : "guests"}
                </p>
              </div>

              <div className="py-7 sm:pl-8">
                <MapPin
                  size={20}
                  strokeWidth={1.4}
                  className="text-black/40"
                />

                <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-black/40">
                  Location
                </p>

                <p className="mt-2 text-lg font-medium">
                  {stay.location}
                </p>
              </div>

            </div>
          </div>

          {/* =================================================
              BOOKING CARD
          ================================================== */}

          <aside id="booking" className="lg:sticky lg:top-8 lg:self-start">

            <div className="rounded-[30px] bg-white p-8 shadow-[0_25px_80px_rgba(0,0,0,0.07)]">

              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">
                    Your stay
                  </p>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-medium tracking-tight">
                      {stay.currency}{" "}
                      {Number(
                        stay.price_per_night
                      ).toLocaleString()}
                    </span>

                    <span className="text-sm text-black/40">
                      / night
                    </span>
                  </div>
                </div>

                <div className="rounded-full bg-black/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-black/45">
                  Request
                </div>
              </div>

              <div className="my-7 h-px bg-black/10" />

              <p className="text-sm leading-7 text-black/45">
                Choose your dates and tell us
                a little about yourself. We'll
                take care of the rest.
              </p>

              <BookingPanelTrigger
                stay={stay}
              />

              <p className="mt-4 text-center text-[11px] leading-5 text-black/30">
                No payment required to request
                your stay.
              </p>

            </div>

          </aside>

        </div>

        {/* ===================================================
            GALLERY
        ==================================================== */}

        {galleryImages.length > 0 && (
          <section className="">

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                  The place
                </p>

                <h2 className="mt-5 font-display text-4xl leading-[0.95] tracking-[-0.045em] md:text-6xl">
                  Take a look
                  <br />
                  around.
                </h2>
              </div>

              <p className="max-w-sm text-sm leading-7 text-black/40">
                A glimpse into the spaces,
                surroundings and little details
                that make this stay different.
              </p>

            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-12">

              {/* Main image */}
              {galleryImages[0] && (
                <div className="group overflow-hidden rounded-[30px] md:col-span-7">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={galleryImages[0].url}
                      alt={
                        galleryImages[0].title ||
                        stay.name
                      }
                      className="h-full w-full object-cover transition duration-1000 ease-out group-hover:scale-[1.035]"
                    />

                    {galleryImages[0].title && (
                      <div className="absolute bottom-5 left-5 rounded-full bg-black/30 px-4 py-2 text-xs text-white backdrop-blur-md">
                        {galleryImages[0].title}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Secondary images */}
              <div className="grid gap-5 md:col-span-5">

                {galleryImages[1] && (
                  <div className="group overflow-hidden rounded-[30px]">
                    <div className="relative aspect-[5/3] overflow-hidden">
                      <img
                        src={galleryImages[1].url}
                        alt={
                          galleryImages[1].title ||
                          stay.name
                        }
                        className="h-full w-full object-cover transition duration-1000 ease-out group-hover:scale-[1.035]"
                      />
                    </div>
                  </div>
                )}

                {galleryImages[2] && (
                  <div className="group overflow-hidden rounded-[30px]">
                    <div className="relative aspect-[5/3] overflow-hidden">
                      <img
                        src={galleryImages[2].url}
                        alt={
                          galleryImages[2].title ||
                          stay.name
                        }
                        className="h-full w-full object-cover transition duration-1000 ease-out group-hover:scale-[1.035]"
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* Wide image */}
              {galleryImages[3] && (
                <div className="group overflow-hidden rounded-[30px] md:col-span-12">
                  <div className="relative aspect-[16/6] overflow-hidden">
                    <img
                      src={galleryImages[3].url}
                      alt={
                        galleryImages[3].title ||
                        stay.name
                      }
                      className="h-full w-full object-cover transition duration-1000 ease-out group-hover:scale-[1.035]"
                    />
                  </div>
                </div>
              )}

            </div>
          </section>
        )}

        {/* ===================================================
            AMENITIES
        ==================================================== */}

        {uniqueAmenities.length > 0 && (
          <section className="">

            <div className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                Included
              </p>

              <h2 className="mt-5 font-display text-4xl leading-[0.95] tracking-[-0.045em] md:text-6xl">
                Everything you
                <br />
                need. Nothing more.
              </h2>
            </div>

            <div className="mt-12 grid border-t border-black/10 sm:grid-cols-2 lg:grid-cols-3">

              {uniqueAmenities.map(
                (amenity, index) => (
                  <div
                    key={amenity}
                    className={`flex items-center gap-4 border-b border-black/10 py-5 ${
                      index % 3 !== 0
                        ? "lg:pl-8"
                        : ""
                    }`}
                  >
                    <Check
                      size={16}
                      strokeWidth={1.5}
                      className="text-black/35"
                    />

                    <span className="text-sm">
                      {amenity}
                    </span>
                  </div>
                )
              )}

            </div>
          </section>
        )}

        {/* ===================================================
            VIRTUAL EXPERIENCE
        ==================================================== */}

       {virtualExperience && (
  <section className="mt-32">
    <div className="overflow-hidden rounded-[34px] bg-black text-white">
      <VirtualExperience
        videoUrl={virtualExperience.video_url}
        poster={
          virtualExperience.thumbnail_url ||
          stay.image_url
        }
      />
    </div>
  </section>
)}

        {/* ===================================================
            FINAL CTA
        ==================================================== */}

        <section className="mt-32">
  <div className="relative overflow-hidden rounded-[34px] bg-[#ded9cc] px-7 py-20 text-center md:px-12 md:py-28">

    <div className="relative z-10">

  <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
    Your time starts here
  </p>

  <h2 className="mx-auto mt-6 max-w-4xl font-display text-4xl leading-[0.92] tracking-[-0.05em] md:text-7xl">
    Maybe you don't need
    <br />
    another vacation.
    <br />
    <em>Maybe you need a pause.</em>
  </h2>

  <p className="mx-auto mt-7 max-w-lg text-sm leading-7 text-black/45">
    Spend a little time away from
    everything and a little more time
    with yourself.
  </p>

  <ScrollToBooking />

</div>

  </div>
</section>

      </section>
    </main>
  );
}