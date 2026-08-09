"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

import { blogPosts } from "../../lib/blog";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

export default function BlogDetailsPage() {
  const params = useParams();

  const slug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug;

    console.log("slug:", slug);
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts
    .filter(
      (item) =>
        item.slug !== post.slug && item.category === post.category
    )
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f1eee5] text-[#171914]">
        <Navbar />
      <section className="relative min-h-[90svh] overflow-hidden bg-[#10130f] text-[#f5f2e9]">
        <div className="absolute inset-0">
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,5,.25)_0%,rgba(5,7,5,.18)_35%,rgba(5,7,5,.85)_100%)]" />

          <div className="film-grain absolute inset-0" />
        </div>

        <div className="absolute left-5 top-28 z-10 md:left-8">
          <Link
            href="/blogs"
            className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-white/60 transition hover:text-white"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition group-hover:bg-white group-hover:text-black">
              <ArrowLeft size={14} />
            </span>

            Back to journal
          </Link>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[90svh] max-w-[1400px] flex-col justify-end px-5 pb-10 pt-40 md:px-8 md:pb-14">
          <div className="mb-7 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-white/55">
            <span>{post.category}</span>

            <span className="h-1 w-1 rounded-full bg-white/40" />

            <span>{post.readTime}</span>
          </div>

          <h1 className="max-w-6xl font-display text-[clamp(4rem,9.5vw,10rem)] leading-[0.79] tracking-[-0.065em]">
            {post.title}
          </h1>

          <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-2xl text-base leading-7 text-white/65 md:text-xl md:leading-8">
              {post.excerpt}
            </p>

            <div className="text-right text-[10px] uppercase tracking-[0.2em] text-white/40">
              <div>{post.author}</div>
              <div className="mt-2">{post.date}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE INTRO */}
      <section className="bg-[#f1eee5] px-5 py-24 md:px-8 md:py-36">
        <div className="mx-auto grid max-w-[1100px] gap-16 md:grid-cols-[.55fr_1.45fr]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-45">
              Read slowly
            </p>

            <div className="mt-8 flex items-center gap-2 text-xs opacity-45">
              <Clock size={13} />
              {post.readTime}
            </div>
          </div>

          <div>
            <p className="font-display text-[clamp(2.4rem,4vw,4.5rem)] leading-[0.95] tracking-[-0.045em]">
              Sometimes the most important thing you can do is simply make
              some room.
            </p>
          </div>
        </div>
      </section>

      {/* ARTICLE */}
      <article className="bg-[#f1eee5] px-5 pb-28 md:px-8 md:pb-40">
        <div className="mx-auto max-w-[760px]">
          <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-normal prose-headings:tracking-[-0.04em] prose-p:leading-8 prose-p:text-black/65">
            <p>
              We live in a world that rarely asks us to stop. There is always
              another notification, another message, another task waiting for
              our attention.
            </p>

            <p>
              Somewhere along the way, being busy became a measure of how well
              we were living. The fuller the calendar, the more important the
              day seemed.
            </p>

            <h2>But what happens when you stop?</h2>

            <p>
              At first, the silence can feel uncomfortable. You reach for your
              phone without thinking. You wonder what you're missing. You feel
              the urge to fill the empty space.
            </p>

            <p>
              Give it a little longer.
            </p>

            <p>
              Eventually, something changes. You start noticing things that
              were always there: the sound outside your window, the way light
              moves across a room, a conversation that doesn't need to be
              documented.
            </p>

            <blockquote>
              The goal isn't to escape your life. It's to become present
              enough to actually experience it.
            </blockquote>

            <h2>Make some room</h2>

            <p>
              You don't need to disappear for a month. You don't need to
              abandon technology or completely change your routine.
            </p>

            <p>
              Start smaller.
            </p>

            <p>
              Put the phone away while you eat. Take a walk without
              headphones. Sit somewhere quiet for ten minutes. Let yourself
              become bored.
            </p>

            <p>
              These moments can seem insignificant. But they create something
              increasingly rare: uninterrupted attention.
            </p>

            <h2>Spend time on yourself</h2>

            <p>
              Time spent with yourself isn't wasted time. It is where you
              reconnect with your thoughts, your surroundings, and the people
              who matter to you.
            </p>

            <p>
              Maybe that's what a reset really is.
            </p>

            <p>
              Not becoming a different person.
              <br />
              Just returning to yourself.
            </p>
          </div>
        </div>
      </article>

      {/* ARTICLE FOOTER */}
      <section className="border-t border-black/10 bg-[#f1eee5] px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto flex max-w-[760px] flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40">
              Written by
            </p>

            <p className="mt-3 font-display text-3xl tracking-[-0.04em]">
              {post.author}
            </p>
          </div>

          <Link
            href="/blogs"
            className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em]"
          >
            More from the journal

            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 transition group-hover:bg-black group-hover:text-white">
              <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </section>

      {/* RELATED ARTICLES */}
      {relatedPosts.length > 0 && (
        <section className="bg-[#20261d] px-5 py-24 text-[#f3f0e7] md:px-8 md:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-12">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
                Keep reading
              </p>

              <h2 className="mt-5 max-w-3xl font-display text-[clamp(3.5rem,6vw,6.5rem)] leading-[0.84] tracking-[-0.06em]">
                More things
                <br />
                worth <em>thinking about.</em>
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blogs/${related.slug}`}
                  className="group"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={related.image}
                      alt={related.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                      {related.category}
                    </p>

                    <h3 className="mt-3 font-display text-3xl leading-[0.95] tracking-[-0.04em]">
                      {related.title}
                    </h3>

                    <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/45">
                      Read story
                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="bg-[#c9d4bf] px-5 py-28 md:px-8 md:py-40">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-45">
            SpendSelf
          </p>

          <h2 className="mt-8 max-w-6xl font-display text-[clamp(4rem,8vw,9rem)] leading-[0.78] tracking-[-0.07em]">
            Spend less time
            <br />
            looking at life.
            <br />
            <em>Spend more time living it.</em>
          </h2>

          <Link
            href="/"
            className="group mt-12 inline-flex items-center gap-3 rounded-full border border-black/20 px-6 py-3 text-[10px] uppercase tracking-[0.2em] transition hover:bg-black hover:text-white"
          >
            Explore SpendSelf

            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

    </main>
  );
}