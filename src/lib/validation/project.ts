import { z } from "zod";
import {
  currencySchema,
  dateSchema,
  idSchema,
  moneySchema,
  optionalText,
  timestampSchema,
} from "./common";
import { roleSchema } from "./workspace";

export const PROJECT_TYPES = [
  "short_film",
  "feature_film",
  "documentary",
  "advertisement",
  "music_video",
  "web_series",
  "other",
] as const;

export const PROJECT_STATUSES = [
  "development",
  "pre_production",
  "production",
  "post_production",
  "completed",
  "on_hold",
] as const;

export const projectSchema = z.object({
  id: idSchema("prj"),
  workspaceId: idSchema("wsp"),
  title: z.string().trim().min(1).max(160),
  type: z.enum(PROJECT_TYPES),
  description: optionalText,
  coverImageUrl: z.string().optional(),
  productionCompany: z.string().trim().max(160).optional(),
  producerName: z.string().trim().max(160).optional(),
  directorName: z.string().trim().max(160).optional(),
  status: z.enum(PROJECT_STATUSES),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  targetShootDays: z.int().positive().optional(),
  timezone: z.string().min(1),
  currency: currencySchema,
  approvedBudget: moneySchema.optional(),
  visibility: z.enum(["workspace", "members"]),
  archivedAt: timestampSchema.optional(),
  createdBy: idSchema("usr"),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const projectMemberSchema = z.object({
  id: idSchema("pjm"),
  projectId: idSchema("prj"),
  userId: idSchema("usr"),
  projectRole: roleSchema,
  canViewFinancials: z.boolean(),
});
