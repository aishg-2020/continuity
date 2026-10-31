import { expect, test, type Page } from "@playwright/test";

const PROJECT_MODULES = [
  "overview",
  "scenes",
  "breakdown",
  "storyboards",
  "shots",
  "schedule",
  "people",
  "locations",
  "budget",
  "call-sheets",
  "reports",
  "files",
  "activity",
];

const ROUTES = [
  "/",
  "/demo-login",
  "/home",
  "/projects",
  "/people",
  "/locations",
  "/settings",
  "/share/call-sheets/cs_demo01",
  ...PROJECT_MODULES.map((module) => `/projects/prj_demo01/${module}`),
];

/** Fails the test if the page talks to anything other than the app itself. */
function guardExternalRequests(page: Page) {
  const external: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!["localhost", "127.0.0.1"].includes(url.hostname) && url.protocol !== "data:") {
      external.push(request.url());
    }
  });
  return external;
}

for (const route of ROUTES) {
  test(`renders ${route} with the demo disclosure and no external requests`, async ({ page }) => {
    const external = guardExternalRequests(page);
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(page.getByRole("note").filter({ hasText: "sample data" })).toBeVisible();
    await page.waitForLoadState("networkidle");
    expect(external).toEqual([]);
  });
}

test("redirects a project root to its overview", async ({ page }) => {
  await page.goto("/projects/prj_demo01");
  await expect(page).toHaveURL(/\/projects\/prj_demo01\/overview$/);
});

test("shows on-set modules in the mobile bottom nav inside a project", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/projects/prj_demo01/overview");
  const nav = page.getByRole("navigation", { name: "Primary" });
  for (const label of ["Overview", "Schedule", "Call Sheets", "Daily Reports"]) {
    await expect(nav.getByRole("link", { name: label })).toBeVisible();
  }
});

test("persists the high-contrast preference across reloads", async ({ page }) => {
  await page.goto("/home");
  const toggle = page.getByRole("button", { name: "On-set high contrast" });
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-contrast", "high");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-contrast", "high");
});

test("loads the seeded workspace and resets demo data after confirmation", async ({ page }) => {
  await page.goto("/settings");
  await expect(page.getByText("Continuity Demo Studio").last()).toBeVisible();

  await page.getByRole("button", { name: "Reset demo data" }).first().click();
  const dialog = page.getByRole("dialog", { name: "Reset demo data?" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Reset demo data" }).click();

  await expect(page.getByText("Demo data reset to the original sample.")).toBeVisible();
  const saved = await page.evaluate(() => localStorage.getItem("continuity-demo-v1"));
  expect(saved).toContain("wsp_demo01");
});
