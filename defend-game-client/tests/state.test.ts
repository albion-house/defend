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

  it("creates one synchronized hero per player slot and only p1 is active initially", () => {
    const state = createInitialGameState("heroes");

    expect(state.heroes.map((hero) => hero.heroId)).toEqual(["hero:p1", "hero:p2"]);
    expect(state.heroes.find((hero) => hero.playerSlot === "p1")).toMatchObject({
      connected: true,
      alive: true,
      velocityX: 0,
      velocityY: 0
    });
    expect(state.heroes.find((hero) => hero.playerSlot === "p2")?.connected).toBe(false);

    const joined = applyGameCommand(state, { type: "player:set-ready", playerId: "p2", ready: true });
    expect(joined.heroes.find((hero) => hero.playerSlot === "p2")?.connected).toBe(true);
  });

  it("moves heroes by normalized velocity and stops when input stops", () => {
    let state = createInitialGameState("hero-move");
    const startX = hero(state, "p1").x;

    state = applyGameCommand(state, {
      type: "hero_input",
      playerId: "p1",
      inputSeq: 1,
      moveX: 1,
      moveY: 1,
      aimX: 1,
      aimY: 0,
      fireHeld: false
    });
    expect(Math.hypot(hero(state, "p1").velocityX, hero(state, "p1").velocityY)).toBeLessThanOrEqual(hero(state, "p1").maxSpeed + 0.1);

    state = applyGameCommand(state, { type: "simulation:step", ticks: 1 });
    expect(hero(state, "p1").x).toBeGreaterThan(startX);

    state = applyGameCommand(state, {
      type: "hero_input",
      playerId: "p1",
      inputSeq: 2,
      moveX: 0,
      moveY: 0,
      aimX: 1,
      aimY: 0,
      fireHeld: false
    });
    state = applyGameCommand(state, { type: "simulation:step", ticks: 1 });
    expect(hero(state, "p1").velocityX).toBe(0);
    expect(hero(state, "p1").velocityY).toBe(0);
  });

  it("validates hero ownership and ignores out-of-order input", () => {
    let state = applyGameCommand(createInitialGameState("hero-owner"), { type: "player:set-ready", playerId: "p2", ready: true });
    const p2Start = hero(state, "p2").x;

    state = applyGameCommand(state, {
      type: "hero_input",
      playerId: "p1",
      inputSeq: 1,
      moveX: 1,
      moveY: 0,
      aimX: 1,
      aimY: 0,
      fireHeld: false
    });
    state = applyGameCommand(state, { type: "simulation:step", ticks: 1 });
    expect(hero(state, "p1").x).toBeGreaterThan(850);
    expect(hero(state, "p2").x).toBe(p2Start);

    const afterFirst = hero(state, "p1").lastInputSeq;
    state = applyGameCommand(state, {
      type: "hero_input",
      playerId: "p1",
      inputSeq: 1,
      moveX: -1,
      moveY: 0,
      aimX: -1,
      aimY: 0,
      fireHeld: false
    });
    expect(hero(state, "p1").lastInputSeq).toBe(afterFirst);
    expect(state.heroEvents[0].type).toBe("hero.input_rejected");
  });

  it("blocks heroes against towers, walls, and bounds while allowing sliding", () => {
    let towerState = build(createInitialGameState("hero-collision"), "pad-2", "ranger-post");
    towerState = withHero(towerState, "p1", { x: 350, y: 220 });
    towerState = applyGameCommand(towerState, {
      type: "hero_input",
      playerId: "p1",
      inputSeq: 1,
      moveX: 1,
      moveY: 0,
      aimX: 1,
      aimY: 0,
      fireHeld: false
    });
    towerState = applyGameCommand(towerState, { type: "simulation:step", ticks: 1 });
    expect(hero(towerState, "p1").x).toBe(350);
    expect(towerState.heroEvents.some((event) => event.type === "hero.collision_resolved" && event.blockerType === "tower")).toBe(true);

    let slideState = withHero(build(createInitialGameState("hero-slide"), "pad-2", "ranger-post"), "p1", { x: 360, y: 200 });
    slideState = applyGameCommand(slideState, {
      type: "hero_input",
      playerId: "p1",
      inputSeq: 1,
      moveX: 1,
      moveY: 1,
      aimX: 1,
      aimY: 0,
      fireHeld: false
    });
    slideState = applyGameCommand(slideState, { type: "simulation:step", ticks: 1 });
    expect(hero(slideState, "p1").x).toBe(360);
    expect(hero(slideState, "p1").y).toBeGreaterThan(200);

    let wallState = withHero(createInitialGameState("hero-wall"), "p1", { x: 400, y: 270 });
    wallState = applyGameCommand(wallState, {
      type: "hero_input",
      playerId: "p1",
      inputSeq: 1,
      moveX: 0,
      moveY: 1,
      aimX: 0,
      aimY: 1,
      fireHeld: false
    });
    wallState = applyGameCommand(wallState, { type: "simulation:step", ticks: 1 });
    expect(hero(wallState, "p1").y).toBe(270);
    expect(wallState.heroEvents.some((event) => event.type === "hero.collision_resolved" && event.blockerType === "wall")).toBe(true);

    let boundsState = withHero(createInitialGameState("hero-bounds"), "p1", { x: 70, y: 350 });
    boundsState = applyGameCommand(boundsState, {
      type: "hero_input",
      playerId: "p1",
      inputSeq: 1,
      moveX: -1,
      moveY: 0,
      aimX: -1,
      aimY: 0,
      fireHeld: false
    });
    boundsState = applyGameCommand(boundsState, { type: "simulation:step", ticks: 1 });
    expect(hero(boundsState, "p1").x).toBe(70);
    expect(boundsState.heroEvents.some((event) => event.type === "hero.collision_resolved" && event.blockerType === "bounds")).toBe(true);
  });

  it("rejects tower placement when an active hero overlaps the footprint", () => {
    let state = createInitialGameState("hero-build-blocked");
    state = withHero(state, "p1", { ...state.buildPads[0].position });
    state = build(state, "pad-1", "ranger-post");

    expect(state.towers).toHaveLength(0);
    expect(state.buildPads[0].occupiedBy).toBeNull();
    expect(state.heroEvents[0]).toMatchObject({
      type: "hero.input_rejected",
      reason: "tower-overlaps-hero"
    });
  });

  it("spawns hero projectiles, enforces cooldown, and damages enemies without damaging towers", () => {
    let state = applyGameCommand(createInitialGameState("hero-combat"), { type: "wave:start" });
    state = applyGameCommand(state, { type: "simulation:step", ticks: 1 });
    state = withHero(state, "p1", { x: 150, y: 174 });
    state = build(state, "pad-2", "ranger-post");

    state = applyGameCommand(state, {
      type: "hero_input",
      playerId: "p1",
      inputSeq: 1,
      moveX: 0,
      moveY: 0,
      aimX: -1,
      aimY: 0,
      fireHeld: true
    });
    state = applyGameCommand(state, { type: "simulation:step", ticks: 1 });
    expect(state.heroProjectiles).toHaveLength(1);
    expect(state.heroEvents.some((event) => event.type === "hero.fired")).toBe(true);

    state = applyGameCommand(state, { type: "simulation:step", ticks: 1 });
    expect(state.heroEvents.some((event) => event.type === "hero.fire_rejected")).toBe(true);

    state = applyGameCommand(state, { type: "simulation:step", ticks: 6 });
    expect(state.heroEvents.some((event) => event.type === "hero.projectile_hit_enemy")).toBe(true);
    expect(state.heroEvents.some((event) => event.type === "enemy.damaged")).toBe(true);
    expect(state.towers[0]).toMatchObject({ typeId: "ranger-post", damageDealt: 0 });
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

function hero(state: GameState, playerId: "p1" | "p2") {
  const found = state.heroes.find((candidate) => candidate.playerSlot === playerId);
  if (!found) {
    throw new Error(`Missing hero ${playerId}`);
  }
  return found;
}

function withHero(state: GameState, playerId: "p1" | "p2", position: { x: number; y: number }): GameState {
  return {
    ...state,
    heroes: state.heroes.map((candidate) =>
      candidate.playerSlot === playerId
        ? {
            ...candidate,
            x: position.x,
            y: position.y,
            velocityX: 0,
            velocityY: 0,
            fireHeld: false
          }
        : candidate
    )
  };
}
