import {
  firstPlayableMission,
  getEnemyDefinition,
  getTowerDefinition,
  type DamageKind,
  type EnemyPathDefinition,
  type EnemyTypeId,
  type MissionDefinition,
  type PathId,
  type RectDefinition,
  type TowerTypeId,
  type Vec2
} from "./content";

export type { EnemyTypeId, PathId, TowerTypeId, Vec2 } from "./content";

export type PlayerId = "p1" | "p2";
export type MissionStatus = "ready" | "active" | "victory" | "defeat";
export type EnemyStatus = "active" | "blocked";
export type BlockerType = "tower" | "wall" | "bounds";

export interface CircleCollider {
  type: "circle";
  x: number;
  y: number;
  radius: number;
}

export interface RectCollider {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Collider = CircleCollider | RectCollider;

export interface CollisionBlockerState {
  blockerId: string;
  blockerType: BlockerType;
  collider: Collider;
}

export interface HeroInputPayload {
  inputSeq: number;
  moveX: number;
  moveY: number;
  aimX: number;
  aimY: number;
  fireHeld: boolean;
}

export interface HeroState {
  heroId: string;
  playerSlot: PlayerId;
  connected: boolean;
  alive: boolean;
  x: number;
  y: number;
  radius: number;
  velocityX: number;
  velocityY: number;
  maxSpeed: number;
  aimX: number;
  aimY: number;
  weaponCooldownTicks: number;
  weaponCooldownRemainingTicks: number;
  weaponRange: number;
  weaponDamage: number;
  lastInputSeq: number;
  lastInputTick: number;
  fireHeld: boolean;
}

export interface HeroProjectileState {
  projectileId: string;
  ownerHeroId: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  radius: number;
  damage: number;
  spawnTick: number;
  expiresAtTick: number;
}

export type HeroEventType =
  | "hero.input_received"
  | "hero.input_rejected"
  | "hero.velocity_updated"
  | "hero.moved"
  | "hero.collision_resolved"
  | "hero.fire_requested"
  | "hero.fired"
  | "hero.fire_rejected"
  | "hero.projectile_spawned"
  | "hero.projectile_hit_enemy"
  | "enemy.damaged"
  | "enemy.killed";

export interface HeroEvent {
  id: string;
  tick: number;
  type: HeroEventType;
  heroId?: string;
  playerSlot?: PlayerId;
  projectileId?: string;
  enemyId?: string;
  blockerType?: BlockerType;
  blockerId?: string;
  attemptedPosition?: Vec2;
  resolvedPosition?: Vec2;
  position?: Vec2;
  damage?: number;
  reason?: string;
}

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
  kind: "hit" | "blast" | "slow" | "block" | "leak" | "defeat" | "build" | "wave" | "outcome" | "hero";
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
  heroes: HeroState[];
  heroProjectiles: HeroProjectileState[];
  heroEvents: HeroEvent[];
  objective: ObjectiveState;
  wave: WaveState;
  towers: TowerState[];
  enemies: EnemyState[];
  effects: FeedbackEvent[];
  buildPads: BuildPadState[];
  paths: EnemyPathState[];
  playableBounds: RectDefinition;
  wallBlockers: CollisionBlockerState[];
  messageLog: string[];
  contentSummary: ContentSummary;
}

export type GameStateSnapshot = Readonly<GameState>;

export type GameCommand =
  | { type: "player:set-ready"; playerId: PlayerId; ready: boolean }
  | ({ type: "hero_input"; playerId: PlayerId } & HeroInputPayload)
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
const heroRadius = 18;
const heroMaxSpeed = 180;
const heroProjectileSpeed = 360;
const towerCollisionRadius = 34;
const defaultAim: Vec2 = { x: -1, y: 0 };

