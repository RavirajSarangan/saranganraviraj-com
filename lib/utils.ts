import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with correct precedence — later conflicting utilities win.
 * This is the shadcn/ui convention; several components expect `cn` to exist here.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
