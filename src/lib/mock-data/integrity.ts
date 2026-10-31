import { ENTITIES, ENTITY_NAMES, type EntityName, type Tables } from "@/lib/data/entities";

/**
 * Checks a dataset the way a relational database would: every record passes its
 * schema, is stored under its own ID, and every foreign key points at an existing
 * record. Returns a list of human-readable problems (empty means consistent).
 */
export function checkIntegrity(tables: Tables): string[] {
  const problems: string[] = [];

  for (const entity of ENTITY_NAMES) {
    const { schema, foreignKeys } = ENTITIES[entity];

    for (const [key, record] of Object.entries(tables[entity])) {
      const label = `${entity}/${key}`;
      const parsed = schema.safeParse(record);
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          problems.push(`${label}: ${issue.path.join(".") || "(root)"} ${issue.message}`);
        }
        continue;
      }
      if ((record as { id: string }).id !== key) {
        problems.push(`${label}: stored under a key that differs from its id`);
      }

      for (const [field, target] of Object.entries(foreignKeys) as [string, EntityName][]) {
        const value = (record as Record<string, unknown>)[field];
        const refs = Array.isArray(value) ? value : value === undefined ? [] : [value];
        for (const ref of refs) {
          if (!(String(ref) in tables[target])) {
            problems.push(`${label}: ${field} → ${target}/${ref} does not exist`);
          }
        }
      }
    }
  }

  return problems;
}
