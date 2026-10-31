import { z } from "zod";
import { dateSchema, idSchema, optionalText, timeSchema, timestampSchema } from "./common";

export const shootDaySchema = z.object({
  id: idSchema("sd"),
  projectId: idSchema("prj"),
  date: dateSchema,
  dayNumber: z.int().positive(),
  callTime: timeSchema,
  plannedWrapTime: timeSchema,
  baseLocationId: idSchema("loc").optional(),
  status: z.enum(["draft", "published", "completed", "cancelled"]),
  actualStartTime: timeSchema.optional(),
  actualWrapTime: timeSchema.optional(),
  notes: optionalText,
  publishedAt: timestampSchema.optional(),
});

export const shootDaySceneSchema = z.object({
  id: idSchema("sds"),
  shootDayId: idSchema("sd"),
  sceneId: idSchema("scn"),
  sequenceOrder: z.int().nonnegative(),
  plannedStartTime: timeSchema.optional(),
  plannedDurationMinutes: z.int().positive().optional(),
});

export const shootDayPersonSchema = z.object({
  id: idSchema("sdp"),
  shootDayId: idSchema("sd"),
  projectPersonId: idSchema("ppl"),
  callTime: timeSchema.optional(),
  notes: optionalText,
});
