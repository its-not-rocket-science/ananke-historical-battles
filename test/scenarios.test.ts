/**
 * scenarios.test.ts — Structural and reference validation for all Phase 1 scenarios
 *
 * Validates that each scenario exports required fields, has well-formed pass
 * criteria, and accurate historical references. Does NOT run arena simulation
 * (deferred to Phase 2).
 */

import { describe, it, expect } from "vitest";
import {
  ALL_SCENARIOS,
  THERMOPYLAE_SCENARIO,
  AGINCOURT_SCENARIO,
  MARATHON_SCENARIO,
  CONSTANTINOPLE_SCENARIO,
} from "../src/index.js";

// ── Required fields on every scenario ────────────────────────────────────────

describe("All scenarios — required fields", () => {
  it("ALL_SCENARIOS exports all four Phase 1 scenarios", () => {
    expect(ALL_SCENARIOS).toHaveLength(4);
    const ids = ALL_SCENARIOS.map((s) => s.id);
    expect(ids).toContain("thermopylae-480bc");
    expect(ids).toContain("agincourt-1415");
    expect(ids).toContain("marathon-490bc");
    expect(ids).toContain("constantinople-1453");
  });

  for (const scenario of ALL_SCENARIOS) {
    it(`${scenario.id} — id is a non-empty string`, () => {
      expect(typeof scenario.id).toBe("string");
      expect(scenario.id.length).toBeGreaterThan(0);
    });

    it(`${scenario.id} — name is a non-empty string`, () => {
      expect(typeof scenario.name).toBe("string");
      expect(scenario.name.length).toBeGreaterThan(0);
    });

    it(`${scenario.id} — reference is a non-empty array of strings`, () => {
      expect(Array.isArray(scenario.reference)).toBe(true);
      expect(scenario.reference.length).toBeGreaterThan(0);
      for (const ref of scenario.reference) {
        expect(typeof ref).toBe("string");
        expect(ref.length).toBeGreaterThan(0);
      }
    });

    it(`${scenario.id} — claimType is 'plausibility' or 'quantitative'`, () => {
      expect(["plausibility", "quantitative"]).toContain(scenario.claimType);
    });

    it(`${scenario.id} — description is a non-empty string`, () => {
      expect(typeof scenario.description).toBe("string");
      expect(scenario.description.length).toBeGreaterThan(20);
    });

    it(`${scenario.id} — historicalForces.defenders.count > 0`, () => {
      expect(scenario.historicalForces.defenders.count).toBeGreaterThan(0);
    });

    it(`${scenario.id} — historicalForces.attackers.count > 0`, () => {
      expect(scenario.historicalForces.attackers.count).toBeGreaterThan(0);
    });

    it(`${scenario.id} — passCriteria has at least one quantified criterion`, () => {
      const criteria = scenario.passCriteria;
      const definedKeys = Object.keys(criteria).filter(
        (k) => k !== "notes" && criteria[k as keyof typeof criteria] !== undefined,
      );
      expect(definedKeys.length).toBeGreaterThan(0);
    });
  }
});

// ── Pass criteria structure ───────────────────────────────────────────────────

describe("Pass criteria — valid numeric bounds", () => {
  it("Thermopylae defenderCasualtyRate [0,1]", () => {
    const c = THERMOPYLAE_SCENARIO.passCriteria.defenderCasualtyRate;
    expect(c).toBeDefined();
    const min = c?.min ?? 0;
    const max = c?.max ?? 1;
    expect(min).toBeGreaterThanOrEqual(0);
    expect(max).toBeLessThanOrEqual(1);
    expect(min).toBeLessThanOrEqual(max);
  });

  it("Thermopylae attackerCasualtyRate min >= 0", () => {
    const c = THERMOPYLAE_SCENARIO.passCriteria.attackerCasualtyRate;
    expect(c?.min).toBeGreaterThanOrEqual(0);
  });

  it("Agincourt defenderCasualtyRate max <= 0.20 (heavily outnumbered but should win)", () => {
    const c = AGINCOURT_SCENARIO.passCriteria.defenderCasualtyRate;
    expect(c?.max).toBeDefined();
    expect(c!.max!).toBeLessThanOrEqual(0.20);
  });

  it("Agincourt attackerCasualtyRate min >= 0.30", () => {
    const c = AGINCOURT_SCENARIO.passCriteria.attackerCasualtyRate;
    expect(c?.min).toBeGreaterThanOrEqual(0.30);
  });

  it("Marathon defenderCasualtyRate max <= 0.10 (historically ~1.7%)", () => {
    const c = MARATHON_SCENARIO.passCriteria.defenderCasualtyRate;
    expect(c?.max).toBeDefined();
    expect(c!.max!).toBeLessThanOrEqual(0.10);
  });

  it("Marathon attackerCasualtyRate min >= 0.10", () => {
    const c = MARATHON_SCENARIO.passCriteria.attackerCasualtyRate;
    expect(c?.min).toBeGreaterThanOrEqual(0.10);
  });

  it("Constantinople diseaseToDirectCombatCasualtyRatio min >= 1.0", () => {
    const c = CONSTANTINOPLE_SCENARIO.passCriteria.diseaseToDirectCombatCasualtyRatio;
    expect(c?.min).toBeGreaterThanOrEqual(1.0);
  });

  it("Constantinople defenderEffectiveFractionAtSiegeEnd max <= 0.50", () => {
    const c = CONSTANTINOPLE_SCENARIO.passCriteria.defenderEffectiveFractionAtSiegeEnd;
    expect(c?.max).toBeDefined();
    expect(c!.max!).toBeLessThanOrEqual(0.50);
  });
});

// ── Historical accuracy spot-checks ──────────────────────────────────────────

describe("Historical accuracy — force size ranges", () => {
  it("Thermopylae final-stand defenders <= 2,000 (historically 1,500)", () => {
    expect(THERMOPYLAE_SCENARIO.historicalForces.defenders.count).toBeLessThanOrEqual(2_000);
  });

  it("Thermopylae Persian force >= 50,000 (conservative modern estimate)", () => {
    expect(THERMOPYLAE_SCENARIO.historicalForces.attackers.count).toBeGreaterThanOrEqual(50_000);
  });

  it("Agincourt English force < 15,000 (8,000–9,000 is scholarly consensus)", () => {
    expect(AGINCOURT_SCENARIO.historicalForces.defenders.count).toBeLessThan(15_000);
  });

  it("Agincourt French force <= 40,000 (Rogers 2008 favours ~12,000)", () => {
    expect(AGINCOURT_SCENARIO.historicalForces.attackers.count).toBeLessThanOrEqual(40_000);
  });

  it("Marathon Greek force is 9,000–12,000 (Herodotus + Plataean allies)", () => {
    const count = MARATHON_SCENARIO.historicalForces.defenders.count;
    expect(count).toBeGreaterThanOrEqual(9_000);
    expect(count).toBeLessThanOrEqual(12_000);
  });

  it("Constantinople garrison < 10,000 (Nicol 1993: ~7,000)", () => {
    expect(CONSTANTINOPLE_SCENARIO.historicalForces.defenders.count).toBeLessThan(10_000);
  });

  it("Scenarios are in chronological order by year in ALL_SCENARIOS", () => {
    for (let i = 1; i < ALL_SCENARIOS.length; i++) {
      expect(ALL_SCENARIOS[i]!.year).toBeGreaterThanOrEqual(ALL_SCENARIOS[i - 1]!.year);
    }
  });
});
