import {
  firstPlayableMission,
  getEnemyDefinition,
  getTowerDefinition,
  type DamageKind,
  type EnemyPathDefinition,
  type EnemyTypeId,
  type MissionDefinition,
  type PathId,
  type TowerTypeId,
  type Vec2
} from "./content";

export type { EnemyTypeId, PathId, TowerTypeId, Vec2 } from "./content";

export type PlayerId = "p1" | "p2";
export type MissionStatus = "ready" | "active" | "victory" | "defeat";
export type EnemyStatus = "active" | "blocked";

export interface PlayerState {
  id: PlayerId;
  label: string;
  connected: boolean;
  ready: boolean;
  position: Vec2;
}

export interface ObjectiveState {
  maxHp: number;
  currentHp: number;
  position: Vec2;
}

export interface WaveState {
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
}

export interface BuildPadState {
  id: string;
  label: string;
  role: "early" | "merge" | "cleanup";
  position: Vec2;
  occupiedBy: string | null;
}

export type EnemyPathState = EnemyPathDefinition;

export interface TowerState {
  id: string;
  padId: string;
  typeId: TowerTypeId;
  label: string;
  position: Vec2;
  cooldownTicksRemaining: number;
  damageDealt: number;
  defeatedCount: number;
}

export interface EnemyState {
  id: string;
  typeId: EnemyTypeId;
  label: string;
  pathId: PathId;
  position: Vec2;
  maxHp: number;
  currentHp: number;
  status: EnemyStatus;
  progress: number;
  distanceTravelled: number;
  speedPerTick: number;
  reward: number;
  leakDamage: number;
  physicalResist: number;
  blastResist: number;
  arcaneResist: number;
  traits: string[];
  slowedTicksRemaining: number;
  slowMultiplier: number;
  blockedBy: string | null;
}

export interface FeedbackEvent {
  id: string;
  kind: "hit" | "blast" | "slow" | "block" | "leak" | "defeat" | "build" | "wave" | "outcome";
  label: string;
  position: Vec2;
  ttlTicks: number;
}

export interface ContentSummary {
  mapId: string;
  towerTypes: number;
  enemyTypes: number;
  waves: number;
}

export interface MissionRuntimeState {
  id: string;
  title: string;
  subtitle: string;
  status: MissionStatus;
  fixedTickMs: number;
  selectedPadId: string | null;
  selectedTowerTypeId: TowerTypeId;
}

export interface GameState {
  scene: "first-playable-mission";
  sessionId: string;
  tick: number;
  sharedGold: number;
  mission: MissionRuntimeState;
  players: PlayerState[];
  objective: ObjectiveState;
  wave: WaveState;
  towers: TowerState[];
  enemies: EnemyState[];
  effects: FeedbackEvent[];
  buildPads: BuildPadState[];
  paths: EnemyPathState[];
  messageLog: string[];
  contentSummary: ContentSummary;
}

export type GameStateSnapshot = Readonly<GameState>;

export type GameCommand =
  | { type: "player:set-ready"; playerId: PlayerId; ready: boolean }
  | { type: "pad:select"; padId: string | null }
  | { type: "tower:select-type"; towerTypeId: TowerTypeId }
  | { type: "tower:build"; padId: string; towerTypeId: TowerTypeId }
  | { type: "build-pad:toggle"; padId: string; towerType?: string }
  | { type: "wave:start" }
  | { type: "wave:set-active"; active: boolean }
  | { type: "mission:restart" }
  | { type: "simulation:step"; ticks?: number }
  | { type: "simulation:tick"; deltaMs: number };

const mission = firstPlayableMission;
const objectivePosition: Vec2 = { x: 830, y: 350 };

