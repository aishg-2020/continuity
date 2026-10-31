import { z } from "zod";
import { idSchema, timestampSchema } from "./common";

export const ROLES = [
  "owner",
  "admin",
  "producer",
  "production_manager",
  "director",
  "department_lead",
  "crew_member",
  "viewer",
] as const;
export const roleSchema = z.enum(ROLES);

export const userSchema = z.object({
  id: idSchema("usr"),
  name: z.string().trim().min(1),
  email: z.email(),
  avatarUrl: z.string().optional(),
  createdAt: timestampSchema,
});

export const workspaceSchema = z.object({
  id: idSchema("wsp"),
  name: z.string().trim().min(1).max(120),
  ownerUserId: idSchema("usr"),
  createdAt: timestampSchema,
});

export const workspaceMemberSchema = z.object({
  id: idSchema("wsm"),
  workspaceId: idSchema("wsp"),
  userId: idSchema("usr"),
  role: roleSchema,
  status: z.enum(["invited", "active", "deactivated"]),
  joinedAt: timestampSchema.optional(),
});
