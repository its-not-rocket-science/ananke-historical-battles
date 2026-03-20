import type { ArenaCombatant, ArenaResult } from "../ananke-internal.js";

export function formatPct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function teamCombatantIds(result: ArenaResult, teamId: number): number[] {
  return result.scenario.combatants.filter((combatant: ArenaCombatant) => combatant.teamId === teamId).map((combatant: ArenaCombatant) => combatant.id);
}

export function meanTeamCasualtyRate(result: ArenaResult, teamId: number): number {
  return meanGroupCasualtyRate(result, teamCombatantIds(result, teamId));
}

export function meanGroupCasualtyRate(result: ArenaResult, combatantIds: number[]): number {
  const ids = new Set(combatantIds);
  if (ids.size === 0) {
    return 0;
  }
  let total = 0;
  for (const trial of result.trialResults) {
    const casualties = trial.injuries.filter((injury: ArenaResult["trialResults"][number]["injuries"][number]) => ids.has(injury.entityId) && (injury.dead || injury.unconscious)).length;
    total += casualties / ids.size;
  }
  return total / result.trials;
}

export function meanGroupStructuralDamage(result: ArenaResult, combatantIds: number[]): number {
  const ids = new Set(combatantIds);
  if (ids.size === 0) {
    return 0;
  }
  let total = 0;
  for (const trial of result.trialResults) {
    const injuries = trial.injuries.filter((injury: ArenaResult["trialResults"][number]["injuries"][number]) => ids.has(injury.entityId));
    total += injuries.reduce((sum, injury) => sum + injury.maxStructuralDamage, 0) / injuries.length;
  }
  return total / result.trials;
}

export function meanTeamStructuralDamage(result: ArenaResult, teamId: number): number {
  return meanGroupStructuralDamage(result, teamCombatantIds(result, teamId));
}

export function meanGroupShock(result: ArenaResult, combatantIds: number[]): number {
  const ids = new Set(combatantIds);
  if (ids.size === 0) {
    return 0;
  }
  let total = 0;
  for (const trial of result.trialResults) {
    const injuries = trial.injuries.filter((injury: ArenaResult["trialResults"][number]["injuries"][number]) => ids.has(injury.entityId));
    total += injuries.reduce((sum, injury) => sum + injury.shock, 0) / injuries.length;
  }
  return total / result.trials;
}

export function meanTeamShock(result: ArenaResult, teamId: number): number {
  return meanGroupShock(result, teamCombatantIds(result, teamId));
}

export function winRate(result: ArenaResult, teamId: number): number {
  return result.winRateByTeam.get(teamId) ?? 0;
}

export function casualtyRatio(result: ArenaResult, attackerTeamId: number, defenderTeamId: number): number {
  const attack = meanTeamCasualtyRate(result, attackerTeamId);
  const defend = meanTeamCasualtyRate(result, defenderTeamId);
  if (defend === 0) {
    return attack > 0 ? Number.POSITIVE_INFINITY : 0;
  }
  return attack / defend;
}