export function createInitialGameState(sessionId = "local-dev"): GameState {
  return {
    scene: "first-playable-mission",
    sessionId,
    tick: 0,
    sharedGold: mission.startingGold,
    mission: {
      id: mission.id,
      title: mission.title,
      subtitle: mission.subtitle,
      status: "ready",
      fixedTickMs: mission.fixedTickMs,
      selectedPadId: "pad-1",
      selectedTowerTypeId: "ranger-post"
    },
    players: [
      {
        id: "p1",
        label: "Player 1",
        connected: true,
        ready: false,
        position: { x: 804, y: 286 }
      },
      {
        id: "p2",
        label: "Player 2",
        connected: false,
        ready: false,
        position: { x: 804, y: 414 }
      }
    ],
    objective: {
      maxHp: mission.objectiveHp,
      currentHp: mission.objectiveHp,
      position: objectivePosition
    },
    wave: createInitialWaveState(),
    towers: [],
    enemies: [],
    effects: [],
    buildPads: mission.buildPads.map((pad) => ({ ...pad, position: { ...pad.position }, occupiedBy: null })),
    paths: mission.paths.map((path) => ({
      ...path,
      entrance: { ...path.entrance },
      waypoints: path.waypoints.map((point) => ({ ...point }))
    })),
    messageLog: [
      "Build on a pad, start scouts, then reinforce the merge.",
      "Saltmarsh Crossing ready"
    ],
    contentSummary: {
      mapId: mission.id,
      towerTypes: mission.towers.length,
      enemyTypes: mission.enemies.length,
      waves: mission.waves.length
    }
  };
}

export function applyGameCommand(state: GameState, command: GameCommand): GameState {
  switch (command.type) {
    case "player:set-ready":
      return withLog(
        {
          ...state,
          players: state.players.map((player) =>
            player.id === command.playerId ? { ...player, ready: command.ready } : player
          )
        },
        `${command.playerId.toUpperCase()} ${command.ready ? "ready" : "standing by"}`
      );
    case "pad:select":
      return {
        ...state,
        mission: { ...state.mission, selectedPadId: command.padId }
      };
    case "tower:select-type":
      return {
        ...state,
        mission: { ...state.mission, selectedTowerTypeId: command.towerTypeId }
      };
    case "tower:build":
      return buildTower(state, command.padId, command.towerTypeId);
    case "build-pad:toggle":
      return togglePadCompatibility(state, command.padId, command.towerType);
    case "wave:start":
      return startWave(state);
    case "wave:set-active":
      return command.active ? startWave(state) : resetActiveWave(state);
    case "mission:restart":
      return createInitialGameState(state.sessionId);
    case "simulation:step":
      return advanceSimulationSteps(state, command.ticks ?? 1);
    case "simulation:tick":
      return advanceSimulationSteps(state, Math.max(1, Math.floor(command.deltaMs / state.mission.fixedTickMs)));
  }
}

export function getSerializableSnapshot(state: GameState): GameStateSnapshot {
  return structuredClone(state);
}

export function getMissionContent(): MissionDefinition {
  return mission;
}

function createInitialWaveState(): WaveState {
  return {
    index: 1,
    total: mission.waves.length,
    active: false,
    tick: 0,
    enemiesRemaining: 0,
    enemiesSpawned: 0,
    enemiesDefeated: 0,
    enemiesLeaked: 0,
    wavesCompleted: 0,
    completed: false
  };
}

function buildTower(state: GameState, padId: string, towerTypeId: TowerTypeId): GameState {
  if (state.mission.status === "victory" || state.mission.status === "defeat") {
    return withLog(state, "Restart to build again");
  }

  const pad = state.buildPads.find((candidate) => candidate.id === padId);
  if (!pad) {
    return withLog(state, `Unknown pad ${padId}`);
  }
  if (pad.occupiedBy) {
    return withLog(state, `${pad.label} is already occupied`);
  }

  const definition = getTowerDefinition(towerTypeId, mission);
  if (state.sharedGold < definition.cost) {
    return withLog(state, `Need ${definition.cost} gold for ${definition.label}`);
  }

  const towerId = `tower-${state.towers.length + 1}-${towerTypeId}`;
  const tower: TowerState = {
    id: towerId,
    padId,
    typeId: towerTypeId,
    label: definition.label,
    position: { ...pad.position },
    cooldownTicksRemaining: 0,
    damageDealt: 0,
    defeatedCount: 0
  };

  return withEvent(
    withLog(
      {
        ...state,
        sharedGold: state.sharedGold - definition.cost,
        mission: { ...state.mission, selectedPadId: padId, selectedTowerTypeId: towerTypeId },
        towers: [...state.towers, tower],
        buildPads: state.buildPads.map((candidate) =>
          candidate.id === padId ? { ...candidate, occupiedBy: towerId } : candidate
        )
      },
      `${definition.label} built at ${pad.label}`
    ),
    "build",
    definition.label,
    pad.position
  );
}

