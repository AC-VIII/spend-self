"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { getTestimonials } from "../../services/testimonialServices";


export default function Testimonials() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>([]);

  const [active, setActive] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      try {
       const data = await getTestimonials();

        setTestimonials(
          data || []
        );
      } catch (error) {
        console.error(
          "Failed to load testimonials:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadTestimonials();
  }, []);

  if (loading) {
    return null;
  }

  if (testimonials.length === 0) {
    return null;
  }

  const testimonial =
    testimonials[active];

  function previous() {
    setActive((current) =>
      current === 0
        ? testimonials.length - 1
        : current - 1
    );
  }

  function next() {
    setActive((current) =>
      current === testimonials.length - 1
        ? 0
        : current + 1
    );
  }

  return (
    <section className="overflow-hidden bg-[#f1eee5] px-5 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-16 md:grid-cols-[.55fr_1.45fr]">
          {/* LEFT */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-45">
              Words from people
            </p>

            <div className="mt-8 flex items-center gap-3 text-sm opacity-45">
              <span className="pulse-ring" />
              Real experiences.
            </div>

            <div className="mt-16 hidden md:block">
              <div className="text-[10px] uppercase tracking-[0.2em] opacity-35">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(testimonials.length).padStart(
                  2,
                  "0"
                )}
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={previous}
                  aria-label="Previous testimonial"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 transition hover:bg-black hover:text-white"
                >
                  <ArrowLeft size={14} />
                </button>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Next testimonial"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 transition hover:bg-black hover:text-white"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <Quote
              size={42}
              strokeWidth={1}
              className="opacity-15"
            />

            <blockquote className="mt-7 max-w-5xl font-display text-[clamp(2.8rem,5.5vw,6rem)] leading-[0.88] tracking-[-0.055em]">
              “{testimonial.quote}”
            </blockquote>

            <div className="mt-12 flex flex-col gap-6 border-t border-black/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {testimonial.image ? (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#20261d] text-sm text-white">
                    {testimonial.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium">
                    {testimonial.name}
                  </p>

                  {(testimonial.role ||
                    testimonial.location) && (
                    <p className="mt-1 text-[10px] uppercase tracking-[0.15em] opacity-40">
                      {[
                        testimonial.role,
                        testimonial.location,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-1">
                {Array.from({
                  length: testimonial.rating,
                }).map((_, index) => (
                  <span
                    key={index}
                    className="text-sm"
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* MOBILE CONTROLS */}
            <div className="mt-8 flex items-center justify-between md:hidden">
              <div className="text-[10px] uppercase tracking-[0.2em] opacity-35">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(testimonials.length).padStart(
                  2,
                  "0"
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={previous}
                  aria-label="Previous testimonial"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15"
                >
                  <ArrowLeft size={14} />
                </button>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Next testimonial"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mt-16 flex gap-2">
          {testimonials.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show testimonial ${
                index + 1
              }`}
              className="group h-1 flex-1 overflow-hidden rounded-full bg-black/10"
            >
              <span
                className={`block h-full rounded-full transition-all duration-500 ${
                  index === active
                    ? "w-full bg-black"
                    : "w-0 bg-black"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}