export function createInitialGameState(sessionId = "local-dev"): GameState {
  const players: PlayerState[] = [
    {
      id: "p1",
      label: "Player 1",
      connected: true,
      ready: false,
      position: { x: 850, y: 250 }
    },
    {
      id: "p2",
      label: "Player 2",
      connected: false,
      ready: false,
      position: { x: 850, y: 470 }
    }
  ];

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
    players,
    heroes: players.map(createHeroForPlayer),
    heroProjectiles: [],
    heroEvents: [],
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
    playableBounds: { ...mission.playableBounds },
    wallBlockers: mission.wallBlockers.map((blocker) => ({
      blockerId: blocker.id,
      blockerType: "wall",
      collider: { type: "rect", ...blocker.bounds }
    })),
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

function createHeroForPlayer(player: PlayerState): HeroState {
  return {
    heroId: `hero:${player.id}`,
    playerSlot: player.id,
    connected: player.connected,
    alive: true,
    x: player.position.x,
    y: player.position.y,
    radius: heroRadius,
    velocityX: 0,
    velocityY: 0,
    maxSpeed: heroMaxSpeed,
    aimX: defaultAim.x,
    aimY: defaultAim.y,
    weaponCooldownTicks: 8,
    weaponCooldownRemainingTicks: 0,
    weaponRange: 260,
    weaponDamage: 22,
    lastInputSeq: 0,
    lastInputTick: 0,
    fireHeld: false
  };
}

export function applyGameCommand(state: GameState, command: GameCommand): GameState {
  switch (command.type) {
    case "player:set-ready":
      return withLog(
        {
          ...state,
          players: state.players.map((player) =>
            player.id === command.playerId ? { ...player, connected: command.ready ? true : player.connected, ready: command.ready } : player
          ),
          heroes: state.heroes.map((hero) =>
            hero.playerSlot === command.playerId ? { ...hero, connected: command.ready ? true : hero.connected } : hero
          )
        },
        `${command.playerId.toUpperCase()} ${command.ready ? "ready" : "standing by"}`
      );
    case "hero_input":
      return applyHeroInput(state, command.playerId, command);
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

function applyHeroInput(state: GameState, playerSlot: PlayerId, input: HeroInputPayload): GameState {
  const hero = state.heroes.find((candidate) => candidate.playerSlot === playerSlot);
  if (!hero || !hero.connected || !hero.alive) {
    return withHeroEvent(state, {
      type: "hero.input_rejected",
      playerSlot,
      reason: "hero-unavailable"
    });
  }
  if (!Number.isFinite(input.inputSeq) || input.inputSeq <= hero.lastInputSeq) {
    return withHeroEvent(state, {
      type: "hero.input_rejected",
      heroId: hero.heroId,
      playerSlot,
      reason: "out-of-order-input"
    });
  }

  const moveX = clamp(input.moveX, -1, 1);
  const moveY = clamp(input.moveY, -1, 1);
  const movement = normalizeVector(moveX, moveY);
  const aim = normalizeAim(clamp(input.aimX, -1, 1), clamp(input.aimY, -1, 1), hero);
  const velocityX = roundForSnapshot(movement.x * hero.maxSpeed);
  const velocityY = roundForSnapshot(movement.y * hero.maxSpeed);
  const nextHero: HeroState = {
    ...hero,
    velocityX,
    velocityY,
    aimX: aim.x,
    aimY: aim.y,
    fireHeld: Boolean(input.fireHeld),
    lastInputSeq: Math.floor(input.inputSeq),
    lastInputTick: state.tick
  };
  let next = {
    ...state,
    heroes: state.heroes.map((candidate) => (candidate.heroId === hero.heroId ? nextHero : candidate))
  };
  next = withHeroEvent(next, {
    type: "hero.input_received",
    heroId: hero.heroId,
    playerSlot,
    position: heroPosition(nextHero)
  });
  if (velocityX !== hero.velocityX || velocityY !== hero.velocityY) {
    next = withHeroEvent(next, {
      type: "hero.velocity_updated",
      heroId: hero.heroId,
      playerSlot,
      position: heroPosition(nextHero)
    });
  }
  if (input.fireHeld) {
    next = withHeroEvent(next, {
      type: "hero.fire_requested",
      heroId: hero.heroId,
      playerSlot,
      position: heroPosition(nextHero)
    });
  }
  return next;
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
  const towerCollider = getTowerCollider(pad.position);
  const overlappingHero = state.heroes.find(
    (hero) => hero.connected && hero.alive && circleIntersectsCircle(heroToCollider(hero), towerCollider)
  );
  if (overlappingHero) {
    return withHeroEvent(
      withLog(state, `${pad.label} blocked by ${overlappingHero.playerSlot.toUpperCase()}`),
      {
        type: "hero.input_rejected",
        heroId: overlappingHero.heroId,
        playerSlot: overlappingHero.playerSlot,
        reason: "tower-overlaps-hero",
        position: { ...pad.position }
      }
    );
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
  next = advanceHeroes(next);
  next = advanceHeroProjectiles(next);
  next = applyHeroFire(next);
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

function advanceHeroes(state: GameState): GameState {
  const blockers = buildHeroBlockers(state);
  let next = state;
  const deltaSeconds = state.mission.fixedTickMs / 1000;
  const heroes = state.heroes.map((hero) => {
    if (!hero.connected || !hero.alive) {
      return hero;
    }
    const attempted = {
      x: roundForSnapshot(hero.x + hero.velocityX * deltaSeconds),
      y: roundForSnapshot(hero.y + hero.velocityY * deltaSeconds)
    };
    const resolved = resolveHeroMovement(hero, attempted, blockers, state.playableBounds);
    if (resolved.collision) {
      next = withHeroEvent(next, {
        type: "hero.collision_resolved",
        heroId: hero.heroId,
        playerSlot: hero.playerSlot,
        blockerType: resolved.collision.blockerType,
        blockerId: resolved.collision.blockerId,
        attemptedPosition: attempted,
        resolvedPosition: resolved.position
      });
    }
    if (resolved.position.x !== hero.x || resolved.position.y !== hero.y) {
      next = withHeroEvent(next, {
        type: "hero.moved",
        heroId: hero.heroId,
        playerSlot: hero.playerSlot,
        attemptedPosition: attempted,
        resolvedPosition: resolved.position
      });
    }
    return {
      ...hero,
      x: resolved.position.x,
      y: resolved.position.y,
      velocityX: resolved.velocityX,
      velocityY: resolved.velocityY
    };
  });
  return { ...next, heroes };
}

function advanceHeroProjectiles(state: GameState): GameState {
  if (state.heroProjectiles.length === 0) {
    return state;
  }

  const deltaSeconds = state.mission.fixedTickMs / 1000;
  const wallBlockers = buildHeroBlockers(state).filter((blocker) => blocker.blockerType === "wall");
  let next = { ...state, enemies: state.enemies.map((enemy) => ({ ...enemy })), heroProjectiles: [] as HeroProjectileState[] };

  for (const projectile of state.heroProjectiles.sort(compareProjectilesById)) {
    if (state.tick >= projectile.expiresAtTick) {
      continue;
    }

    const moved = {
      ...projectile,
      x: roundForSnapshot(projectile.x + projectile.velocityX * deltaSeconds),
      y: roundForSnapshot(projectile.y + projectile.velocityY * deltaSeconds)
    };
    const projectileCollider: CircleCollider = {
      type: "circle",
      x: moved.x,
      y: moved.y,
      radius: moved.radius
    };

    const wallHit = wallBlockers.some((blocker) => colliderIntersectsCircle(blocker.collider, projectileCollider));
    if (wallHit) {
      continue;
    }

    const target = next.enemies
      .filter((enemy) => enemy.currentHp > 0 && circleIntersectsCircle(enemyToCollider(enemy), projectileCollider))
      .sort((a, b) => b.distanceTravelled - a.distanceTravelled || compareById(a, b))[0];
    if (!target) {
      next.heroProjectiles.push(moved);
      continue;
    }

    target.currentHp = Math.max(0, target.currentHp - moved.damage);
    next = withHeroEvent(next, {
      type: "hero.projectile_hit_enemy",
      heroId: moved.ownerHeroId,
      projectileId: moved.projectileId,
      enemyId: target.id,
      position: { ...target.position },
      damage: moved.damage
    });
    next = withHeroEvent(next, {
      type: "enemy.damaged",
      heroId: moved.ownerHeroId,
      projectileId: moved.projectileId,
      enemyId: target.id,
      position: { ...target.position },
      damage: moved.damage
    });
    next = withEvent(next, "hero", `-${moved.damage}`, target.position);
  }

  return defeatZeroHpEnemies(next);
}

function applyHeroFire(state: GameState): GameState {
  let next = { ...state, heroes: state.heroes.map((hero) => ({ ...hero })), heroProjectiles: [...state.heroProjectiles] };
  for (const hero of next.heroes.sort(compareHeroesById)) {
    if (hero.weaponCooldownRemainingTicks > 0) {
      hero.weaponCooldownRemainingTicks -= 1;
    }
    if (!hero.connected || !hero.alive || !hero.fireHeld) {
      continue;
    }
    if (hero.weaponCooldownRemainingTicks > 0) {
      next = withHeroEvent(next, {
        type: "hero.fire_rejected",
        heroId: hero.heroId,
        playerSlot: hero.playerSlot,
        reason: "cooldown",
        position: heroPosition(hero)
      });
      continue;
    }
    const aim = normalizeAim(hero.aimX, hero.aimY, hero);
    const lifetimeTicks = Math.max(1, Math.ceil(hero.weaponRange / (heroProjectileSpeed * (state.mission.fixedTickMs / 1000))));
    const projectile: HeroProjectileState = {
      projectileId: `hero-shot-${state.tick}-${hero.heroId.replace(/[^a-z0-9]/gi, "-")}-${next.heroProjectiles.length + 1}`,
      ownerHeroId: hero.heroId,
      x: hero.x,
      y: hero.y,
      velocityX: roundForSnapshot(aim.x * heroProjectileSpeed),
      velocityY: roundForSnapshot(aim.y * heroProjectileSpeed),
      radius: 6,
      damage: hero.weaponDamage,
      spawnTick: state.tick,
      expiresAtTick: state.tick + lifetimeTicks
    };
    hero.aimX = aim.x;
    hero.aimY = aim.y;
    hero.weaponCooldownRemainingTicks = hero.weaponCooldownTicks;
    next.heroProjectiles.push(projectile);
    next = withHeroEvent(next, {
      type: "hero.fired",
      heroId: hero.heroId,
      playerSlot: hero.playerSlot,
      projectileId: projectile.projectileId,
      position: heroPosition(hero)
    });
    next = withHeroEvent(next, {
      type: "hero.projectile_spawned",
      heroId: hero.heroId,
      playerSlot: hero.playerSlot,
      projectileId: projectile.projectileId,
      position: { x: projectile.x, y: projectile.y }
    });
    next = withEvent(next, "hero", "fire", heroPosition(hero));
  }
  return next;
}

function resolveHeroMovement(
  hero: HeroState,
  attempted: Vec2,
  blockers: CollisionBlockerState[],
  bounds: RectDefinition
): {
  position: Vec2;
  velocityX: number;
  velocityY: number;
  collision?: CollisionBlockerState;
} {
  let x = hero.x;
  let y = hero.y;
  let velocityX = hero.velocityX;
  let velocityY = hero.velocityY;
  let collision: CollisionBlockerState | undefined;

  const xCandidate = { x: attempted.x, y };
  const xCollision = firstCollision(hero, xCandidate, blockers);
  if (xCollision) {
    velocityX = 0;
    collision = xCollision;
  } else {
    x = xCandidate.x;
  }

  const yCandidate = { x, y: attempted.y };
  const yCollision = firstCollision(hero, yCandidate, blockers);
  if (yCollision) {
    velocityY = 0;
    collision = collision ?? yCollision;
  } else {
    y = yCandidate.y;
  }

  const clamped = clampHeroToBounds(hero, { x, y }, bounds);
  if (clamped.x !== x || clamped.y !== y) {
    velocityX = clamped.x !== x ? 0 : velocityX;
    velocityY = clamped.y !== y ? 0 : velocityY;
    collision = collision ?? {
      blockerId: "playable-bounds",
      blockerType: "bounds",
      collider: { type: "rect", ...bounds }
    };
  }

  return {
    position: clamped,
    velocityX,
    velocityY,
    collision
  };
}

function firstCollision(hero: HeroState, position: Vec2, blockers: CollisionBlockerState[]): CollisionBlockerState | undefined {
  const collider: CircleCollider = { ...heroToCollider(hero), x: position.x, y: position.y };
  return blockers.find((blocker) => colliderIntersectsCircle(blocker.collider, collider));
}

function buildHeroBlockers(state: GameState): CollisionBlockerState[] {
  return [
    ...state.wallBlockers.map((blocker) => ({ ...blocker, collider: cloneCollider(blocker.collider) })),
    ...state.towers.map((tower) => ({
      blockerId: tower.id,
      blockerType: "tower" as const,
      collider: getTowerCollider(tower.position)
    }))
  ].sort((a, b) => a.blockerId.localeCompare(b.blockerId));
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
  let next = withLogEntries(
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
  for (const enemy of defeated) {
    next = withHeroEvent(next, {
      type: "enemy.killed",
      enemyId: enemy.id,
      position: { ...enemy.position }
    });
  }
  return next;
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

function normalizeVector(x: number, y: number): Vec2 {
  const length = Math.hypot(x, y);
  if (length === 0) {
    return { x: 0, y: 0 };
  }
  return {
    x: roundForSnapshot(x / length),
    y: roundForSnapshot(y / length)
  };
}

function normalizeAim(x: number, y: number, fallbackHero: HeroState): Vec2 {
  const normalized = normalizeVector(x, y);
  if (normalized.x === 0 && normalized.y === 0) {
    return { x: fallbackHero.aimX || defaultAim.x, y: fallbackHero.aimY || defaultAim.y };
  }
  return normalized;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : 0));
}

function clampHeroToBounds(hero: HeroState, position: Vec2, bounds: RectDefinition): Vec2 {
  return {
    x: roundForSnapshot(clamp(position.x, bounds.x + hero.radius, bounds.x + bounds.width - hero.radius)),
    y: roundForSnapshot(clamp(position.y, bounds.y + hero.radius, bounds.y + bounds.height - hero.radius))
  };
}

function heroToCollider(hero: Pick<HeroState, "x" | "y" | "radius">): CircleCollider {
  return { type: "circle", x: hero.x, y: hero.y, radius: hero.radius };
}

function heroPosition(hero: Pick<HeroState, "x" | "y">): Vec2 {
  return { x: hero.x, y: hero.y };
}

function getTowerCollider(position: Vec2): CircleCollider {
  return { type: "circle", x: position.x, y: position.y, radius: towerCollisionRadius };
}

function enemyToCollider(enemy: EnemyState): CircleCollider {
  const radius = enemy.typeId === "brute" ? 17 : enemy.typeId === "skitter" ? 12 : 15;
  return { type: "circle", x: enemy.position.x, y: enemy.position.y, radius };
}

function cloneCollider(collider: Collider): Collider {
  return { ...collider };
}

function colliderIntersectsCircle(collider: Collider, circle: CircleCollider): boolean {
  return collider.type === "circle" ? circleIntersectsCircle(collider, circle) : circleIntersectsRect(circle, collider);
}

function circleIntersectsCircle(a: CircleCollider, b: CircleCollider): boolean {
  return distance(a, b) < a.radius + b.radius;
}

function circleIntersectsRect(circle: CircleCollider, rect: RectCollider): boolean {
  const nearestX = clamp(circle.x, rect.x, rect.x + rect.width);
  const nearestY = clamp(circle.y, rect.y, rect.y + rect.height);
  return distance(circle, { x: nearestX, y: nearestY }) < circle.radius;
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

function compareHeroesById(a: HeroState, b: HeroState): number {
  return a.heroId.localeCompare(b.heroId);
}

function compareProjectilesById(a: HeroProjectileState, b: HeroProjectileState): number {
  return a.projectileId.localeCompare(b.projectileId);
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

function withHeroEvent(state: GameState, event: Omit<HeroEvent, "id" | "tick">): GameState {
  const heroEvent: HeroEvent = {
    id: `hero-event-${state.tick}-${state.heroEvents.length + 1}-${event.type}`,
    tick: state.tick,
    ...event,
    attemptedPosition: event.attemptedPosition ? { ...event.attemptedPosition } : undefined,
    resolvedPosition: event.resolvedPosition ? { ...event.resolvedPosition } : undefined,
    position: event.position ? { ...event.position } : undefined
  };
  return {
    ...state,
    heroEvents: [heroEvent, ...state.heroEvents].slice(0, 80)
  };
}