function togglePadCompatibility(state: GameState, padId: string, towerType?: string): GameState {
  const pad = state.buildPads.find((candidate) => candidate.id === padId);
  if (!pad) {
    return state;
  }
  if (!pad.occupiedBy) {
    return buildTower(state, padId, coerceTowerType(towerType));
  }

  const tower = state.towers.find((candidate) => candidate.id === pad.occupiedBy);
  const refund = tower ? Math.floor(getTowerDefinition(tower.typeId, mission).cost * 0.7) : 0;
  return withLog(
    {
      ...state,
      sharedGold: state.sharedGold + refund,
      towers: state.towers.filter((candidate) => candidate.id !== pad.occupiedBy),
      buildPads: state.buildPads.map((candidate) =>
        candidate.id === padId ? { ...candidate, occupiedBy: null } : candidate
      )
    },
    `${pad.label} cleared`
  );
}

function coerceTowerType(value: string | undefined): TowerTypeId {
  return mission.towers.some((tower) => tower.id === value) ? (value as TowerTypeId) : "ranger-post";
}

function startWave(state: GameState): GameState {
  if (state.mission.status === "victory" || state.mission.status === "defeat") {
    return state;
  }
  if (state.wave.active) {
    return state;
  }
  const wave = getCurrentWave(state);
  return withEvent(
    withLog(
      {
        ...state,
        mission: { ...state.mission, status: "active" },
        wave: {
          ...state.wave,
          active: true,
          tick: 0,
          enemiesRemaining: wave.spawns.length,
          enemiesSpawned: 0,
          enemiesDefeated: 0,
          enemiesLeaked: 0,
          completed: false
        }
      },
      `${wave.label} started`
    ),
    "wave",
    wave.label,
    { x: 650, y: 350 }
  );
}

function resetActiveWave(state: GameState): GameState {
  return withLog(
    {
      ...state,
      mission: { ...state.mission, status: "ready" },
      wave: {
        ...state.wave,
        active: false,
        tick: 0,
        enemiesRemaining: 0,
        enemiesSpawned: 0,
        enemiesDefeated: 0,
        enemiesLeaked: 0,
        completed: false
      },
      enemies: [],
      effects: []
    },
    `Wave ${state.wave.index} reset`
  );
}

function advanceSimulationSteps(state: GameState, ticks: number): GameState {
  let next = state;
  const boundedTicks = Math.max(0, Math.min(600, Math.floor(ticks)));
  for (let tick = 0; tick < boundedTicks; tick += 1) {
    next = advanceOneTick(next);
  }
  return next;
}

function advanceOneTick(state: GameState): GameState {
  if (state.mission.status === "victory" || state.mission.status === "defeat") {
    return expireEffects({ ...state, tick: state.tick + 1 });
  }

  let next = expireEffects({ ...state, tick: state.tick + 1 });
  if (!next.wave.active) {
    return next;
  }

  next = spawnDueEnemies(next);
  next = applyMenderSupport(next);
  next = applyBlockers(next);
  next = applyTowerAttacks(next);
  next = moveEnemies(next);
  next = finishWaveIfDone(next);
  return next;
}

function spawnDueEnemies(state: GameState): GameState {
  const wave = getCurrentWave(state);
  const dueSpawns = wave.spawns
    .map((spawn, index) => ({ spawn, index }))
    .filter(({ spawn, index }) => spawn.atTick === state.wave.tick && !state.enemies.some((enemy) => enemy.id === enemyId(wave.id, index)));

  if (dueSpawns.length === 0) {
    return {
      ...state,
      wave: { ...state.wave, tick: state.wave.tick + 1 }
    };
  }

  const spawned = dueSpawns.map(({ spawn, index }) => createEnemy(wave.id, index, spawn.enemyTypeId, spawn.pathId));
  return withLogEntries(
    {
      ...state,
      enemies: [...state.enemies, ...spawned].sort(compareById),
      wave: {
        ...state.wave,
        tick: state.wave.tick + 1,
        enemiesSpawned: state.wave.enemiesSpawned + spawned.length
      }
    },
    spawned.map((enemy) => `${enemy.label} entered ${enemy.pathId}`)
  );
}

