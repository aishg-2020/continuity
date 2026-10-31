import { describe, expect, it } from "vitest";
import { checkIntegrity } from "./integrity";
import { buildSeed } from "./seed";

describe("demo seed", () => {
  it("is internally consistent", () => {
    expect(checkIntegrity(buildSeed())).toEqual([]);
  });

  it("is deterministic", () => {
    expect(buildSeed()).toEqual(buildSeed());
  });

  it("uses only reserved example.com email addresses", () => {
    const emails = Object.values(buildSeed().users).map((user) => user.email);
    expect(emails.every((email) => email.endsWith("@example.com"))).toBe(true);
  });
});

describe("checkIntegrity", () => {
  it("reports dangling foreign keys", () => {
    const tables = buildSeed();
    tables.workspaceMembers.wsm_demo01 = {
      ...tables.workspaceMembers.wsm_demo01,
      userId: "usr_missing",
    };
    expect(checkIntegrity(tables)).toContain(
      "workspaceMembers/wsm_demo01: userId → users/usr_missing does not exist",
    );
  });

  it("reports schema violations", () => {
    const tables = buildSeed();
    tables.users.usr_demo01 = { ...tables.users.usr_demo01, email: "not-an-email" };
    expect(checkIntegrity(tables).some((p) => p.startsWith("users/usr_demo01: email"))).toBe(true);
  });
});
