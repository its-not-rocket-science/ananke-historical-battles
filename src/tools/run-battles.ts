/**
 * run-battles.ts — CLI runner for historical battle scenarios
 *
 * Usage:
 *   node dist/tools/run-battles.js [--seeds N]
 *
 * Phase 1: Prints a structural validation table confirming each scenario
 * exports the required fields. Full simulation runs are deferred to Phase 2
 * once runScenario() is implemented using ananke's createWorld / stepWorld.
 *
 * Phase 2 will wire each BattleScenario to an actual arena run and compare
 * observed outcomes against passCriteria.
 */

import { ALL_SCENARIOS, type BattleRunResult } from "../index.js";
import type { BattleScenario } from "../types.js";

// ── Argument parsing ──────────────────────────────────────────────────────────

const args   = typeof process !== "undefined" ? process.argv.slice(2) : [];
const seedsArg = args.indexOf("--seeds");
const SEEDS  = seedsArg >= 0 ? parseInt(args[seedsArg + 1] ?? "10", 10) : 10;

// ── Structural validation (Phase 1) ──────────────────────────────────────────

/**
 * Phase 1 runner: checks that each scenario has the required structural fields
 * and plausible pass criteria bounds. Returns a BattleRunResult with
 * pass=true if all structural checks pass, false otherwise.
 *
 * In Phase 2 this function is replaced by actual simulation runs.
 */
function runStructuralCheck(scenario: BattleScenario, seeds: number): BattleRunResult {
  const criteriaResults: BattleRunResult["criteriaResults"] = [];
  let allPass = true;

  // Required string fields
  for (const field of ["id", "name", "location", "description"] as const) {
    const val = scenario[field];
    const pass = typeof val === "string" && val.length > 0;
    if (!pass) allPass = false;
    criteriaResults.push({
      criterion: `scenario.${field} is non-empty string`,
      expected:  "string, length > 0",
      observed:  typeof val === "string" ? `"${val.slice(0, 40)}"` : String(val),
      pass,
    });
  }

  // Reference array
  {
    const pass = Array.isArray(scenario.reference) && scenario.reference.length > 0;
    if (!pass) allPass = false;
    criteriaResults.push({
      criterion: "scenario.reference is non-empty array",
      expected:  "array, length >= 1",
      observed:  String(scenario.reference?.length ?? 0) + " refs",
      pass,
    });
  }

  // claimType
  {
    const valid: string[] = ["plausibility", "quantitative"];
    const pass = valid.includes(scenario.claimType);
    if (!pass) allPass = false;
    criteriaResults.push({
      criterion: "scenario.claimType is valid",
      expected:  "plausibility | quantitative",
      observed:  scenario.claimType,
      pass,
    });
  }

  // historicalForces
  {
    const def = scenario.historicalForces.defenders;
    const att = scenario.historicalForces.attackers;
    const pass = def.count > 0 && att.count > 0;
    if (!pass) allPass = false;
    criteriaResults.push({
      criterion: "historicalForces counts > 0",
      expected:  "both defender and attacker count > 0",
      observed:  `defenders=${def.count}, attackers=${att.count}`,
      pass,
    });
  }

  // passCriteria has at least one entry
  {
    const criteria = scenario.passCriteria;
    const definedKeys = Object.keys(criteria).filter(
      (k) => k !== "notes" && criteria[k as keyof typeof criteria] !== undefined,
    );
    const pass = definedKeys.length > 0;
    if (!pass) allPass = false;
    criteriaResults.push({
      criterion: "passCriteria has at least one quantified criterion",
      expected:  ">= 1 defined criterion (excluding notes)",
      observed:  `${definedKeys.length} criteria: ${definedKeys.join(", ")}`,
      pass,
    });
  }

  // durationTicks.min must be > 0 if present
  if (scenario.passCriteria.durationTicks !== undefined) {
    const min = scenario.passCriteria.durationTicks.min ?? 0;
    const pass = min > 0;
    if (!pass) allPass = false;
    criteriaResults.push({
      criterion: "passCriteria.durationTicks.min > 0",
      expected:  "> 0",
      observed:  String(min),
      pass,
    });
  }

  // casualty rates must be in [0, 1] if present
  for (const [key, bound] of [
    ["defenderCasualtyRate", scenario.passCriteria.defenderCasualtyRate],
    ["attackerCasualtyRate", scenario.passCriteria.attackerCasualtyRate],
  ] as const) {
    if (bound === undefined) continue;
    const { min, max } = bound;
    const inRange =
      (min === undefined || (min >= 0 && min <= 1)) &&
      (max === undefined || (max >= 0 && max <= 1)) &&
      (min === undefined || max === undefined || min <= max);
    if (!inRange) allPass = false;
    criteriaResults.push({
      criterion: `passCriteria.${key} bounds in [0,1]`,
      expected:  "min,max in [0,1] and min <= max",
      observed:  `min=${min ?? "—"}, max=${max ?? "—"}`,
      pass:      inRange,
    });
  }

  // TODO (Phase 2): replace with actual arena simulation across `seeds` seeds.
  // Record observed casualtyRates, durationTicks, and compare to passCriteria.
  criteriaResults.push({
    criterion: "simulation run (Phase 2 — NOT YET IMPLEMENTED)",
    expected:  `${seeds} seeds, compare to passCriteria`,
    observed:  "STUB — Phase 2 required",
    pass:      true,  // structural-only pass; not a simulation result
  });

  return {
    scenarioId:   scenario.id,
    scenarioName: scenario.name,
    seeds,
    pass:         allPass,
    criteriaResults,
    notes: scenario.passCriteria.notes,
  };
}

// ── Formatting ────────────────────────────────────────────────────────────────

function formatResult(result: BattleRunResult): string {
  const statusIcon = result.pass ? "PASS" : "FAIL";
  const lines: string[] = [
    `\n${"─".repeat(72)}`,
    `[${statusIcon}] ${result.scenarioName} (id: ${result.scenarioId})`,
    `${"─".repeat(72)}`,
  ];

  for (const cr of result.criteriaResults) {
    const icon = cr.pass ? " ok " : "FAIL";
    lines.push(`  [${icon}] ${cr.criterion}`);
    if (!cr.pass) {
      lines.push(`         expected: ${cr.expected}`);
      lines.push(`         observed: ${cr.observed}`);
    }
  }

  if (result.notes) {
    const trimmed = result.notes.length > 120 ? result.notes.slice(0, 117) + "..." : result.notes;
    lines.push(`\n  Notes: ${trimmed}`);
  }

  return lines.join("\n");
}

// ── Main ──────────────────────────────────────────────────────────────────────

const results = ALL_SCENARIOS.map((s) => runStructuralCheck(s, SEEDS));
const passCount = results.filter((r) => r.pass).length;

console.log(`\nananke-historical-battles — Phase 1 structural validation`);
console.log(`Seeds configured: ${SEEDS} (simulation runs deferred to Phase 2)`);
console.log(`Scenarios: ${ALL_SCENARIOS.length}`);

for (const result of results) {
  console.log(formatResult(result));
}

const overallIcon = passCount === results.length ? "PASS" : "FAIL";
console.log(`\n${"═".repeat(72)}`);
console.log(`[${overallIcon}] ${passCount} / ${results.length} scenarios passed structural validation`);
console.log(`${"═".repeat(72)}\n`);

if (passCount < results.length) {
  process.exit(1);
}
