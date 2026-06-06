export {
  mountDefendGame,
  type DefendRuntime,
  type MountDefendGameOptions
} from "./runtime/phaserApp";
export {
  describeGameState,
  normalizeDeploymentVersion,
  type DefendDebugApi,
  type DefendDebugState,
  type DefendRenderedEntities,
  type DefendTestDriver
} from "./game/debug";
export {
  applyGameCommand,
  createInitialGameState,
  getMissionContent,
  getSerializableSnapshot,
  type GameCommand,
  type GameState,
  type GameStateSnapshot,
  type HeroEvent,
  type HeroInputPayload,
  type HeroProjectileState,
  type HeroState,
  type PlayerId,
  type TowerTypeId
} from "./game/state";
