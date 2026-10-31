import type { z } from "zod";
import { activityEventSchema } from "@/lib/validation/activity";
import { budgetLineItemSchema, expenseSchema } from "@/lib/validation/budget";
import { locationSchema } from "@/lib/validation/location";
import { personSchema, projectPersonSchema } from "@/lib/validation/people";
import { projectMemberSchema, projectSchema } from "@/lib/validation/project";
import { sceneBreakdownItemSchema, sceneSchema } from "@/lib/validation/scene";
import {
  shootDayPersonSchema,
  shootDaySceneSchema,
  shootDaySchema,
} from "@/lib/validation/schedule";
import { callSheetSchema, dailyReportSchema } from "@/lib/validation/shoot-execution";
import { shotSchema, storyboardFrameSchema } from "@/lib/validation/shot";
import { userSchema, workspaceMemberSchema, workspaceSchema } from "@/lib/validation/workspace";

/**
 * Registry of every mock "table": its schema, ID prefix and foreign keys.
 * The store, repositories and fixture integrity checks are all driven from here,
 * so adding an entity means adding one entry.
 */
export const ENTITIES = {
  users: { schema: userSchema, prefix: "usr", foreignKeys: {} },
  workspaces: { schema: workspaceSchema, prefix: "wsp", foreignKeys: { ownerUserId: "users" } },
  workspaceMembers: {
    schema: workspaceMemberSchema,
    prefix: "wsm",
    foreignKeys: { workspaceId: "workspaces", userId: "users" },
  },
  projects: {
    schema: projectSchema,
    prefix: "prj",
    foreignKeys: { workspaceId: "workspaces", createdBy: "users" },
  },
  projectMembers: {
    schema: projectMemberSchema,
    prefix: "pjm",
    foreignKeys: { projectId: "projects", userId: "users" },
  },
  scenes: {
    schema: sceneSchema,
    prefix: "scn",
    foreignKeys: { projectId: "projects", locationId: "locations", characterIds: "projectPeople" },
  },
  breakdownItems: {
    schema: sceneBreakdownItemSchema,
    prefix: "bdi",
    foreignKeys: { projectId: "projects", sceneIds: "scenes" },
  },
  people: { schema: personSchema, prefix: "per", foreignKeys: { workspaceId: "workspaces" } },
  projectPeople: {
    schema: projectPersonSchema,
    prefix: "ppl",
    foreignKeys: { projectId: "projects", personId: "people" },
  },
  locations: { schema: locationSchema, prefix: "loc", foreignKeys: { workspaceId: "workspaces" } },
  shots: {
    schema: shotSchema,
    prefix: "sht",
    foreignKeys: { projectId: "projects", sceneId: "scenes" },
  },
  storyboardFrames: {
    schema: storyboardFrameSchema,
    prefix: "sbf",
    foreignKeys: { projectId: "projects", sceneId: "scenes", shotId: "shots" },
  },
  shootDays: {
    schema: shootDaySchema,
    prefix: "sd",
    foreignKeys: { projectId: "projects", baseLocationId: "locations" },
  },
  shootDayScenes: {
    schema: shootDaySceneSchema,
    prefix: "sds",
    foreignKeys: { shootDayId: "shootDays", sceneId: "scenes" },
  },
  shootDayPeople: {
    schema: shootDayPersonSchema,
    prefix: "sdp",
    foreignKeys: { shootDayId: "shootDays", projectPersonId: "projectPeople" },
  },
  budgetLineItems: {
    schema: budgetLineItemSchema,
    prefix: "bli",
    foreignKeys: { projectId: "projects" },
  },
  expenses: {
    schema: expenseSchema,
    prefix: "exp",
    foreignKeys: {
      projectId: "projects",
      budgetLineItemId: "budgetLineItems",
      createdBy: "users",
    },
  },
  callSheets: {
    schema: callSheetSchema,
    prefix: "cs",
    foreignKeys: { projectId: "projects", shootDayId: "shootDays", createdBy: "users" },
  },
  dailyReports: {
    schema: dailyReportSchema,
    prefix: "dr",
    foreignKeys: {
      projectId: "projects",
      shootDayId: "shootDays",
      completedSceneIds: "scenes",
      incompleteSceneIds: "scenes",
      submittedBy: "users",
    },
  },
  activityEvents: {
    schema: activityEventSchema,
    prefix: "act",
    foreignKeys: { workspaceId: "workspaces", projectId: "projects", actorUserId: "users" },
  },
} as const satisfies Record<
  string,
  { schema: z.ZodObject; prefix: string; foreignKeys: Record<string, string> }
>;

export type EntityName = keyof typeof ENTITIES;
export type EntityRecord<E extends EntityName> = z.infer<(typeof ENTITIES)[E]["schema"]>;

/** All tables, keyed by record ID — the normalised shape of the mock database. */
export type Tables = { [E in EntityName]: Record<string, EntityRecord<E>> };

export const ENTITY_NAMES = Object.keys(ENTITIES) as EntityName[];

export function emptyTables(): Tables {
  return Object.fromEntries(ENTITY_NAMES.map((name) => [name, {}])) as Tables;
}
