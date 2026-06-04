import { expect, test } from "@playwright/test";

declare global {
  interface Window {
    __DEFEND_FIXTURE__?: {
      destroy(): void;
    };
  }
}

test("mounts and tears down without astro", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#game-root canvas")).toBeVisible();

  const initial = await page.evaluate(() => window.__DEFEND_DEBUG__?.describe());
  expect(initial?.deploymentVersion).toBe("0.1.0+standalone");
  expect(initial?.mission.status).toBe("ready");
  expect(initial?.controls).toContain("tower:build");

  const changed = await page.evaluate(() => {
    const debug = window.__DEFEND_DEBUG__;
    if (!debug) {
      throw new Error("debug api is missing");
    }
    const padId = debug.describe().buildPads[0]?.id;
    if (!padId) {
      throw new Error("build pad is missing");
    }
    debug.dispatch({ type: "tower:build", padId, towerTypeId: "ranger-post" });
    return debug.describe();
  });
  expect(changed.towers).toHaveLength(1);

  await page.evaluate(() => window.__DEFEND_FIXTURE__?.destroy());
  await expect(page.locator("#game-root canvas")).toHaveCount(0);
  expect(await page.evaluate(() => window.__DEFEND_DEBUG__)).toBeUndefined();
});
