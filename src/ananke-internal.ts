import type {
  ArenaCombatant as ArenaCombatantT,
  ArenaResult as ArenaResultT,
  ArenaScenario as ArenaScenarioT,
  expectMeanDuration as ExpectMeanDurationT,
  expectWinRate as ExpectWinRateT,
  runArena as RunArenaT,
} from "../node_modules/@its-not-rocket-science/ananke/dist/src/arena.js";
import type { AIPolicy as AIPolicyT } from "../node_modules/@its-not-rocket-science/ananke/dist/src/sim/ai/types.js";
import type { SkillMap as SkillMapT, buildSkillMap as BuildSkillMapT } from "../node_modules/@its-not-rocket-science/ananke/dist/src/sim/skills.js";
import type { AI_PRESETS as AIPresetsT } from "../node_modules/@its-not-rocket-science/ananke/dist/src/sim/ai/presets.js";
import type {
  buildElevationGrid as BuildElevationGridT,
  buildObstacleGrid as BuildObstacleGridT,
  buildTerrainGrid as BuildTerrainGridT,
} from "../node_modules/@its-not-rocket-science/ananke/dist/src/sim/terrain.js";
import type {
  CLASSICAL_MELEE as ClassicalMeleeT,
  CLASSICAL_RANGED as ClassicalRangedT,
  MEDIEVAL_MELEE as MedievalMeleeT,
} from "../node_modules/@its-not-rocket-science/ananke/dist/src/weapons.js";

export type ArenaCombatant = ArenaCombatantT;
export type ArenaResult = ArenaResultT;
export type ArenaScenario = ArenaScenarioT;
export type AIPolicy = AIPolicyT;
export type SkillMap = SkillMapT;

async function importInternal(path: string): Promise<any> {
  const candidates = [
    new URL(`../node_modules/@its-not-rocket-science/ananke/dist/src/${path}`, import.meta.url).href,
    new URL(`../../node_modules/@its-not-rocket-science/ananke/dist/src/${path}`, import.meta.url).href,
  ];

  let lastError: unknown;
  for (const candidate of candidates) {
    try {
      return await import(candidate);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

const arenaMod = await importInternal("arena.js");
const weaponsMod = await importInternal("weapons.js");
const skillsMod = await importInternal("sim/skills.js");
const presetsMod = await importInternal("sim/ai/presets.js");
const terrainMod = await importInternal("sim/terrain.js");

export const runArena: typeof RunArenaT = arenaMod.runArena;
export const expectWinRate: typeof ExpectWinRateT = arenaMod.expectWinRate;
export const expectMeanDuration: typeof ExpectMeanDurationT = arenaMod.expectMeanDuration;

export const CLASSICAL_MELEE: typeof ClassicalMeleeT = weaponsMod.CLASSICAL_MELEE;
export const CLASSICAL_RANGED: typeof ClassicalRangedT = weaponsMod.CLASSICAL_RANGED;
export const MEDIEVAL_MELEE: typeof MedievalMeleeT = weaponsMod.MEDIEVAL_MELEE;

export const buildSkillMap: typeof BuildSkillMapT = skillsMod.buildSkillMap;
export const AI_PRESETS: typeof AIPresetsT = presetsMod.AI_PRESETS;
export const buildTerrainGrid: typeof BuildTerrainGridT = terrainMod.buildTerrainGrid;
export const buildObstacleGrid: typeof BuildObstacleGridT = terrainMod.buildObstacleGrid;
export const buildElevationGrid: typeof BuildElevationGridT = terrainMod.buildElevationGrid;
