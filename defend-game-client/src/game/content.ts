export type PathId = "A" | "B";
export type TowerTypeId = "ranger-post" | "blast-foundry" | "veil-spire" | "stoneward-lodge";
export type EnemyTypeId = "skitter" | "brute" | "shieldbearer" | "glider" | "mender";
export type DamageKind = "physical" | "blast" | "arcane";

export interface Vec2 {
  x: number;
  y: number;
}

export interface EnemyPathDefinition {
  id: PathId;
  label: string;
  entrance: Vec2;
  waypoints: Vec2[];
}

export interface BuildPadDefinition {
  id: string;
  label: string;
  position: Vec2;
  role: "early" | "merge" | "cleanup";
}

export interface TowerDefinition {
  id: TowerTypeId;
  label: string;
  role: string;
  cost: number;
  range: number;
  cooldownTicks: number;
  damage: number;
  damageKind: DamageKind;
  splashRadius?: number;
  slowTicks?: number;
  slowMultiplier?: number;
  blockRadius?: number;
  blockCapacity?: number;
  blockDamagePerTick?: number;
}

export interface EnemyDefinition {
  id: EnemyTypeId;
  label: string;
  maxHp: number;
  speedPerTick: number;
  reward: number;
  leakDamage: number;
  physicalResist: number;
  blastResist: number;
  arcaneResist: number;
  traits: string[];
}

export interface WaveSpawnDefinition {
  enemyTypeId: EnemyTypeId;
  pathId: PathId;
  atTick: number;
}

export interface WaveDefinition {
  id: string;
  label: string;
  reward: number;
  spawns: WaveSpawnDefinition[];
}

export interface MissionDefinition {
  id: string;
  title: string;
  subtitle: string;
  startingGold: number;
  objectiveHp: number;
  fixedTickMs: number;
  paths: EnemyPathDefinition[];
  buildPads: BuildPadDefinition[];
  towers: TowerDefinition[];
  enemies: EnemyDefinition[];
  waves: WaveDefinition[];
}

