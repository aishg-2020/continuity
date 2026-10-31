import { describe, expect, it } from "vitest";
import { formatCompactINR, formatMoney, rupeesToPaise } from "./money";

describe("rupeesToPaise", () => {
  it("converts to integer paise", () => {
    expect(rupeesToPaise(850000)).toBe(85_000_000);
    expect(rupeesToPaise(19.99)).toBe(1999);
  });

  it("rounds away floating-point noise", () => {
    expect(rupeesToPaise(0.1 + 0.2)).toBe(30);
  });

  it("rejects non-finite input", () => {
    expect(() => rupeesToPaise(Number.NaN)).toThrow(RangeError);
  });
});

describe("formatMoney", () => {
  it("uses Indian digit grouping for INR", () => {
    expect(formatMoney(85_000_000)).toBe("₹8,50,000");
  });

  it("shows paise only when present", () => {
    expect(formatMoney(12_345)).toBe("₹123.45");
  });
});

describe("formatCompactINR", () => {
  it.each([
    [85_000_000, "₹8.5 lakh"],
    [350_000_000, "₹35 lakh"],
    [1_200_000_000, "₹1.2 crore"],
    [5_000_000, "₹50,000"],
  ])("formats %i paise as %s", (paise, expected) => {
    expect(formatCompactINR(paise)).toBe(expected);
  });
});
