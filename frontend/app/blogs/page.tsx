"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";

import BlogCard from "../components/blog/BlogCard";
import Navbar from "../components/Navbar";
import { getBlogPosts } from "../services/blogServices";
import { categories } from "../lib/blog";


export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] =
    useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getBlogPosts();
        const result =  response.data;
        if (!response.success) {
            throw new Error("failed to load blog posts");
        }

        setPosts(result || []);
      } catch (err) {
        console.error(
          "Failed to load blog:",
          err
        );

        setError(
          "Unable to load the journal right now."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, []);


  const featuredPost = posts.find(
    (post) =>
      Boolean(post.featured) === true
  );

  /*
   * ============================================================
   * FILTER POSTS
   * ============================================================
   */

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (Boolean(post.featured)) {
        return false;
      }

      if (activeCategory === "All") {
        return true;
      }

      return (
        post.category === activeCategory
      );
    });
  }, [posts, activeCategory]);

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <main className="min-h-screen bg-[#f1eee5]">
      <Navbar />

      {/* HERO */}

      <section className="relative min-h-[100svh] overflow-hidden bg-[#10130f] text-[#f5f2e9]">
        <div className="absolute inset-0">
          <video
            className="hero-video absolute inset-0"
            src="/videos/himalayan-hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,5,.30)_0%,rgba(5,7,5,.10)_35%,rgba(5,7,5,.78)_100%)]" />

          <div className="film-grain absolute inset-0" />
        </div>

        <div className="absolute left-5 top-28 z-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/50 md:left-8">
          <span className="signal-dot" />
          The SpendSelf Journal
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-5 pb-8 pt-40 md:px-8 md:pb-10">
          <div className="hero-kicker mb-7 text-xs uppercase tracking-[0.28em] text-white/55">
            Stories for a slower life
          </div>

          <h1 className="max-w-6xl font-display text-[clamp(4.2rem,11.2vw,10.5rem)] leading-[0.79] tracking-[-0.065em]">
            Spend a little
            <br />
            more time
            <br />
            <em>with yourself.</em>
          </h1>

          <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-[500px] text-[15px] leading-7 text-white/72 md:text-lg">
              Ideas, stories, and practical thoughts
              about disconnecting, resetting, and
              making room for the things that actually
              matter.
            </p>

            <a
              href="#journal"
              className="group flex items-center gap-3 text-[11px] uppercase tracking-[0.24em]"
            >
              Explore the journal

              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 transition duration-300 group-hover:bg-white group-hover:text-black">
                <ArrowDown size={15} />
              </span>
            </a>
          </div>
        </div>
      </section>


      <section
        id="journal"
        className="relative overflow-hidden bg-[#11140f] px-5 py-24 text-[#f3f0e7] md:px-8 md:py-32"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-16 md:grid-cols-[.7fr_1.8fr]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
                A small reminder
              </p>

              <div className="mt-8 flex items-center gap-3 text-sm text-white/50">
                <span className="pulse-ring" />
                Take your time.
              </div>
            </div>

            <h2 className="font-display text-[clamp(3.2rem,7vw,7.2rem)] leading-[0.86] tracking-[-0.055em]">
              You don't need
              <br />
              more information.
              <br />
              You might need{" "}
              <em>more space.</em>
            </h2>
          </div>
        </div>
      </section>


      {featuredPost && (
        <section className="bg-[#f1eee5] px-5 py-20 md:px-8 md:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-12">
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-45">
                Featured
              </p>
            </div>

            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group grid overflow-hidden bg-[#20261d] text-[#f3f0e7] md:grid-cols-2"
            >
              <div className="aspect-[4/3] overflow-hidden md:aspect-auto">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col justify-center px-7 py-12 md:px-12 lg:px-20">
                <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em]">
                  <span>
                    {featuredPost.category}
                  </span>

                  <span className="h-1 w-1 rounded-full bg-white/30" />

                  <span className="text-white/40">
                    {featuredPost.readTime}
                  </span>
                </div>

                <h2 className="max-w-2xl font-display text-[clamp(3rem,5vw,5.8rem)] leading-[0.86] tracking-[-0.055em]">
                  {featuredPost.title}
                </h2>

                <p className="mt-7 max-w-lg text-base leading-7 text-white/55 md:text-lg">
                  {featuredPost.excerpt}
                </p>

                <div className="mt-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em]">
                  Read the story

                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}


      <section className="bg-[#f1eee5] px-5 pb-28 md:px-8 md:pb-40">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-45">
                The journal
              </p>

              <h2 className="mt-5 font-display text-[clamp(3.5rem,6vw,6.5rem)] leading-[0.85] tracking-[-0.06em]">
                Things worth
                <br />
                <em>thinking about.</em>
              </h2>
            </div>

            <div className="flex max-w-full gap-2 overflow-x-auto pb-2">
              {categories.map(
                (category) => {
                  const active =
                    category ===
                    activeCategory;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        setActiveCategory(
                          category
                        )
                      }
                      className={`whitespace-nowrap rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.15em] transition ${
                        active
                          ? "border-[#171914] bg-[#171914] text-white"
                          : "border-black/10 bg-transparent text-black/50 hover:border-black/30 hover:text-black"
                      }`}
                    >
                      {category}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* LOADING */}

          {loading && (
            <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="animate-pulse"
                  >
                    <div className="aspect-[4/3] bg-black/5" />

                    <div className="mt-5 h-3 w-20 bg-black/5" />

                    <div className="mt-4 h-10 w-4/5 bg-black/5" />

                    <div className="mt-4 h-4 w-full bg-black/5" />
                    <div className="mt-2 h-4 w-3/4 bg-black/5" />
                  </div>
                )
              )}
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="border-y border-black/10 py-20 text-center">
              <p className="text-sm opacity-50">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="mt-5 rounded-full border border-black/15 px-5 py-2 text-[10px] uppercase tracking-[0.15em] transition hover:bg-black hover:text-white"
              >
                Try again
              </button>
            </div>
          )}

          {/* POSTS */}

          {!loading &&
            !error &&
            filteredPosts.length > 0 && (
              <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map(
                  (post) => (
                    <BlogCard
                      key={post.slug}
                      post={post}
                    />
                  )
                )}
              </div>
            )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            filteredPosts.length === 0 && (
              <div className="border-y border-black/10 py-20 text-center">
                <p className="text-sm opacity-50">
                  Nothing here yet. Check
                  back soon.
                </p>
              </div>
            )}
        </div>
      </section>

      {/* PHILOSOPHY / CTA */}

      <section className="relative overflow-hidden bg-[#c9d4bf] px-5 py-28 md:px-8 md:py-40">
        <div className="future-image absolute inset-0 opacity-20" />

        <div className="relative mx-auto max-w-[1400px]">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-50">
            The SpendSelf idea
          </p>

          <h2 className="mt-8 max-w-6xl font-display text-[clamp(4rem,9vw,10rem)] leading-[0.78] tracking-[-0.07em]">
            The best parts
            <br />
            of life aren't
            <br />
            <em>on your screen.</em>
          </h2>

          <div className="mt-12 max-w-xl text-sm leading-7 opacity-60">
            SpendSelf exists to help you make
            room for those moments again. Not
            by escaping the world, but by
            remembering to actually be in it.
          </div>

          <Link
            href="/"
            className="group mt-10 inline-flex items-center gap-3 rounded-full border border-black/20 px-6 py-3 text-[10px] uppercase tracking-[0.2em] transition hover:bg-black hover:text-white"
          >
            Discover SpendSelf

            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {/* NEWSLETTER */}

      <section className="bg-[#171914] px-5 py-28 text-[#f2efe7] md:px-8 md:py-40">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-16 md:grid-cols-[1.25fr_.75fr]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                Stay awhile
              </p>

              <h2 className="mt-8 max-w-5xl font-display text-[clamp(4rem,8vw,9rem)] leading-[0.78] tracking-[-0.07em]">
                A little inspiration for
                your
                <em> next reset.</em>
              </h2>
            </div>

            <div className="flex flex-col justify-end">
              <p className="max-w-sm text-sm leading-6 text-white/50">
                New stories about slowing down,
                digital wellness, mindfulness,
                and spending more meaningful
                time with yourself.
              </p>

              <form className="mt-8">
                <div className="flex border-b border-white/20 py-3">
                  <input
                    type="email"
                    required
                    placeholder="Your email"
                    className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/30"
                  />

                  <button
                    type="submit"
                    className="ml-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] transition hover:text-white/60"
                  >
                    Join
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>

              <p className="mt-5 text-[10px] text-white/25">
                No noise. Just things worth
                reading.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}