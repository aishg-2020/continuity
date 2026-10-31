import { z } from "zod";
import { idSchema, optionalText } from "./common";

export const DEPARTMENTS = [
  "direction",
  "production",
  "camera",
  "lighting",
  "sound",
  "art",
  "costume",
  "makeup_hair",
  "locations",
  "transport",
  "post_production",
  "other",
] as const;

export const personSchema = z.object({
  id: idSchema("per"),
  workspaceId: idSchema("wsp"),
  fullName: z.string().trim().min(1).max(160),
  email: z.email().optional(),
  phone: z.string().trim().max(30).optional(),
  personType: z.enum(["cast", "crew", "vendor", "other"]),
  department: z.enum(DEPARTMENTS).optional(),
  profileImageUrl: z.string().optional(),
  /** Restricted: excluded from general views and exports (PRD §8.6). */
  emergencyContact: z.string().trim().max(200).optional(),
  notes: optionalText,
});

export const projectPersonSchema = z.object({
  id: idSchema("ppl"),
  projectId: idSchema("prj"),
  personId: idSchema("per"),
  roleName: z.string().trim().max(120).optional(),
  characterName: z.string().trim().max(120).optional(),
  confirmationStatus: z.enum(["invited", "confirmed", "tentative", "unavailable"]),
  availabilityNotes: optionalText,
});
