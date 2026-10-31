import { z } from "zod";
import { idSchema, optionalText } from "./common";

export const TIMES_OF_DAY = ["day", "night", "dawn", "dusk", "continuous", "other"] as const;
export const SCENE_STATUSES = [
  "not_planned",
  "ready",
  "scheduled",
  "shot",
  "needs_pickup",
] as const;

export const sceneSchema = z.object({
  id: idSchema("scn"),
  projectId: idSchema("prj"),
  sceneNumber: z.string().trim().min(1).max(12),
  slugline: z.string().trim().min(1).max(200),
  intExt: z.enum(["int", "ext", "int_ext"]),
  timeOfDay: z.enum(TIMES_OF_DAY),
  locationId: idSchema("loc").optional(),
  pageReference: z.string().trim().max(20).optional(),
  summary: optionalText,
  characterIds: z.array(idSchema("ppl")),
  estimatedDurationMinutes: z.int().positive().optional(),
  /** Allows the scene on more than one shoot day (split / multiple setup, PRD §8.10). */
  allowSplit: z.boolean(),
  status: z.enum(SCENE_STATUSES),
  sortOrder: z.int().nonnegative(),
  notes: optionalText,
  referenceImageUrls: z.array(z.string()),
});

export const BREAKDOWN_CATEGORIES = [
  "cast",
  "extras",
  "props",
  "wardrobe",
  "makeup_hair",
  "set_dressing",
  "vehicles",
  "locations",
  "camera_grip_lighting",
  "sound",
  "stunts_sfx",
  "animals",
  "other",
] as const;

export const sceneBreakdownItemSchema = z.object({
  id: idSchema("bdi"),
  projectId: idSchema("prj"),
  /** One item can be needed by several scenes (PRD §8.5). */
  sceneIds: z.array(idSchema("scn")).min(1),
  category: z.enum(BREAKDOWN_CATEGORIES),
  name: z.string().trim().min(1).max(160),
  description: optionalText,
  quantity: z.int().positive(),
  department: z.string().trim().max(60).optional(),
  status: z.enum(["required", "sourced", "ready", "unavailable"]),
});
