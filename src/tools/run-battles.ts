import { runArena } from "../ananke-internal.js";

declare const process: { argv: string[]; exit(code?: number): never; };
import { ALL_VALIDATIONS, type ValidationRunResult } from "../index.js";

function parseSeeds(argv: string[]): number | undefined {
  const index = argv.indexOf("--seeds");
  if (index < 0) {
    return undefined;
  }
  const value = Number.parseInt(argv[index + 1] ?? "", 10);
  return Number.isFinite(value) ? value : undefined;
}

function runValidation(validation: typeof ALL_VALIDATIONS[number], seedsOverride?: number): ValidationRunResult {
  const seeds = seedsOverride ?? validation.seeds;
  const result = runArena(validation.scenario, seeds);
  const observations = validation.checks.map((check) => ({ label: check.label, ...check.evaluate(result) }));
  return {
    id: validation.id,
    name: validation.scenario.name,
    seeds,
    pass: observations.every((observation) => observation.pass),
    observations,
    documentation: validation.documentation,
  };
}

function formatValidation(result: ValidationRunResult): string {
  const lines: string[] = [
    `\n${"─".repeat(80)}`,
    `[${result.pass ? "PASS" : "FAIL"}] ${result.name} (${result.id}) — ${result.seeds} seeds`,
    `${"─".repeat(80)}`,
  ];

  for (const observation of result.observations) {
    lines.push(`  [${observation.pass ? "ok" : "FAIL"}] ${observation.label}`);
    lines.push(`       observed: ${observation.observed}`);
    lines.push(`       expected: ${observation.expected}`);
  }

  lines.push(`  Scale defenders: 1:${result.documentation.scaleFactors.defenders.ratio.toFixed(1)} (${result.documentation.scaleFactors.defenders.simulated} simulated / ${result.documentation.scaleFactors.defenders.historical} historical)`);
  lines.push(`  Scale attackers: 1:${result.documentation.scaleFactors.attackers.ratio.toFixed(1)} (${result.documentation.scaleFactors.attackers.simulated} simulated / ${result.documentation.scaleFactors.attackers.historical} historical)`);

  for (const substitution of result.documentation.substitutions) {
    lines.push(`  Substitution: ${substitution.historical} -> ${substitution.simulated}`);
    lines.push(`     Rationale: ${substitution.rationale}`);
  }

  return lines.join("\n");
}

const seedsOverride = parseSeeds(process.argv.slice(2));
const results = ALL_VALIDATIONS.map((validation) => runValidation(validation, seedsOverride));
const passCount = results.filter((result) => result.pass).length;

console.log("\nananke-historical-battles — direct arena validation");
console.log(`Scenarios: ${ALL_VALIDATIONS.length}`);
console.log(`Seeds per scenario: ${seedsOverride ?? ALL_VALIDATIONS[0].seeds}`);

for (const result of results) {
  console.log(formatValidation(result));
}

console.log(`\n${"═".repeat(80)}`);
console.log(`[${passCount === results.length ? "PASS" : "FAIL"}] ${passCount}/${results.length} scenarios passed direct validation`);
console.log(`${"═".repeat(80)}\n`);

if (passCount !== results.length) {
  process.exit(1);
}
