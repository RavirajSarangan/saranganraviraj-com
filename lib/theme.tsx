"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * Theming is driven by a `data-theme` attribute on <html>, matching the
 * `[data-theme="dark"]` block in globals.css.
 *
 * `defaultTheme="system"` means a first-time visitor gets whatever their OS is set
 * to, and `enableSystem` keeps following it until they make an explicit choice.
 *
 * next-themes injects a blocking inline script before paint, which is what prevents
 * the flash of the wrong theme — the alternative (reading localStorage in an effect)
 * always paints one frame of the default first.
 *
 * `disableTransitionOnChange` suppresses CSS transitions for the swap itself;
 * without it every transitioned property on the page animates at once and the
 * toggle feels like a slow dissolve rather than a switch.
 */
export function Theme({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
