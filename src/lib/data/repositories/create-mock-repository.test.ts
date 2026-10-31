import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { useDevSettings } from "@/lib/data/dev-settings";
import { STORAGE_KEY, useDataStore } from "@/lib/data/store";
import { MockNetworkError, NotFoundError, repositories } from ".";

const newUser = {
  name: "Test Gaffer",
  email: "gaffer@example.com",
  createdAt: "2026-11-01T00:00:00.000Z",
};

describe("mock repository", () => {
  it("creates records with a prefixed id and reads them back", async () => {
    const created = await repositories.users.create(newUser);
    expect(created.id).toMatch(/^usr_[a-z0-9]+$/);
    expect(await repositories.users.get(created.id)).toEqual(created);
  });

  it("lists with filtering and sorting", async () => {
    await repositories.users.create(newUser);
    const users = await repositories.users.list({
      where: (u) => u.email.endsWith("@example.com"),
      sortBy: (a, b) => a.name.localeCompare(b.name),
    });
    expect(users.map((u) => u.name)).toEqual(["Demo Producer", "Test Gaffer"]);
  });

  it("validates on create and update", async () => {
    await expect(repositories.users.create({ ...newUser, email: "nope" })).rejects.toBeInstanceOf(
      ZodError,
    );
    await expect(repositories.users.update("usr_demo01", { name: "" })).rejects.toBeInstanceOf(
      ZodError,
    );
  });

  it("returns copies, so callers cannot mutate stored records", async () => {
    const user = await repositories.users.get("usr_demo01");
    user.name = "Mutated";
    expect((await repositories.users.get("usr_demo01")).name).toBe("Demo Producer");
  });

  it("updates and removes", async () => {
    const updated = await repositories.users.update("usr_demo01", { name: "Line Producer" });
    expect(updated.name).toBe("Line Producer");
    await repositories.users.remove("usr_demo01");
    await expect(repositories.users.get("usr_demo01")).rejects.toBeInstanceOf(NotFoundError);
  });

  it("simulates network failures when the failure rate is set", async () => {
    useDevSettings.setState({ failureRate: 1 });
    await expect(repositories.users.list()).rejects.toBeInstanceOf(MockNetworkError);
  });

  it("persists to localStorage and resets to the seed", async () => {
    await repositories.users.create(newUser);
    expect(localStorage.getItem(STORAGE_KEY)).toContain("gaffer@example.com");
    useDataStore.getState().resetDemoData();
    expect(await repositories.users.list()).toHaveLength(1);
  });
});
