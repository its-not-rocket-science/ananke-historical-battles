import { q, to } from "@its-not-rocket-science/ananke";
import type { ArenaCombatant } from "../ananke-internal.js";
import { AI_PRESETS } from "../ananke-internal.js";
import { buildObstacleGrid, buildTerrainGrid, buildElevationGrid } from "../ananke-internal.js";
import { buildSkillMap, type SkillMap } from "../ananke-internal.js";
import type { AIPolicy } from "../ananke-internal.js";
import type { Archetype, Loadout } from "@its-not-rocket-science/ananke";

export interface GroupConfig {
  teamId: number;
  count: number;
  startId: number;
  x: number;
  yStart: number;
  yStep: number;
  archetype: Archetype;
  loadout: Loadout;
  aiPolicy?: AIPolicy;
  skills?: SkillMap;
}

export function makeLine(config: GroupConfig): ArenaCombatant[] {
  return Array.from({ length: config.count }, (_, index) => ({
    id: config.startId + index,
    teamId: config.teamId,
    archetype: config.archetype,
    loadout: config.loadout,
    ...(config.skills ? { skills: config.skills } : {}),
    ...(config.aiPolicy ? { aiPolicy: config.aiPolicy } : {}),
    position_m: {
      x: to.m(config.x),
      y: to.m(config.yStart + config.yStep * index),
      z: 0,
    },
  }));
}

export const infantrySkills: SkillMap = buildSkillMap({
  meleeCombat: { energyTransferMul: q(1.1) },
  meleeDefence: { energyTransferMul: q(1.08) },
  athleticism: { fatigueRateMul: q(0.94) },
});

export const eliteInfantrySkills: SkillMap = buildSkillMap({
  meleeCombat: { energyTransferMul: q(1.18), hitTimingOffset_s: to.s(-0.08) },
  meleeDefence: { energyTransferMul: q(1.15) },
  athleticism: { fatigueRateMul: q(0.9) },
  tactics: { hitTimingOffset_s: to.s(-0.05) },
});

export const archerSkills: SkillMap = buildSkillMap({
  rangedCombat: { dispersionMul: q(0.72) },
  athleticism: { fatigueRateMul: q(0.95) },
});

export const eliteArcherSkills: SkillMap = buildSkillMap({
  rangedCombat: { dispersionMul: q(0.58) },
  athleticism: { fatigueRateMul: q(0.9) },
  tactics: { hitTimingOffset_s: to.s(-0.04) },
});

const PRESET_SKIRMISHER = AI_PRESETS.skirmisher!;
const PRESET_LINE = AI_PRESETS.lineInfantry!;

export const skirmisherPolicy: AIPolicy = {
  archetype: PRESET_SKIRMISHER.archetype,
  desiredRange_m: to.m(18),
  engageRange_m: to.m(28),
  retreatRange_m: to.m(6),
  threatRange_m: PRESET_SKIRMISHER.threatRange_m,
  defendWhenThreatenedQ: PRESET_SKIRMISHER.defendWhenThreatenedQ,
  parryBiasQ: PRESET_SKIRMISHER.parryBiasQ,
  dodgeBiasQ: PRESET_SKIRMISHER.dodgeBiasQ,
  retargetCooldownTicks: PRESET_SKIRMISHER.retargetCooldownTicks,
  focusStickinessQ: PRESET_SKIRMISHER.focusStickinessQ,
};

export const closeInfantryPolicy: AIPolicy = {
  archetype: PRESET_LINE.archetype,
  desiredRange_m: to.m(1.5),
  engageRange_m: to.m(4),
  retreatRange_m: PRESET_LINE.retreatRange_m,
  threatRange_m: to.m(8),
  defendWhenThreatenedQ: PRESET_LINE.defendWhenThreatenedQ,
  parryBiasQ: PRESET_LINE.parryBiasQ,
  dodgeBiasQ: PRESET_LINE.dodgeBiasQ,
  retargetCooldownTicks: PRESET_LINE.retargetCooldownTicks,
  focusStickinessQ: PRESET_LINE.focusStickinessQ,
};

export const defensiveInfantryPolicy: AIPolicy = {
  archetype: "defender",
  desiredRange_m: to.m(1.5),
  engageRange_m: to.m(4),
  retreatRange_m: to.m(0),
  threatRange_m: to.m(8),
  defendWhenThreatenedQ: q(0.95),
  parryBiasQ: q(0.8),
  dodgeBiasQ: q(0.15),
  retargetCooldownTicks: 12,
  focusStickinessQ: q(0.85),
};

export const aggressivePolicy: AIPolicy = {
  archetype: "berserker",
  desiredRange_m: to.m(1.2),
  engageRange_m: to.m(5),
  retreatRange_m: to.m(0),
  threatRange_m: to.m(9),
  defendWhenThreatenedQ: q(0.2),
  parryBiasQ: q(0.35),
  dodgeBiasQ: q(0.1),
  retargetCooldownTicks: 8,
  focusStickinessQ: q(0.95),
};

export function muddyField(widthCells: number, depthCells: number): ReturnType<typeof buildTerrainGrid> {
  const cells: Record<string, "mud"> = {};
  for (let x = 0; x < widthCells; x++) {
    for (let y = 0; y < depthCells; y++) {
      cells[`${x},${y}`] = "mud";
    }
  }
  return buildTerrainGrid(cells);
}

export function corridorObstacles(lengthCells: number, openRows: number): ReturnType<typeof buildObstacleGrid> {
  const cells: Record<string, number> = {};
  for (let x = 0; x < lengthCells; x++) {
    for (let y = -8; y <= 8; y++) {
      if (Math.abs(y) > Math.floor(openRows / 2)) {
        cells[`${x},${y}`] = q(1);
      }
    }
  }
  return buildObstacleGrid(cells);
}

export function ridgeElevation(xStart: number, xEnd: number, yStart: number, yEnd: number, height_m: number): ReturnType<typeof buildElevationGrid> {
  const cells: Record<string, number> = {};
  for (let x = xStart; x <= xEnd; x++) {
    for (let y = yStart; y <= yEnd; y++) {
      cells[`${x},${y}`] = to.m(height_m);
    }
  }
  return buildElevationGrid(cells);
}
