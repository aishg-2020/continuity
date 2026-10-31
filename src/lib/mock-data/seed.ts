import { emptyTables, type EntityName, type EntityRecord, type Tables } from "@/lib/data/entities";
import { demoUsers, demoWorkspaceMembers, demoWorkspaces } from "./fixtures/workspace";

/**
 * Bump when fixtures change shape or content, so saved demo state in a browser
 * is replaced by the new seed instead of mixing old and new records.
 */
export const SEED_VERSION = 1;

function keyById<E extends EntityName>(
  records: EntityRecord<E>[],
): Record<string, EntityRecord<E>> {
  return Object.fromEntries(records.map((record) => [record.id, record]));
}

/**
 * Builds the full demo dataset. Deterministic: the same code always produces
 * the same tables. Later phases add hand-authored fixtures and seeded generators here.
 */
export function buildSeed(): Tables {
  return {
    ...emptyTables(),
    users: keyById<"users">(demoUsers),
    workspaces: keyById<"workspaces">(demoWorkspaces),
    workspaceMembers: keyById<"workspaceMembers">(demoWorkspaceMembers),
  };
}
