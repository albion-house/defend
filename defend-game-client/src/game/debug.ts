import { getMissionContent } from "./state";
import type { GameCommand, GameState, GameStateSnapshot } from "./state";
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
  deploymentVersion = fallbackDeploymentVersion
): DefendDebugApi {
  const api: DefendDebugApi = {
    getState: () => getSerializableSnapshot(getState()),
    describe: () => describeGameState(getState(), deploymentVersion),
    dispatch: (command) => {
      return getSerializableSnapshot(dispatch(command));
    }
  };

  if (typeof window !== "undefined") {
    window.__DEFEND_DEBUG__ = api;
  }

  return api;
}