function createEnemy(waveId: string, spawnIndex: number, enemyTypeId: EnemyTypeId, pathId: PathId): EnemyState {
  const definition = getEnemyDefinition(enemyTypeId, mission);
  const path = requirePath(mission.paths, pathId);
  return {
    id: enemyId(waveId, spawnIndex),
    typeId: enemyTypeId,
    label: definition.label,
    pathId,
    position: { ...path.entrance },
    maxHp: definition.maxHp,
    currentHp: definition.maxHp,
    status: "active",
    progress: 0,
    distanceTravelled: 0,
    speedPerTick: definition.speedPerTick,
    reward: definition.reward,
    leakDamage: definition.leakDamage,
    physicalResist: definition.physicalResist,
    blastResist: definition.blastResist,
    arcaneResist: definition.arcaneResist,
    traits: [...definition.traits],
    slowedTicksRemaining: 0,
    slowMultiplier: 1,
    blockedBy: null
  };
}

function enemyId(waveId: string, spawnIndex: number): string {
  return `${waveId}-enemy-${String(spawnIndex + 1).padStart(2, "0")}`;
}

function applyMenderSupport(state: GameState): GameState {
  if (state.tick % 10 !== 0) {
    return state;
  }

  const enemies = state.enemies.map((enemy) => ({ ...enemy }));
  const events: FeedbackEvent[] = [];
  for (const mender of enemies.filter((enemy) => enemy.typeId === "mender").sort(compareById)) {
    const target = enemies
      .filter((enemy) => enemy.id !== mender.id && enemy.currentHp < enemy.maxHp && distance(enemy.position, mender.position) <= 95)
      .sort((a, b) => a.currentHp - b.currentHp || compareById(a, b))[0];
    if (target) {
      target.currentHp = Math.min(target.maxHp, target.currentHp + 8);
      events.push(createEvent(state, "hit", "mend", target.position));
    }
  }
  return events.length > 0 ? { ...state, enemies, effects: [...events, ...state.effects].slice(0, 24) } : state;
}

function applyBlockers(state: GameState): GameState {
  const blockerTowers = state.towers
    .filter((tower) => getTowerDefinition(tower.typeId, mission).blockCapacity)
    .sort(compareById);
  if (blockerTowers.length === 0 || state.enemies.length === 0) {
    return state;
  }

  let enemies = state.enemies.map((enemy) => ({ ...enemy, blockedBy: null as string | null, status: "active" as EnemyStatus }));
  let next = state;
  for (const tower of blockerTowers) {
    const definition = getTowerDefinition(tower.typeId, mission);
    const targets = enemies
      .filter((enemy) => distance(enemy.position, tower.position) <= (definition.blockRadius ?? 0))
      .sort((a, b) => b.distanceTravelled - a.distanceTravelled || compareById(a, b))
      .slice(0, definition.blockCapacity ?? 0);
    for (const target of targets) {
      target.status = "blocked";
      target.blockedBy = tower.id;
      target.currentHp = Math.max(0, target.currentHp - (definition.blockDamagePerTick ?? 0));
      next = withEvent(next, "block", "blocked", target.position);
    }
  }

  next = defeatZeroHpEnemies({ ...next, enemies });
  return next;
}

function applyTowerAttacks(state: GameState): GameState {
  let next = { ...state, towers: state.towers.map((tower) => ({ ...tower })), enemies: state.enemies.map((enemy) => ({ ...enemy })) };

  for (const tower of next.towers.sort(compareById)) {
    const definition = getTowerDefinition(tower.typeId, mission);
    if (definition.blockCapacity) {
      continue;
    }

    if (tower.cooldownTicksRemaining > 0) {
      tower.cooldownTicksRemaining -= 1;
      continue;
    }

    const target = selectTarget(tower, definition.range, next.enemies);
    if (!target) {
      continue;
    }

    const affected =
      definition.splashRadius && definition.splashRadius > 0
        ? next.enemies.filter((enemy) => distance(enemy.position, target.position) <= (definition.splashRadius ?? 0))
        : [target];

    let defeatedByAttack = 0;
    for (const enemy of affected.sort(compareById)) {
      const damage = resolveDamage(definition.damage, definition.damageKind, enemy);
      enemy.currentHp = Math.max(0, enemy.currentHp - damage);
      tower.damageDealt += damage;
      if (definition.slowTicks && enemy.currentHp > 0) {
        enemy.slowedTicksRemaining = Math.max(enemy.slowedTicksRemaining, definition.slowTicks);
        enemy.slowMultiplier = definition.slowMultiplier ?? 1;
      }
      if (enemy.currentHp === 0) {
        defeatedByAttack += 1;
      }
    }
    tower.defeatedCount += defeatedByAttack;
    tower.cooldownTicksRemaining = definition.cooldownTicks;
    next = withEvent(
      next,
      definition.splashRadius ? "blast" : definition.slowTicks ? "slow" : "hit",
      definition.label,
      target.position
    );
  }

  return defeatZeroHpEnemies(next);
}

