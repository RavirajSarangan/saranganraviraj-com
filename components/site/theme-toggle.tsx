"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

/**
 * Light/dark switch.
 *
 * The rendered state depends on localStorage, which the server cannot know, so the
 * button renders a neutral placeholder until mounted. Skipping that guard is the
 * classic next-themes hydration mismatch.
 *
 * `resolvedTheme` rather than `theme`: when the user is on "system", `theme` is the
 * string "system" and tells us nothing about what is actually on screen.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  // "Have we hydrated yet?" without a setState-in-effect: the server snapshot is
  // false and the client snapshot is true, so React resolves it during hydration.
  const mounted = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={
        mounted
          ? `Switch to ${isDark ? "light" : "dark"} theme`
          : "Switch colour theme"
      }
      // Reflects state for assistive tech without needing a visible label
      aria-pressed={mounted ? isDark : undefined}
      className={`group relative grid h-9 w-9 place-items-center rounded-full border border-line text-fg/70 transition-colors duration-500 hover:border-accent hover:text-accent ${className}`}
    >
      {/* Both icons are always present; only the transform differs, so there is no
          layout shift and nothing to load when the theme changes. */}
      <span
        aria-hidden
        className={`absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mounted && !isDark
            ? "scale-100 rotate-0 opacity-100"
            : "scale-50 -rotate-90 opacity-0"
        }`}
      >
        <SunIcon />
      </span>
      <span
        aria-hidden
        className={`absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mounted && isDark
            ? "scale-100 rotate-0 opacity-100"
            : "scale-50 rotate-90 opacity-0"
        }`}
      >
        <MoonIcon />
      </span>
    </button>
  );
}

/** Never emits; the snapshot alone distinguishes server from client. */
function subscribeNever() {
  return () => {};
}

function SunIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.4v2.2M12 19.4v2.2M4.2 12H2M22 12h-2.2M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.5 14.2A8.6 8.6 0 1 1 9.8 3.5a6.9 6.9 0 0 0 10.7 10.7Z" />
    </svg>
  );
}