export const firstPlayableMission: MissionDefinition = {
  id: "saltmarsh-crossing",
  title: "Saltmarsh Crossing",
  subtitle: "Hold the two causeways, spend early, and reinforce the merge.",
  startingGold: 320,
  objectiveHp: 20,
  fixedTickMs: 100,
  paths: [
    {
      id: "A",
      label: "North Causeway",
      entrance: { x: 78, y: 166 },
      waypoints: [
        { x: 250, y: 174 },
        { x: 370, y: 112 },
        { x: 540, y: 212 },
        { x: 650, y: 350 },
        { x: 760, y: 350 },
        { x: 830, y: 350 }
      ]
    },
    {
      id: "B",
      label: "South Causeway",
      entrance: { x: 78, y: 554 },
      waypoints: [
        { x: 252, y: 538 },
        { x: 372, y: 608 },
        { x: 542, y: 488 },
        { x: 650, y: 350 },
        { x: 760, y: 350 },
        { x: 830, y: 350 }
      ]
    }
  ],
  buildPads: [
    { id: "pad-1", label: "North bend", position: { x: 286, y: 112 }, role: "early" },
    { id: "pad-2", label: "North inside", position: { x: 414, y: 220 }, role: "early" },
    { id: "pad-3", label: "High merge", position: { x: 562, y: 282 }, role: "merge" },
    { id: "pad-4", label: "Gate north", position: { x: 782, y: 286 }, role: "cleanup" },
    { id: "pad-5", label: "South bend", position: { x: 286, y: 608 }, role: "early" },
    { id: "pad-6", label: "South inside", position: { x: 414, y: 500 }, role: "early" },
    { id: "pad-7", label: "Low merge", position: { x: 562, y: 438 }, role: "merge" },
    { id: "pad-8", label: "Gate south", position: { x: 782, y: 434 }, role: "cleanup" }
  ],
  towers: [
    {
      id: "ranger-post",
      label: "Ranger Post",
      role: "fast single target",
      cost: 70,
      range: 150,
      cooldownTicks: 8,
      damage: 18,
      damageKind: "physical"
    },
    {
      id: "blast-foundry",
      label: "Blast Foundry",
      role: "slow splash",
      cost: 115,
      range: 132,
      cooldownTicks: 18,
      damage: 28,
      damageKind: "blast",
      splashRadius: 58
    },
    {
      id: "veil-spire",
      label: "Veil Spire",
      role: "arcane slow",
      cost: 95,
      range: 142,
      cooldownTicks: 12,
      damage: 16,
      damageKind: "arcane",
      slowTicks: 16,
      slowMultiplier: 0.58
    },
    {
      id: "stoneward-lodge",
      label: "Stoneward Lodge",
      role: "blocker",
      cost: 85,
      range: 0,
      cooldownTicks: 1,
      damage: 0,
      damageKind: "physical",
      blockRadius: 96,
      blockCapacity: 2,
      blockDamagePerTick: 3
    }
  ],
  enemies: [
    {
      id: "skitter",
      label: "Skitter",
      maxHp: 48,
      speedPerTick: 11,
      reward: 8,
      leakDamage: 1,
      physicalResist: 0,
      blastResist: 0,
      arcaneResist: 0,
      traits: ["quick"]
    },
    {
      id: "brute",
      label: "Brute",
      maxHp: 120,
      speedPerTick: 6,
      reward: 18,
      leakDamage: 2,
      physicalResist: 0,
      blastResist: 0,
      arcaneResist: 0,
      traits: ["tough"]
    },
    {
      id: "shieldbearer",
      label: "Shieldbearer",
      maxHp: 96,
      speedPerTick: 7,
      reward: 16,
      leakDamage: 2,
      physicalResist: 0.4,
      blastResist: 0.1,
      arcaneResist: 0,
      traits: ["armored"]
    },
    {
      id: "glider",
      label: "Glider",
      maxHp: 64,
      speedPerTick: 13,
      reward: 12,
      leakDamage: 1,
      physicalResist: 0,
      blastResist: 0.35,
      arcaneResist: 0,
      traits: ["swift", "blast-resistant"]
    },
    {
      id: "mender",
      label: "Mender",
      maxHp: 82,
      speedPerTick: 8,
      reward: 20,
      leakDamage: 2,
      physicalResist: 0,
      blastResist: 0,
      arcaneResist: 0.25,
      traits: ["support"]
    }
  ],
  waves: [
    {
      id: "wave-1",
      label: "Scouts",
      reward: 35,
      spawns: [
        { enemyTypeId: "skitter", pathId: "A", atTick: 0 },
        { enemyTypeId: "skitter", pathId: "B", atTick: 5 },
        { enemyTypeId: "skitter", pathId: "A", atTick: 10 },
        { enemyTypeId: "skitter", pathId: "B", atTick: 15 },
        { enemyTypeId: "brute", pathId: "A", atTick: 25 }
      ]
    },
    {
      id: "wave-2",
      label: "Raised Shields",
      reward: 45,
      spawns: [
        { enemyTypeId: "shieldbearer", pathId: "A", atTick: 0 },
        { enemyTypeId: "skitter", pathId: "B", atTick: 4 },
        { enemyTypeId: "skitter", pathId: "B", atTick: 8 },
        { enemyTypeId: "shieldbearer", pathId: "B", atTick: 16 },
        { enemyTypeId: "brute", pathId: "A", atTick: 26 },
        { enemyTypeId: "skitter", pathId: "A", atTick: 30 }
      ]
    },
    {
      id: "wave-3",
      label: "Low Fog",
      reward: 55,
      spawns: [
        { enemyTypeId: "glider", pathId: "A", atTick: 0 },
        { enemyTypeId: "glider", pathId: "B", atTick: 5 },
        { enemyTypeId: "shieldbearer", pathId: "A", atTick: 12 },
        { enemyTypeId: "mender", pathId: "B", atTick: 18 },
        { enemyTypeId: "brute", pathId: "B", atTick: 28 },
        { enemyTypeId: "glider", pathId: "A", atTick: 34 },
        { enemyTypeId: "shieldbearer", pathId: "B", atTick: 40 }
      ]
    },
    {
      id: "wave-4",
      label: "Crossing Push",
      reward: 0,
      spawns: [
        { enemyTypeId: "skitter", pathId: "A", atTick: 0 },
        { enemyTypeId: "skitter", pathId: "B", atTick: 0 },
        { enemyTypeId: "glider", pathId: "A", atTick: 7 },
        { enemyTypeId: "glider", pathId: "B", atTick: 9 },
        { enemyTypeId: "mender", pathId: "A", atTick: 18 },
        { enemyTypeId: "shieldbearer", pathId: "B", atTick: 22 },
        { enemyTypeId: "brute", pathId: "A", atTick: 32 },
        { enemyTypeId: "brute", pathId: "B", atTick: 38 },
        { enemyTypeId: "shieldbearer", pathId: "A", atTick: 48 },
        { enemyTypeId: "mender", pathId: "B", atTick: 54 }
      ]
    }
  ]
};

export function getTowerDefinition(id: TowerTypeId, mission = firstPlayableMission): TowerDefinition {
  const definition = mission.towers.find((tower) => tower.id === id);
  if (!definition) {
    throw new Error(`Unknown tower type ${id}`);
  }
  return definition;
}

export function getEnemyDefinition(id: EnemyTypeId, mission = firstPlayableMission): EnemyDefinition {
  const definition = mission.enemies.find((enemy) => enemy.id === id);
  if (!definition) {
    throw new Error(`Unknown enemy type ${id}`);
  }
  return definition;
}
