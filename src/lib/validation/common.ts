import { z } from "zod";

/** Stable, prefixed record ID, e.g. `prj_01`, `scn_a1b2c3d4`. */
export const idSchema = (prefix: string) =>
  z
    .string()
    .regex(new RegExp(`^${prefix}_[a-z0-9]+$`), `Expected an ID starting with "${prefix}_"`);

/** UTC timestamp, ISO 8601 ending in `Z`. */
export const timestampSchema = z.iso.datetime();

/** Calendar date without time, `YYYY-MM-DD`. Interpreted in the project time zone. */
export const dateSchema = z.iso.date();

/** Wall-clock time, `HH:MM`, interpreted in the project time zone. */
export const timeSchema = z.iso.time({ precision: -1 });

/** Money in integer minor units (paise for INR). Never floats. */
export const moneySchema = z.int().nonnegative();

export const currencySchema = z.enum(["INR", "USD", "EUR", "GBP"]);

export const optionalText = z.string().trim().max(5000).optional();