function selectTarget(tower: TowerState, range: number, enemies: EnemyState[]): EnemyState | undefined {
  return enemies
    .filter((enemy) => enemy.currentHp > 0 && distance(enemy.position, tower.position) <= range)
    .sort((a, b) => b.distanceTravelled - a.distanceTravelled || compareById(a, b))[0];
}

function resolveDamage(baseDamage: number, damageKind: DamageKind, enemy: EnemyState): number {
  const resist =
    damageKind === "physical" ? enemy.physicalResist : damageKind === "blast" ? enemy.blastResist : enemy.arcaneResist;
  return Math.max(1, Math.round(baseDamage * (1 - resist)));
}

function defeatZeroHpEnemies(state: GameState): GameState {
  const defeated = state.enemies.filter((enemy) => enemy.currentHp <= 0).sort(compareById);
  if (defeated.length === 0) {
    return state;
  }
  const reward = defeated.reduce((total, enemy) => total + enemy.reward, 0);
  const events = defeated.map((enemy) => createEvent(state, "defeat", `+${enemy.reward}`, enemy.position));
  return withLogEntries(
    {
      ...state,
      sharedGold: state.sharedGold + reward,
      enemies: state.enemies.filter((enemy) => enemy.currentHp > 0),
      effects: [...events, ...state.effects].slice(0, 24),
      wave: {
        ...state.wave,
        enemiesDefeated: state.wave.enemiesDefeated + defeated.length,
        enemiesRemaining: Math.max(0, state.wave.enemiesRemaining - defeated.length)
      }
    },
    defeated.map((enemy) => `${enemy.label} defeated`)
  );
}

function moveEnemies(state: GameState): GameState {
  if (state.enemies.length === 0) {
    return state;
  }

  const activeEnemies: EnemyState[] = [];
  const leaked: EnemyState[] = [];
  for (const enemy of state.enemies.sort(compareById)) {
    const path = requirePath(state.paths, enemy.pathId);
    const totalDistance = getPathTotalDistance(path);
    const slowMultiplier = enemy.slowedTicksRemaining > 0 ? enemy.slowMultiplier : 1;
    const movement = enemy.status === "blocked" ? 0 : enemy.speedPerTick * slowMultiplier;
    const nextDistance = enemy.distanceTravelled + movement;

    if (nextDistance >= totalDistance) {
      leaked.push(enemy);
      continue;
    }

    activeEnemies.push({
      ...enemy,
      status: enemy.status,
      slowedTicksRemaining: Math.max(0, enemy.slowedTicksRemaining - 1),
      slowMultiplier: enemy.slowedTicksRemaining > 1 ? enemy.slowMultiplier : 1,
      distanceTravelled: roundForSnapshot(nextDistance),
      progress: roundForSnapshot(nextDistance / totalDistance),
      position: pointAtDistance(path, nextDistance)
    });
  }

  if (leaked.length === 0) {
    return { ...state, enemies: activeEnemies };
  }

  const leakDamage = leaked.reduce((total, enemy) => total + enemy.leakDamage, 0);
  const objectiveHp = Math.max(0, state.objective.currentHp - leakDamage);
  const next = withLogEntries(
    {
      ...state,
      objective: { ...state.objective, currentHp: objectiveHp },
      enemies: activeEnemies,
      effects: [
        ...leaked.map((enemy) => createEvent(state, "leak", `-${enemy.leakDamage}`, state.objective.position)),
        ...state.effects
      ].slice(0, 24),
      wave: {
        ...state.wave,
        enemiesLeaked: state.wave.enemiesLeaked + leaked.length,
        enemiesRemaining: Math.max(0, state.wave.enemiesRemaining - leaked.length)
      }
    },
    leaked.map((enemy) => `${enemy.label} leaked for ${enemy.leakDamage}`)
  );

  if (objectiveHp <= 0) {
    return withEvent(
      withLog(
        {
          ...next,
          mission: { ...next.mission, status: "defeat" },
          wave: { ...next.wave, active: false },
          enemies: []
        },
        "Objective lost. Restart and try a tighter merge defense."
      ),
      "outcome",
      "Defeat",
      state.objective.position
    );
  }

  return next;
}

