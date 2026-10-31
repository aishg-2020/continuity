import { z } from "zod";
import { idSchema, timestampSchema } from "./common";

export const activityEventSchema = z.object({
  id: idSchema("act"),
  workspaceId: idSchema("wsp"),
  projectId: idSchema("prj").optional(),
  actorUserId: idSchema("usr"),
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  action: z.enum(["created", "updated", "deleted", "published", "archived", "submitted"]),
  metadata: z.record(z.string(), z.unknown()),
  createdAt: timestampSchema,
});
