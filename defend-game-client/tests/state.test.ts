import { describe, expect, it } from "vitest";
import {
  applyGameCommand,
  createInitialGameState,
  getMissionContent,
  getSerializableSnapshot,
  type GameState,
  type TowerTypeId
} from "../src/game/state";

describe("first playable mission state", () => {
  it("creates an inspectable playable mission snapshot", () => {
    const state = createInitialGameState("test-session");
    const snapshot = getSerializableSnapshot(state);

    expect(snapshot.scene).toBe("first-playable-mission");
    expect(snapshot.sessionId).toBe("test-session");
    expect(snapshot.mission.status).toBe("ready");
    expect(snapshot.paths).toHaveLength(2);
    expect(snapshot.buildPads).toHaveLength(8);
    expect(snapshot.contentSummary).toMatchObject({
      mapId: "saltmarsh-crossing",
      towerTypes: 4,
      enemyTypes: 5,
      waves: 4
    });
    expect(snapshot.objective.currentHp).toBe(snapshot.objective.maxHp);
    expect(snapshot.towers).toEqual([]);
    expect(snapshot.enemies).toEqual([]);
  });

  it("builds all four tower archetypes through explicit commands", () => {
    let state = createInitialGameState();
    state = build(state, "pad-1", "ranger-post");
    state = build(state, "pad-3", "veil-spire");
    state = build(state, "pad-7", "stoneward-lodge");
    state = build(state, "pad-4", "ranger-post");

    expect(state.towers.map((tower) => tower.typeId)).toEqual([
      "ranger-post",
      "veil-spire",
      "stoneward-lodge",
      "ranger-post"
    ]);
    expect(state.sharedGold).toBe(320 - 70 - 95 - 85 - 70);
    expect(state.buildPads.filter((pad) => pad.occupiedBy)).toHaveLength(4);
  });

  it("blocks construction when gold is insufficient", () => {
    let state = createInitialGameState();
    state = build(state, "pad-1", "blast-foundry");
    state = build(state, "pad-2", "blast-foundry");
    state = build(state, "pad-3", "blast-foundry");
    state = build(state, "pad-4", "blast-foundry");

    expect(state.towers).toHaveLength(2);
    expect(state.messageLog[0]).toContain("Need 115 gold");
  });

  it("spawns and advances scripted enemies deterministically on fixed ticks", () => {
    const first = applyGameCommand(createInitialGameState(), { type: "wave:start" });
    const second = applyGameCommand(createInitialGameState(), { type: "wave:start" });

    const firstAdvanced = applyGameCommand(first, { type: "simulation:step", ticks: 16 });
    const secondAdvanced = applyGameCommand(second, { type: "simulation:step", ticks: 16 });

    expect(firstAdvanced.enemies.map((enemy) => enemy.id)).toEqual([
      "wave-1-enemy-01",
      "wave-1-enemy-02",
      "wave-1-enemy-03",
      "wave-1-enemy-04"
    ]);
    expect(firstAdvanced.enemies.map((enemy) => enemy.pathId)).toEqual(["A", "B", "A", "B"]);
    expect(firstAdvanced.enemies.every((enemy) => enemy.progress > 0)).toBe(true);
    expect(firstAdvanced.enemies).toEqual(secondAdvanced.enemies);
    expect(firstAdvanced.wave).toEqual(secondAdvanced.wave);
  });

  it("runs identical command/tick sequences to identical snapshots", () => {
    const first = runOpening(createInitialGameState("replay"));
    const second = runOpening(createInitialGameState("replay"));

    expect(getSerializableSnapshot(first)).toEqual(getSerializableSnapshot(second));
    expect(first.towers.some((tower) => tower.damageDealt > 0)).toBe(true);
    expect(first.wave.wavesCompleted).toBeGreaterThanOrEqual(1);
  });

  it("supports defeat and fast restart", () => {
    let defeated = createInitialGameState();
    for (let wave = 0; wave < 4 && defeated.mission.status !== "defeat"; wave += 1) {
      defeated = applyGameCommand(applyGameCommand(defeated, { type: "wave:start" }), {
        type: "simulation:step",
        ticks: 420
      });
    }
    const restarted = applyGameCommand(defeated, { type: "mission:restart" });

    expect(defeated.mission.status).toBe("defeat");
    expect(defeated.objective.currentHp).toBe(0);
    expect(restarted.mission.status).toBe("ready");
    expect(restarted.objective.currentHp).toBe(restarted.objective.maxHp);
    expect(restarted.enemies).toEqual([]);
  });

  it("can simulate a complete victorious match with original content", () => {
    let state = createInitialGameState("victory");
    state = build(state, "pad-2", "ranger-post");
    state = build(state, "pad-3", "veil-spire");
    state = build(state, "pad-7", "stoneward-lodge");
    state = build(state, "pad-4", "ranger-post");
    state = completeWave(state);
    state = build(state, "pad-6", "blast-foundry");
    state = completeWave(state);
    state = build(state, "pad-8", "blast-foundry");
    state = completeWave(state);
    state = build(state, "pad-1", "ranger-post");
    state = completeWave(state);

    expect(state.mission.status).toBe("victory");
    expect(state.objective.currentHp).toBeGreaterThan(0);
    expect(new Set(getMissionContent().waves.flatMap((wave) => wave.spawns.map((spawn) => spawn.enemyTypeId))).size).toBeGreaterThanOrEqual(5);
  });
});

function build(state: GameState, padId: string, towerTypeId: TowerTypeId): GameState {
  return applyGameCommand(state, { type: "tower:build", padId, towerTypeId });
}

function completeWave(state: GameState): GameState {
  return applyGameCommand(applyGameCommand(state, { type: "wave:start" }), { type: "simulation:step", ticks: 360 });
}

function runOpening(state: GameState): GameState {
  let next = build(state, "pad-2", "ranger-post");
  next = build(next, "pad-3", "veil-spire");
  next = build(next, "pad-7", "stoneward-lodge");
  next = build(next, "pad-4", "ranger-post");
  return completeWave(next);
}
