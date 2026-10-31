/**
 * Money is always stored as integer minor units (paise for INR). These helpers
 * are the only place amounts are converted to or from display values.
 */

const PAISE_PER_RUPEE = 100;
const LAKH = 100_000;
const CRORE = 10_000_000;

/** Converts a rupee amount to integer paise, rounding to the nearest paisa. */
export function rupeesToPaise(rupees: number): number {
  if (!Number.isFinite(rupees)) throw new RangeError(`Invalid amount: ${rupees}`);
  return Math.round(rupees * PAISE_PER_RUPEE);
}

/** Full amount, e.g. `formatMoney(85000000)` → `₹8,50,000`. */
export function formatMoney(minor: number, currency = "INR"): string {
  const locale = currency === "INR" ? "en-IN" : "en-GB";
  const major = minor / PAISE_PER_RUPEE;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(major) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(major);
}

/**
 * Compact Indian notation, e.g. `₹8.5 lakh`, `₹1.2 crore`.
 * Amounts under one lakh fall back to the full format.
 */
export function formatCompactINR(paise: number): string {
  const rupees = paise / PAISE_PER_RUPEE;
  const abs = Math.abs(rupees);
  const trim = (n: number) => n.toFixed(2).replace(/\.?0+$/, "");
  if (abs >= CRORE) return `₹${trim(rupees / CRORE)} crore`;
  if (abs >= LAKH) return `₹${trim(rupees / LAKH)} lakh`;
  return formatMoney(paise, "INR");
}
