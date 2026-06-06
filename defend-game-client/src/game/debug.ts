import { getMissionContent } from "./state";
import type { GameCommand, GameState, GameStateSnapshot, HeroInputPayload, PlayerId, Vec2 } from "./state";
import { getSerializableSnapshot } from "./state";

const fallbackDeploymentVersion = "0.1.0+local";

export function normalizeDeploymentVersion(value: string | undefined): string {
  const version = value?.trim();
  return version && version.length > 0 ? version : fallbackDeploymentVersion;
}

export interface DefendDebugState {
  deploymentVersion: string;
  scene: GameState["scene"];
  sessionId: string;
  mission: {
    id: string;
    title: string;
    status: string;
    tick: number;
    selectedPadId: string | null;
    selectedTowerTypeId: string;
  };
  activePlayers: number;
  sharedGold: number;
  objectiveHp: string;
  wave: {
    index: number;
    total: number;
    active: boolean;
    tick: number;
    enemiesRemaining: number;
    enemiesSpawned: number;
    enemiesDefeated: number;
    enemiesLeaked: number;
    wavesCompleted: number;
    completed: boolean;
  };
  enemies: Array<{
    id: string;
    typeId: string;
    label: string;
    pathId: string;
    position: {
      x: number;
      y: number;
    };
    hp: string;
    status: string;
    progress: number;
    traits: string[];
  }>;
  towers: Array<{
    id: string;
    typeId: string;
    label: string;
    padId: string;
    damageDealt: number;
    defeatedCount: number;
  }>;
  effects: Array<{
    kind: string;
    label: string;
  }>;
  heroes: Array<{
    heroId: string;
    playerSlot: PlayerId;
    connected: boolean;
    alive: boolean;
    position: Vec2;
    velocity: Vec2;
    aim: Vec2;
    cooldownTicks: number;
  }>;
  heroProjectiles: Array<{
    projectileId: string;
    ownerHeroId: string;
    position: Vec2;
    velocity: Vec2;
    damage: number;
    expiresAtTick: number;
  }>;
  heroEvents: GameState["heroEvents"];
  activeEnemyCount: number;
  enemyPaths: Record<string, number>;
  buildPads: Array<{
    id: string;
    label: string;
    role: string;
    occupied: boolean;
    occupiedBy: string | null;
  }>;
  content: {
    mapId: string;
    towerTypes: number;
    enemyTypes: number;
    waves: number;
    towerLabels: string[];
    enemyLabels: string[];
  };
  controls: string[];
}

export interface DefendDebugApi {
  getState(): GameStateSnapshot;
  describe(): DefendDebugState;
  dispatch(command: GameCommand): GameStateSnapshot;
  testDriver?: DefendTestDriver;
}

export interface DefendRenderedEntities {
  heroes: DefendDebugState["heroes"];
  heroProjectiles: DefendDebugState["heroProjectiles"];
  enemies: DefendDebugState["enemies"];
  towers: DefendDebugState["towers"];
}

export interface DefendTestDriver {
  getPlayerSlot(): PlayerId;
  getLatestRoomState(): GameStateSnapshot;
  getRenderedEntities(): DefendRenderedEntities;
  pressKey(key: string): GameStateSnapshot;
  releaseKey(key: string): GameStateSnapshot;
  aimAtWorld(x: number, y: number): GameStateSnapshot;
  fireDown(): GameStateSnapshot;
  fireUp(): GameStateSnapshot;
  waitForTick(tick: number): GameStateSnapshot;
  getEventLog(): GameState["heroEvents"];
}

export interface InstallDebugApiOptions {
  enableTestDriver?: boolean;
  playerSlot?: PlayerId;
}

declare global {
  interface Window {
    __DEFEND_DEBUG__?: DefendDebugApi;
  }
}

export function describeGameState(
  state: GameState,
  deploymentVersion = fallbackDeploymentVersion
): DefendDebugState {
  const content = getMissionContent();
  return {
    deploymentVersion,
    scene: state.scene,
    sessionId: state.sessionId,
    mission: {
      id: state.mission.id,
      title: state.mission.title,
      status: state.mission.status,
      tick: state.tick,
      selectedPadId: state.mission.selectedPadId,
      selectedTowerTypeId: state.mission.selectedTowerTypeId
    },
    activePlayers: state.players.filter((player) => player.connected).length,
    sharedGold: state.sharedGold,
    objectiveHp: `${state.objective.currentHp}/${state.objective.maxHp}`,
    wave: { ...state.wave },
    enemies: state.enemies.map((enemy) => ({
      id: enemy.id,
      typeId: enemy.typeId,
      label: enemy.label,
      pathId: enemy.pathId,
      position: { ...enemy.position },
      hp: `${enemy.currentHp}/${enemy.maxHp}`,
      status: enemy.status,
      progress: enemy.progress,
      traits: [...enemy.traits]
    })),
    towers: state.towers.map((tower) => ({
      id: tower.id,
      typeId: tower.typeId,
      label: tower.label,
      padId: tower.padId,
      damageDealt: tower.damageDealt,
      defeatedCount: tower.defeatedCount
    })),
    effects: state.effects.map((effect) => ({
      kind: effect.kind,
      label: effect.label
    })),
    heroes: state.heroes
      .filter((hero) => hero.connected)
      .map((hero) => ({
        heroId: hero.heroId,
        playerSlot: hero.playerSlot,
        connected: hero.connected,
        alive: hero.alive,
        position: { x: hero.x, y: hero.y },
        velocity: { x: hero.velocityX, y: hero.velocityY },
        aim: { x: hero.aimX, y: hero.aimY },
        cooldownTicks: hero.weaponCooldownRemainingTicks
      })),
    heroProjectiles: state.heroProjectiles.map((projectile) => ({
      projectileId: projectile.projectileId,
      ownerHeroId: projectile.ownerHeroId,
      position: { x: projectile.x, y: projectile.y },
      velocity: { x: projectile.velocityX, y: projectile.velocityY },
      damage: projectile.damage,
      expiresAtTick: projectile.expiresAtTick
    })),
    heroEvents: [...state.heroEvents],
    activeEnemyCount: state.enemies.length,
    enemyPaths: state.enemies.reduce<Record<string, number>>((counts, enemy) => {
      counts[enemy.pathId] = (counts[enemy.pathId] ?? 0) + 1;
      return counts;
    }, {}),
    buildPads: state.buildPads.map((pad) => ({
      id: pad.id,
      label: pad.label,
      role: pad.role,
      occupied: Boolean(pad.occupiedBy),
      occupiedBy: pad.occupiedBy
    })),
    content: {
      mapId: state.contentSummary.mapId,
      towerTypes: state.contentSummary.towerTypes,
      enemyTypes: state.contentSummary.enemyTypes,
      waves: state.contentSummary.waves,
      towerLabels: content.towers.map((tower) => tower.label),
      enemyLabels: content.enemies.map((enemy) => enemy.label)
    },
    controls: [
      "player:set-ready",
      "pad:select",
      "tower:select-type",
      "tower:build",
      "wave:start",
      "mission:restart",
      "simulation:step",
      "hero_input"
    ]
  };
}

