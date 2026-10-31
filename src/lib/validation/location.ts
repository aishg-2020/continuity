import { z } from "zod";
import { idSchema, optionalText } from "./common";

export const PERMISSION_STATUSES = [
  "not_contacted",
  "enquiry_sent",
  "in_discussion",
  "permission_pending",
  "approved",
  "rejected",
] as const;

export const locationSchema = z.object({
  id: idSchema("loc"),
  workspaceId: idSchema("wsp"),
  name: z.string().trim().min(1).max(160),
  address: z.string().trim().max(300).optional(),
  locationType: z.enum([
    "interior",
    "exterior",
    "studio",
    "public_space",
    "private_property",
    "other",
  ]),
  contactName: z.string().trim().max(160).optional(),
  contactEmail: z.email().optional(),
  contactPhone: z.string().trim().max(30).optional(),
  permissionStatus: z.enum(PERMISSION_STATUSES),
  accessNotes: optionalText,
  facilities: optionalText,
  powerAvailability: optionalText,
  parkingNotes: optionalText,
  referenceImageUrls: z.array(z.string()),
  notes: optionalText,
});
