import { getResult, toCounts } from "./scoring";

// --- all-same sweeps ---
test("all a → firefighter", () => {
  expect(getResult({ a: 12, b: 0, c: 0, d: 0 })).toBe("firefighter");
});

test("all b → bottleneck", () => {
  expect(getResult({ a: 0, b: 12, c: 0, d: 0 })).toBe("bottleneck");
});

test("all c → badge_wearer", () => {
  expect(getResult({ a: 0, b: 0, c: 12, d: 0 })).toBe("badge_wearer");
});

test("all d → recovering_workaholic", () => {
  expect(getResult({ a: 0, b: 0, c: 0, d: 12 })).toBe("recovering_workaholic");
});

// --- tie-break: b beats everything ---
test("a=b tie → bottleneck (b wins)", () => {
  expect(getResult({ a: 6, b: 6, c: 0, d: 0 })).toBe("bottleneck");
});

test("b=c tie → bottleneck (b wins)", () => {
  expect(getResult({ a: 0, b: 6, c: 6, d: 0 })).toBe("bottleneck");
});

test("b=d tie → bottleneck (b wins)", () => {
  expect(getResult({ a: 0, b: 6, c: 0, d: 6 })).toBe("bottleneck");
});

test("a=b=c=d tie → bottleneck (b wins all ties)", () => {
  expect(getResult({ a: 3, b: 3, c: 3, d: 3 })).toBe("bottleneck");
});

// --- tie-break: a beats c and d (b not in contention) ---
test("a=c tie, b lower → firefighter (a beats c)", () => {
  expect(getResult({ a: 6, b: 0, c: 6, d: 0 })).toBe("firefighter");
});

test("a=d tie, b lower → firefighter (a beats d)", () => {
  expect(getResult({ a: 6, b: 0, c: 0, d: 6 })).toBe("firefighter");
});

test("a=c=d tie, b lower → firefighter (a beats c and d)", () => {
  expect(getResult({ a: 4, b: 0, c: 4, d: 4 })).toBe("firefighter");
});

// --- tie-break: c beats d (a and b not in contention) ---
test("c=d tie, a/b lower → badge_wearer (c beats d)", () => {
  expect(getResult({ a: 0, b: 0, c: 6, d: 6 })).toBe("badge_wearer");
});

// --- toCounts helper ---
test("toCounts maps indices correctly", () => {
  // 12 answers all picking option 1 (b)
  const allB = Array(12).fill(1);
  expect(toCounts(allB)).toEqual({ a: 0, b: 12, c: 0, d: 0 });
});

test("toCounts handles mixed answers", () => {
  const answers = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3]; // 3 of each
  expect(toCounts(answers)).toEqual({ a: 3, b: 3, c: 3, d: 3 });
});