export function installDebugApi(
  getState: () => GameState,
  dispatch: (command: GameCommand) => GameState,
  deploymentVersion = fallbackDeploymentVersion,
  options: InstallDebugApiOptions = {}
): DefendDebugApi {
  const api: DefendDebugApi = {
    getState: () => getSerializableSnapshot(getState()),
    describe: () => describeGameState(getState(), deploymentVersion),
    dispatch: (command) => {
      return getSerializableSnapshot(dispatch(command));
    }
  };
  if (options.enableTestDriver) {
    api.testDriver = createTestDriver(getState, dispatch, options.playerSlot ?? "p1");
  }

  if (typeof window !== "undefined") {
    window.__DEFEND_DEBUG__ = api;
  }

  return api;
}

function createTestDriver(
  getState: () => GameState,
  dispatch: (command: GameCommand) => GameState,
  playerSlot: PlayerId
): DefendTestDriver {
  let inputSeq = 0;
  const keys = new Set<string>();
  let aimTarget: Vec2 | null = null;
  let fireHeld = false;

  function sendInput(): GameStateSnapshot {
    const hero = getState().heroes.find((candidate) => candidate.playerSlot === playerSlot);
    inputSeq = Math.max(inputSeq, hero?.lastInputSeq ?? 0);
    inputSeq += 1;
    const payload = buildHeroInput(getState(), playerSlot, inputSeq, keys, aimTarget, fireHeld);
    return getSerializableSnapshot(dispatch({ type: "hero_input", playerId: playerSlot, ...payload }));
  }

  return {
    getPlayerSlot: () => playerSlot,
    getLatestRoomState: () => getSerializableSnapshot(getState()),
    getRenderedEntities: () => {
      const description = describeGameState(getState());
      return {
        heroes: description.heroes,
        heroProjectiles: description.heroProjectiles,
        enemies: description.enemies,
        towers: description.towers
      };
    },
    pressKey: (key) => {
      keys.add(normalizeKey(key));
      return sendInput();
    },
    releaseKey: (key) => {
      keys.delete(normalizeKey(key));
      return sendInput();
    },
    aimAtWorld: (x, y) => {
      aimTarget = { x, y };
      return sendInput();
    },
    fireDown: () => {
      fireHeld = true;
      return sendInput();
    },
    fireUp: () => {
      fireHeld = false;
      return sendInput();
    },
    waitForTick: (tick) => {
      let state = getState();
      const boundedTarget = Math.max(state.tick, Math.floor(tick));
      while (state.tick < boundedTarget) {
        state = dispatch({ type: "simulation:step", ticks: Math.min(20, boundedTarget - state.tick) });
      }
      return getSerializableSnapshot(state);
    },
    getEventLog: () => [...getState().heroEvents]
  };
}

function buildHeroInput(
  state: GameState,
  playerSlot: PlayerId,
  inputSeq: number,
  keys: Set<string>,
  aimTarget: Vec2 | null,
  fireHeld: boolean
): HeroInputPayload {
  const moveX = (keys.has("d") || keys.has("arrowright") ? 1 : 0) + (keys.has("a") || keys.has("arrowleft") ? -1 : 0);
  const moveY = (keys.has("s") || keys.has("arrowdown") ? 1 : 0) + (keys.has("w") || keys.has("arrowup") ? -1 : 0);
  const hero = state.heroes.find((candidate) => candidate.playerSlot === playerSlot);
  const aimX = aimTarget && hero ? aimTarget.x - hero.x : (hero?.aimX ?? -1);
  const aimY = aimTarget && hero ? aimTarget.y - hero.y : (hero?.aimY ?? 0);
  return {
    inputSeq,
    moveX,
    moveY,
    aimX,
    aimY,
    fireHeld
  };
}

function normalizeKey(key: string): string {
  return key.trim().toLowerCase();
}
