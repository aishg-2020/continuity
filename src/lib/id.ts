/** Creates a prefixed record ID, e.g. `createId("scn")` → `scn_3f9a1c0b2e`. */
export function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replaceAll("-", "").slice(0, 10)}`;
}
