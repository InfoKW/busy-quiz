import type { ResultType } from "./results";

export type Counts = { a: number; b: number; c: number; d: number };

// Ordered, first-match-wins tie-break logic from spec Section 5.3.
// b beats every tie, then a, then c, then d.
export function getResult(counts: Counts): ResultType {
  const { a, b, c, d } = counts;
  if (b >= a && b >= c && b >= d) return "bottleneck";
  if (a >= c && a >= d) return "firefighter";
  if (c >= d) return "badge_wearer";
  return "recovering_workaholic";
}

// Build a Counts object from an array of 0-based option indices (0=a, 1=b, 2=c, 3=d).
export function toCounts(answers: number[]): Counts {
  const counts: Counts = { a: 0, b: 0, c: 0, d: 0 };
  const keys: (keyof Counts)[] = ["a", "b", "c", "d"];
  for (const idx of answers) {
    if (idx >= 0 && idx <= 3) counts[keys[idx]]++;
  }
  return counts;
}
