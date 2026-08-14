"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { nav, site } from "@/content/site";
import { ThemeToggle } from "./theme-toggle";

/**
 * The bar is transparent over the hero and only acquires a background and a
 * hairline once you have scrolled past it — so the hero stays uninterrupted.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the mobile sheet
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape closes the sheet
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? "border-b border-line bg-ink/80 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div className="shell flex h-[72px] items-center justify-between">
          <Link
            href="/"
            className="font-display text-xl tracking-[-0.015em] text-fg transition-colors duration-300 hover:text-accent"
          >
            {site.name}
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-10 md:flex"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="label link-underline text-fg/80 transition-colors duration-300 hover:text-fg"
              >
                {item.label}
              </Link>
            ))}
            <span className="flex items-center gap-2.5">
              <span className="relative flex h-1.5 w-1.5">
                {!reduced && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                )}
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="label text-accent">
                {site.availability.open ? "Available" : "Booked"}
              </span>
            </span>
            <ThemeToggle />
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="label -mr-2 px-2 py-2 text-fg"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <motion.div
        id="mobile-menu"
        initial={false}
        animate={open ? "open" : "closed"}
        variants={{
          open: { opacity: 1, pointerEvents: "auto" },
          closed: { opacity: 0, pointerEvents: "none" },
        }}
        transition={{ duration: reduced ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-40 bg-ink md:hidden"
        aria-hidden={!open}
      >
        <div className="shell flex h-full flex-col justify-center gap-2">
          {nav.map((item, i) => (
            <motion.div
              key={item.href}
              variants={{
                open: {
                  y: 0,
                  opacity: 1,
                  transition: { delay: reduced ? 0 : 0.08 + i * 0.06 },
                },
                closed: { y: 20, opacity: 0 },
              }}
            >
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="font-display block py-3 text-[clamp(2.5rem,12vw,4rem)] leading-[1.05] tracking-[-0.025em] text-fg"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
          <div className="mt-10 border-t border-line pt-6">
            <a
              href={`mailto:${site.email}`}
              tabIndex={open ? 0 : -1}
              className="label text-accent"
            >
              {site.email}
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
}
