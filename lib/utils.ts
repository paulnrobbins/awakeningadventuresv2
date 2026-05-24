import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Standard cn() helper — merge Tailwind classes with conflict resolution.
 * Used by every UI component so duplicate utilities collapse cleanly.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Clamp a number between min and max. */
export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/** Map a value from one range to another. */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  const t = (value - inMin) / (inMax - inMin);
  return outMin + (outMax - outMin) * t;
}

/** Map a value through smoothstep — used for non-linear scroll mapping. */
export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}
