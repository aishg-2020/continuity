import { z } from "zod";
import { idSchema, optionalText } from "./common";

export const SHOT_SIZES = [
  "extreme_wide",
  "wide",
  "medium",
  "close_up",
  "extreme_close_up",
  "other",
] as const;

export const shotSchema = z.object({
  id: idSchema("sht"),
  projectId: idSchema("prj"),
  sceneId: idSchema("scn"),
  /** Unique within its scene (PRD §8.9). */
  shotNumber: z.string().trim().min(1).max(12),
  description: z.string().trim().min(1).max(500),
  shotSize: z.enum(SHOT_SIZES),
  cameraAngle: z.string().trim().max(60).optional(),
  cameraMovement: z.string().trim().max(60).optional(),
  lens: z.string().trim().max(30).optional(),
  rigNotes: optionalText,
  setupEstimateMinutes: z.int().nonnegative().optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["planned", "ready", "shot", "retake"]),
  sortOrder: z.int().nonnegative(),
  referenceImageUrl: z.string().optional(),
  notes: optionalText,
});

export const storyboardFrameSchema = z.object({
  id: idSchema("sbf"),
  projectId: idSchema("prj"),
  sceneId: idSchema("scn").optional(),
  shotId: idSchema("sht").optional(),
  frameNumber: z.int().positive(),
  imageUrl: z.string(),
  description: optionalText,
  cameraNotes: optionalText,
  sortOrder: z.int().nonnegative(),
});
