export {
  mountDefendGame,
  type DefendRuntime,
  type MountDefendGameOptions
} from "./runtime/phaserApp";
export {
  describeGameState,
  normalizeDeploymentVersion,
  type DefendDebugApi,
  type DefendDebugState
} from "./game/debug";
export {
  applyGameCommand,
  createInitialGameState,
  getMissionContent,
  getSerializableSnapshot,
  type GameCommand,
  type GameState,
  type GameStateSnapshot,
  type TowerTypeId
} from "./game/state";
