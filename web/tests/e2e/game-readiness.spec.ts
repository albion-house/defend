import { expect, test, type Page } from "@playwright/test";
import type { DefendDebugState } from "@albion-house/defend-game-client";

const expectedVersion = process.env.DEFEND_EXPECTED_VERSION?.trim();
const deploymentWaitMs = readPositiveInt("DEFEND_DEPLOYMENT_WAIT_MS", expectedVersion ? 120_000 : 15_000);
const deploymentPollMs = readPositiveInt("DEFEND_DEPLOYMENT_POLL_MS", 5_000);

test.setTimeout(deploymentWaitMs + 60_000);

test("initial game is playable", async ({ page, baseURL }) => {
  if (!baseURL) {
    throw new Error("Playwright baseURL is required for Defend e2e verification.");
  }

  await openReadyDeployment(page, resolveRouteURL(baseURL, "/play/"));
  await expect(page.locator("#game-root canvas")).toBeVisible();

  const description = await readDebugState(page);
  expect(description.scene).toBe("first-playable-mission");
  expect(description.activePlayers).toBe(1);
  expect(description.objectiveHp).toBe("20/20");
  expect(description.mission.status).toBe("ready");
  expect(description.wave.index).toBe(1);
  expect(description.content.towerTypes).toBe(4);
  expect(description.content.enemyTypes).toBeGreaterThanOrEqual(5);
  expect(description.buildPads).toHaveLength(8);
  expect(description.controls).toContain("tower:build");
  await expect(page.locator("#semantic-state")).toContainText("mission: Saltmarsh Crossing");
  await expect(page.locator("#semantic-state")).not.toBeVisible();

  const playerState = await page.evaluate(() => window.__DEFEND_DEBUG__?.getState().players);
  expect(playerState).toEqual([
    expect.objectContaining({ id: "p1", connected: true }),
    expect.objectContaining({ id: "p2", connected: false })
  ]);

  const commandResult = await page.evaluate(() => {
    const debug = window.__DEFEND_DEBUG__;
    if (!debug) {
      throw new Error("Defend debug API is not installed.");
    }

    const padId = debug.describe().buildPads[0]?.id;
    if (!padId) {
      throw new Error("No build pad is available for the smoke command.");
    }

    let snapshot = debug.dispatch({
      type: "tower:build",
      padId,
      towerTypeId: "ranger-post"
    });
    snapshot = debug.dispatch({ type: "wave:start" });
    snapshot = debug.dispatch({ type: "simulation:step", ticks: 20 });

    return {
      padId,
      occupiedBy: snapshot.buildPads.find((pad) => pad.id === padId)?.occupiedBy,
      occupiedAfter: debug.describe().buildPads.find((pad) => pad.id === padId)?.occupied,
      towerCount: debug.describe().towers.length,
      enemyCount: debug.describe().activeEnemyCount,
      waveActive: debug.describe().wave.active
    };
  });

  expect(commandResult.occupiedBy).toBe("tower-1-ranger-post");
  expect(commandResult.occupiedAfter).toBe(true);
  expect(commandResult.towerCount).toBe(1);
  expect(commandResult.enemyCount).toBeGreaterThan(0);
  expect(commandResult.waveActive).toBe(true);
  await expect(page.locator("#semantic-state")).toContainText("build pads: 1/8");
  await expect(page.locator("#semantic-state")).toContainText("towers: 1");
});

test("knowledge garden and play route render canonical surfaces", async ({ page, baseURL }) => {
  if (!baseURL) {
    throw new Error("Playwright baseURL is required for Defend route verification.");
  }

  await page.goto(baseURL, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "defend knowledge garden" })).toBeVisible();
  await expect(page.getByRole("navigation").getByRole("link", { name: "play", exact: true })).toBeVisible();
  await expect(page.locator("#game-root canvas")).toBeVisible();

  const routes = [
    { path: "/garden/dev/getting-started/", heading: "getting started", text: "mise //web:dev" },
    { path: "/garden/design/first-playable/", heading: "first playable", text: "saltmarsh crossing" },
    { path: "/garden/reference/glossary/", heading: "glossary", text: "simulation command" },
    {
      path: "/garden/design/concept/expedition%20mode/",
      heading: "expedition mode",
      text: "co-op action-adventure mode"
    },
    { path: "/play/", heading: "play", text: "version" }
  ];

  for (const route of routes) {
    await page.goto(resolveRouteURL(baseURL, route.path), { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: route.heading })).toBeVisible();
    await expect(page.getByText(route.text).first()).toBeVisible();
  }
});

async function openReadyDeployment(page: Page, baseURL: string): Promise<void> {
  const deadline = Date.now() + deploymentWaitMs;
  const errors: string[] = [];

  while (Date.now() <= deadline) {
    try {
      await page.goto(withCacheBust(baseURL), { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => Boolean(window.__DEFEND_DEBUG__), null, {
        timeout: Math.min(deploymentPollMs, 10_000)
      });

      if (!expectedVersion) {
        return;
      }

      const versionState = await page.evaluate(() => ({
        appVersion: document.querySelector<HTMLElement>("#app")?.dataset.defendVersion,
        visibleVersion: document.querySelector<HTMLElement>("#deployment-version")?.dataset.defendVersion,
        debugVersion: window.__DEFEND_DEBUG__?.describe().deploymentVersion
      }));

      if (
        versionState.appVersion === expectedVersion &&
        versionState.visibleVersion === expectedVersion &&
        versionState.debugVersion === expectedVersion
      ) {
        await expect(page.locator("#deployment-version")).toContainText(expectedVersion);
        return;
      }

      errors.push(
        `served app=${versionState.appVersion ?? "missing"} visible=${
          versionState.visibleVersion ?? "missing"
        } debug=${versionState.debugVersion ?? "missing"}`
      );
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }

    await page.waitForTimeout(deploymentPollMs);
  }

  const latest = errors.at(-1) ?? "no page response";
  throw new Error(
    `Timed out after ${deploymentWaitMs}ms waiting for ${baseURL} to serve version ${
      expectedVersion ?? "any"
    }. Latest state: ${latest}`
  );
}

async function readDebugState(page: Page): Promise<DefendDebugState> {
  return page.evaluate(() => {
    const debug = window.__DEFEND_DEBUG__;
    if (!debug) {
      throw new Error("Defend debug API is not installed.");
    }
    return debug.describe();
  });
}

function withCacheBust(rawURL: string): string {
  const url = new URL(rawURL);
  url.searchParams.set("defend_verify", `${Date.now()}`);
  return url.toString();
}

function resolveRouteURL(baseURL: string, routePath: string): string {
  const url = new URL(baseURL);
  const basePath = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  url.pathname = `${basePath}${routePath.replace(/^\/+/, "")}`;
  url.search = "";
  url.hash = "";
  return url.toString();
}

function readPositiveInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
