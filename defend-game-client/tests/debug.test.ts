import { afterEach, describe, expect, it, vi } from "vitest";
import { describeGameState, installDebugApi, normalizeDeploymentVersion } from "../src/game/debug";
import { applyGameCommand, createInitialGameState } from "../src/game/state";
import type { GameCommand, GameState } from "../src/game/state";

describe("debug observability", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("describes semantic browser state for the playable mission", () => {
    const description = describeGameState(createInitialGameState("debug-test"), "0.1.0+abc1234");

    expect(description.deploymentVersion).toBe("0.1.0+abc1234");
    expect(description.scene).toBe("first-playable-mission");
    expect(description.sessionId).toBe("debug-test");
    expect(description.mission.status).toBe("ready");
    expect(description.objectiveHp).toBe("20/20");
    expect(description.content).toMatchObject({
      mapId: "saltmarsh-crossing",
      towerTypes: 4,
      enemyTypes: 5,
      waves: 4
    });
    expect(description.controls).toContain("tower:build");
    expect(description.controls).toContain("simulation:step");
    expect(description.controls).toContain("hero_input");
    expect(description.heroes).toHaveLength(1);
    expect(description.heroes[0]).toMatchObject({
      heroId: "hero:p1",
      playerSlot: "p1",
      connected: true
    });
    expect(description.heroProjectiles).toEqual([]);
    expect(description.heroEvents).toEqual([]);
    expect(description.activeEnemyCount).toBe(0);
  });

  it("describes active enemy snapshots and wave lifecycle state", () => {
    const waveStarted = applyGameCommand(
      applyGameCommand(createInitialGameState("enemy-debug"), {
        type: "wave:start"
      }),
      { type: "simulation:step", ticks: 16 }
    );
    const description = describeGameState(waveStarted, "0.1.0+enemytest");

    expect(description.wave).toMatchObject({
      active: true,
      enemiesRemaining: 5,
      enemiesSpawned: 4,
      enemiesLeaked: 0,
      completed: false
    });
    expect(description.activeEnemyCount).toBe(4);
    expect(description.enemyPaths).toEqual({ A: 2, B: 2 });
    expect(description.enemies[0]).toMatchObject({
      id: "wave-1-enemy-01",
      typeId: "skitter",
      pathId: "A",
      hp: "48/48",
      status: "active"
    });
  });

  it("defaults deployment metadata for local builds", () => {
    expect(normalizeDeploymentVersion(undefined)).toBe("0.1.0+local");
    expect(normalizeDeploymentVersion("  ")).toBe("0.1.0+local");
    expect(normalizeDeploymentVersion("0.1.0+abcdef0")).toBe("0.1.0+abcdef0");
  });

  it("installs an agent-facing debug API without requiring host DOM", () => {
    const fakeWindow: { __DEFEND_DEBUG__?: unknown } = {};
    vi.stubGlobal("window", fakeWindow);

    let state: GameState = createInitialGameState("api-test");
    const dispatch = (command: GameCommand) => {
      state = applyGameCommand(state, command);
      return state;
    };

    const api = installDebugApi(() => state, dispatch, "0.1.0+domtest");
    api.dispatch({ type: "tower:build", padId: "pad-2", towerTypeId: "ranger-post" });
    api.dispatch({ type: "wave:start" });
    api.dispatch({ type: "simulation:step", ticks: 16 });

    expect(fakeWindow.__DEFEND_DEBUG__).toBe(api);
    expect(api.getState().buildPads[1].occupiedBy).toBe("tower-1-ranger-post");
    expect(api.getState().enemies).toHaveLength(4);
    expect(api.describe().deploymentVersion).toBe("0.1.0+domtest");
  });

  it("installs a Defend test driver when enabled", () => {
    let state: GameState = createInitialGameState("driver-test");
    const dispatch = (command: GameCommand) => {
      state = applyGameCommand(state, command);
      return state;
    };
    const api = installDebugApi(() => state, dispatch, "0.1.0+drivertest", {
      enableTestDriver: true,
      playerSlot: "p1"
    });
    const driver = api.testDriver;
    if (!driver) {
      throw new Error("test driver missing");
    }

    expect(driver.getPlayerSlot()).toBe("p1");
    driver.pressKey("d");
    const moved = driver.waitForTick(state.tick + 2);
    driver.releaseKey("d");

    expect(moved.heroes.find((candidate) => candidate.playerSlot === "p1")?.x).toBeGreaterThan(850);
    expect(driver.getRenderedEntities().heroes[0].heroId).toBe("hero:p1");
    expect(driver.getEventLog().some((event) => event.type === "hero.input_received")).toBe(true);
  });

  it("dispatches deterministic simulation through the debug API", () => {
    let state: GameState = createInitialGameState("simulation-debug");
    const dispatch = (command: GameCommand) => {
      state = applyGameCommand(state, command);
      return state;
    };
    const api = installDebugApi(() => state, dispatch, "0.1.0+simtest");

    api.dispatch({ type: "tower:build", padId: "pad-2", towerTypeId: "ranger-post" });
    api.dispatch({ type: "tower:build", padId: "pad-3", towerTypeId: "veil-spire" });
    api.dispatch({ type: "wave:start" });
    const moved = api.dispatch({ type: "simulation:step", ticks: 20 });
    const completed = api.dispatch({ type: "simulation:step", ticks: 360 });

    expect(moved.enemies[0].progress).toBeGreaterThan(0);
    expect(completed.wave.active).toBe(false);
    expect(completed.wave.wavesCompleted).toBe(1);
    expect(completed.objective.currentHp).toBeGreaterThan(0);
    expect(api.describe().activeEnemyCount).toBe(0);
  });
});