function finishWaveIfDone(state: GameState): GameState {
  const wave = getCurrentWave(state);
  const allSpawned = state.wave.tick > Math.max(...wave.spawns.map((spawn) => spawn.atTick));
  if (!allSpawned || state.enemies.length > 0 || state.wave.enemiesRemaining > 0) {
    return state;
  }

  const isFinalWave = state.wave.index >= state.wave.total;
  const nextGold = state.sharedGold + wave.reward;
  const completedWaves = state.wave.wavesCompleted + 1;
  const nextStatus: MissionStatus = isFinalWave ? "victory" : "ready";
  const message = isFinalWave ? "Saltmarsh Crossing secured" : `${wave.label} cleared: +${wave.reward} gold`;

  return withEvent(
    withLog(
      {
        ...state,
        sharedGold: nextGold,
        mission: { ...state.mission, status: nextStatus },
        wave: {
          ...state.wave,
          index: isFinalWave ? state.wave.index : state.wave.index + 1,
          active: false,
          tick: 0,
          enemiesRemaining: 0,
          enemiesSpawned: 0,
          enemiesDefeated: 0,
          enemiesLeaked: 0,
          wavesCompleted: completedWaves,
          completed: isFinalWave
        }
      },
      message
    ),
    "outcome",
    isFinalWave ? "Victory" : "Wave clear",
    { x: 650, y: 350 }
  );
}

function expireEffects(state: GameState): GameState {
  return {
    ...state,
    effects: state.effects
      .map((effect) => ({ ...effect, ttlTicks: effect.ttlTicks - 1 }))
      .filter((effect) => effect.ttlTicks > 0)
  };
}

function getCurrentWave(state: GameState) {
  const wave = mission.waves[state.wave.index - 1];
  if (!wave) {
    throw new Error(`Missing wave ${state.wave.index}`);
  }
  return wave;
}

function requirePath(paths: EnemyPathState[], pathId: PathId): EnemyPathState {
  const path = paths.find((candidate) => candidate.id === pathId);
  if (!path) {
    throw new Error(`Missing enemy path ${pathId}`);
  }
  return path;
}

function getPathPoints(path: EnemyPathState): Vec2[] {
  return [path.entrance, ...path.waypoints];
}

function getPathTotalDistance(path: EnemyPathState): number {
  const points = getPathPoints(path);
  return points.slice(1).reduce((total, point, index) => total + distance(points[index], point), 0);
}

function pointAtDistance(path: EnemyPathState, targetDistance: number): Vec2 {
  const points = getPathPoints(path);
  let remainingDistance = targetDistance;

  for (let index = 1; index < points.length; index += 1) {
    const start = points[index - 1];
    const end = points[index];
    const segmentDistance = distance(start, end);

    if (remainingDistance <= segmentDistance) {
      const segmentProgress = segmentDistance === 0 ? 0 : remainingDistance / segmentDistance;
      return {
        x: roundForSnapshot(lerp(start.x, end.x, segmentProgress)),
        y: roundForSnapshot(lerp(start.y, end.y, segmentProgress))
      };
    }

    remainingDistance -= segmentDistance;
  }

  return { ...points[points.length - 1] };
}

function distance(a: Vec2, b: Vec2): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

function roundForSnapshot(value: number): number {
  return Number(value.toFixed(3));
}

function compareById<T extends { id: string }>(a: T, b: T): number {
  return a.id.localeCompare(b.id);
}

function withEvent(
  state: GameState,
  kind: FeedbackEvent["kind"],
  label: string,
  position: Vec2
): GameState {
  return {
    ...state,
    effects: [createEvent(state, kind, label, position), ...state.effects].slice(0, 24)
  };
}

function createEvent(
  state: GameState,
  kind: FeedbackEvent["kind"],
  label: string,
  position: Vec2
): FeedbackEvent {
  return {
    id: `fx-${state.tick}-${kind}-${Math.abs(Math.round(position.x * 13 + position.y * 7))}`,
    kind,
    label,
    position: { ...position },
    ttlTicks: 10
  };
}

function withLog(state: GameState, entry: string): GameState {
  return withLogEntries(state, [entry]);
}

function withLogEntries(state: GameState, entries: string[]): GameState {
  if (entries.length === 0) {
    return state;
  }

  return {
    ...state,
    messageLog: [...entries.reverse(), ...state.messageLog].slice(0, 5)
  };
}
