import type { ArenaCombatant } from "../src/ananke-internal.js";
import { describe, expect, it } from "vitest";
import {
  AGINCOURT_SCENARIO,
  AGINCOURT_VALIDATION,
  ALL_VALIDATIONS,
  CANNAE_SCENARIO,
  CANNAE_VALIDATION,
  CRECY_SCENARIO,
  CRECY_VALIDATION,
  HASTINGS_SCENARIO,
  HASTINGS_VALIDATION,
  THERMOPYLAE_SCENARIO,
  THERMOPYLAE_VALIDATION,
} from "../src/index.js";

const PAIRS = [
  [THERMOPYLAE_SCENARIO, THERMOPYLAE_VALIDATION],
  [AGINCOURT_SCENARIO, AGINCOURT_VALIDATION],
  [CRECY_SCENARIO, CRECY_VALIDATION],
  [HASTINGS_SCENARIO, HASTINGS_VALIDATION],
  [CANNAE_SCENARIO, CANNAE_VALIDATION],
] as const;

describe("historical arena scenarios", () => {
  it("exports five direct validation scenarios", () => {
    expect(ALL_VALIDATIONS).toHaveLength(5);
    expect(ALL_VALIDATIONS.map((validation) => validation.id)).toEqual([
      "thermopylae_480bce",
      "agincourt_1415",
      "crecy_1346",
      "hastings_1066",
      "cannae_216bce",
    ]);
  });

  for (const [scenario, validation] of PAIRS) {
    it(`${validation.id} links validation metadata to its arena scenario`, () => {
      expect(validation.scenario).toBe(scenario);
      expect(validation.seeds).toBe(100);
      expect(validation.checks.length).toBeGreaterThanOrEqual(4);
      expect(validation.documentation.references.length).toBeGreaterThan(0);
      expect(validation.documentation.substitutions.length).toBeGreaterThan(0);
    });

    it(`${validation.id} documents scale factors`, () => {
      expect(validation.documentation.scaleFactors.defenders.simulated).toBeGreaterThan(0);
      expect(validation.documentation.scaleFactors.defenders.historical).toBeGreaterThan(0);
      expect(validation.documentation.scaleFactors.defenders.ratio).toBeGreaterThan(1);
      expect(validation.documentation.scaleFactors.attackers.ratio).toBeGreaterThan(1);
    });

    it(`${validation.id} contains two teams with combatants`, () => {
      const teamIds = new Set(scenario.combatants.map((combatant: ArenaCombatant) => combatant.teamId));
      expect(teamIds.size).toBe(2);
      expect(scenario.combatants.length).toBeGreaterThan(10);
    });

    it(`${validation.id} uses positive combatant ids`, () => {
      for (const combatant of scenario.combatants as ArenaCombatant[]) {
        expect(combatant.id).toBeGreaterThan(0);
      }
    });
  }
});
