import { z } from "zod";
import { idSchema, optionalText, timeSchema, timestampSchema } from "./common";

export const callSheetSchema = z.object({
  id: idSchema("cs"),
  projectId: idSchema("prj"),
  shootDayId: idSchema("sd"),
  revisionNumber: z.int().positive(),
  /** Frozen copy of everything shown on the sheet; immutable once published (PRD §12). */
  contentSnapshot: z.record(z.string(), z.unknown()),
  status: z.enum(["draft", "published", "superseded"]),
  publishedAt: timestampSchema.optional(),
  createdBy: idSchema("usr"),
});

export const dailyReportSchema = z.object({
  id: idSchema("dr"),
  projectId: idSchema("prj"),
  shootDayId: idSchema("sd"),
  actualCallTime: timeSchema.optional(),
  actualWrapTime: timeSchema.optional(),
  completedSceneIds: z.array(idSchema("scn")),
  incompleteSceneIds: z.array(idSchema("scn")),
  delayNotes: optionalText,
  weatherNotes: optionalText,
  incidents: optionalText,
  equipmentIssues: optionalText,
  productionNotes: optionalText,
  submittedBy: idSchema("usr"),
  submittedAt: timestampSchema,
});
