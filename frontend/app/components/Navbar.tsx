"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#f1eee5]/92 shadow-sm backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          className={`font-display text-[25px] tracking-[-0.055em] transition-colors duration-500 ${
            scrolled
              ? "text-black"
              : "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.55)]"
          }`}
        >
          spendself<span className="opacity-40">.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 text-[13px] md:flex">
          <Link
            href="/blogs"
            className={`navlink ${
              scrolled ? "navlink-light" : "navlink-dark"
            }`}
          >
            Journal
          </Link>

          <Link
            href="/#why"
            className={`navlink ${
              scrolled ? "navlink-light" : "navlink-dark"
            }`}
          >
            Why
          </Link>

          <Link
            href="/#experience"
            className={`navlink ${
              scrolled ? "navlink-light" : "navlink-dark"
            }`}
          >
            Experience
          </Link>

          <Link
            href="/#waitlist"
            className={`navlink ${
              scrolled ? "navlink-light" : "navlink-dark"
            }`}
          >
            Coming soon
          </Link>

          {/* Booking */}
          <Link
            href="/stays"
            className={`rounded-full px-5 py-2.5 text-[13px] font-medium transition-all duration-300 ${
              scrolled
                ? "bg-black text-white hover:bg-black/80"
                : "bg-white/95 text-black hover:bg-white"
            }`}
          >
            Stay With Us
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden transition-colors ${
            scrolled ? "text-black" : "text-white"
          }`}
          aria-label="Menu"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menu && (
        <div className="border-t border-black/10 bg-[#f1eee5] px-5 py-7 md:hidden">
          <div className="flex flex-col gap-6 text-lg">
            <Link href="/#why" onClick={() => setMenu(false)}>
              Why
            </Link>

            <Link href="/#experience" onClick={() => setMenu(false)}>
              Experience
            </Link>

            <Link href="/#waitlist" onClick={() => setMenu(false)}>
              Coming soon
            </Link>

            <Link
              href="/booking"
              onClick={() => setMenu(false)}
              className="mt-2 rounded-full bg-black px-5 py-3 text-center text-sm font-medium text-white"
            >
              Stay With Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}