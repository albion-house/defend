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

test("drives hero movement through the browser test driver", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#game-root canvas")).toBeVisible();

  const movement = await page.evaluate(() => {
    const driver = window.__DEFEND_DEBUG__?.testDriver;
    if (!driver) {
      throw new Error("test driver is missing");
    }
    const start = driver.getLatestRoomState().heroes.find((hero) => hero.playerSlot === "p1");
    if (!start) {
      throw new Error("hero:p1 is missing");
    }
    driver.pressKey("d");
    const moved = driver.waitForTick(driver.getLatestRoomState().tick + 3);
    driver.releaseKey("d");
    const end = moved.heroes.find((hero) => hero.playerSlot === "p1");
    return {
      startX: start.x,
      endX: end?.x,
      renderedHeroIds: driver.getRenderedEntities().heroes.map((hero) => hero.heroId),
      events: driver.getEventLog().map((event) => event.type)
    };
  });

  expect(movement.endX).toBeGreaterThan(movement.startX);
  expect(movement.renderedHeroIds).toContain("hero:p1");
  expect(movement.events).toContain("hero.input_received");
  expect(movement.events).toContain("hero.moved");
});

test("reports hero blocker collisions through browser state", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#game-root canvas")).toBeVisible();

  const collision = await page.evaluate(() => {
    const debug = window.__DEFEND_DEBUG__;
    const driver = debug?.testDriver;
    if (!debug || !driver) {
      throw new Error("debug api or test driver is missing");
    }

    debug.dispatch({ type: "tower:build", padId: "pad-4", towerTypeId: "ranger-post" });
    driver.pressKey("a");
    driver.waitForTick(driver.getLatestRoomState().tick + 6);
    driver.releaseKey("a");
    const towerEvents = driver.getEventLog().map((event) => ({
      type: event.type,
      blockerType: event.blockerType
    }));

    debug.dispatch({ type: "mission:restart" });
    driver.pressKey("a");
    driver.waitForTick(driver.getLatestRoomState().tick + 24);
    driver.releaseKey("a");
    driver.pressKey("s");
    driver.waitForTick(driver.getLatestRoomState().tick + 6);
    driver.releaseKey("s");

    const wallEvents = driver.getEventLog().map((event) => ({
      type: event.type,
      blockerType: event.blockerType
    }));
    return { towerEvents, wallEvents };
  });

  expect(collision.towerEvents).toContainEqual({ type: "hero.collision_resolved", blockerType: "tower" });
  expect(collision.wallEvents).toContainEqual({ type: "hero.collision_resolved", blockerType: "wall" });
});

test("renders hero firing and observes enemy damage through browser state", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#game-root canvas")).toBeVisible();

  const combat = await page.evaluate(() => {
    const debug = window.__DEFEND_DEBUG__;
    const driver = debug?.testDriver;
    if (!debug || !driver) {
      throw new Error("debug api or test driver is missing");
    }

    debug.dispatch({ type: "wave:start" });
    driver.waitForTick(driver.getLatestRoomState().tick + 65);
    const target = driver.getLatestRoomState().enemies[0];
    if (!target) {
      throw new Error("enemy target is missing");
    }
    driver.aimAtWorld(target.position.x, target.position.y);
    driver.fireDown();
    driver.waitForTick(driver.getLatestRoomState().tick + 14);
    driver.fireUp();

    return {
      projectiles: driver.getRenderedEntities().heroProjectiles.length,
      enemies: driver.getLatestRoomState().enemies.map((enemy) => ({ id: enemy.id, hp: enemy.currentHp })),
      events: driver.getEventLog().map((event) => event.type)
    };
  });

  expect(combat.events).toContain("hero.fired");
  expect(combat.events).toContain("hero.projectile_spawned");
  expect(combat.events).toContain("enemy.damaged");
  expect(combat.enemies.some((enemy) => enemy.hp < 48)).toBe(true);
});
