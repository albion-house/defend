import { getDeploymentVersion } from "../deployment";
import { getMissionContent } from "./state";
import type { GameCommand, GameState, GameStateSnapshot } from "./state";
import { getSerializableSnapshot } from "./state";

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
}

declare global {
  interface Window {
    __DEFEND_DEBUG__?: DefendDebugApi;
  }
}

export function describeGameState(
  state: GameState,
  deploymentVersion = getDeploymentVersion()
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
      "simulation:step"
    ]
  };
}

export function installDebugApi(
  getState: () => GameState,
  dispatch: (command: GameCommand) => GameState,
  deploymentVersion = getDeploymentVersion()
): DefendDebugApi {
  const api: DefendDebugApi = {
    getState: () => getSerializableSnapshot(getState()),
    describe: () => describeGameState(getState(), deploymentVersion),
    dispatch: (command) => {
      const snapshot = getSerializableSnapshot(dispatch(command));
      syncDebugDom(api.describe());
      return snapshot;
    }
  };

  if (typeof window !== "undefined") {
    window.__DEFEND_DEBUG__ = api;
    syncDebugDom(api.describe());
  }

  return api;
}

export function syncDebugDom(debugState: DefendDebugState): void {
  if (typeof document === "undefined") {
    return;
  }

  const app = document.querySelector<HTMLElement>("#app");
  const deploymentVersion = document.querySelector<HTMLElement>("#deployment-version");
  const semanticState = document.querySelector<HTMLElement>("#semantic-state");

  if (app) {
    app.dataset.defendVersion = debugState.deploymentVersion;
    app.dataset.defendScene = debugState.scene;
    app.dataset.defendSession = debugState.sessionId;
    app.dataset.defendPlayers = String(debugState.activePlayers);
    app.dataset.defendMission = debugState.mission.status;
    app.dataset.defendWave = debugState.wave.active ? "active" : "idle";
    app.dataset.defendEnemies = String(debugState.activeEnemyCount);
    app.dataset.defendTowers = String(debugState.towers.length);
    app.dataset.defendObjectiveHp = debugState.objectiveHp;
  }

  if (deploymentVersion) {
    deploymentVersion.textContent = `Version ${debugState.deploymentVersion}`;
    deploymentVersion.dataset.defendVersion = debugState.deploymentVersion;
  }

  if (semanticState) {
    const occupied = debugState.buildPads.filter((pad) => pad.occupied).length;
    semanticState.textContent = [
      `Version: ${debugState.deploymentVersion}`,
      `Mission: ${debugState.mission.title} (${debugState.mission.status})`,
      `Players: ${debugState.activePlayers}/2`,
      `Objective: ${debugState.objectiveHp}`,
      `Gold: ${debugState.sharedGold}`,
      `Wave: ${formatWaveState(debugState)}`,
      `Enemies: ${debugState.activeEnemyCount} active, ${debugState.wave.enemiesLeaked} leaked`,
      `Towers: ${debugState.towers.length}`,
      `Build pads: ${occupied}/${debugState.buildPads.length}`
    ].join("\n");
  }
}

function formatWaveState(debugState: DefendDebugState): string {
  if (debugState.mission.status === "victory" || debugState.mission.status === "defeat") {
    return debugState.mission.status;
  }

  return `${debugState.wave.index}/${debugState.wave.total} ${debugState.wave.active ? "active" : "ready"}`;
}
