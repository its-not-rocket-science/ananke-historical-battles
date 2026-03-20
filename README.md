# ananke-historical-battles

Historically themed arena benchmarks for `@its-not-rocket-science/ananke`.

This repository now ships five runnable scenario modules:

- `Thermopylae (480 BCE)`
- `Agincourt (1415)`
- `Crécy (1346)`
- `Hastings (1066)`
- `Cannae (216 BCE)`

Each scenario exports:

1. an `ArenaScenario` with scaled combatants, terrain, archetypes, and period loadouts
2. a `DirectValidationScenario` with:
   - 100-seed validation settings
   - documented scale factors
   - documented substitution rationales
   - direct checks against aggregate arena output

## Install

```bash
npm install
```

## Validate all scenarios

```bash
npm run build
npm run validate
```

The validation runner executes every scenario across 100 seeds and prints:

- scenario-level pass/fail
- each direct validation check
- attacker/defender scale factors
- substitution rationales used to bridge current kernel limitations

## Files of interest

- `src/archetypes/historical.ts` — period-specific archetype overrides
- `src/equipment/historical.ts` — period-specific loadouts and substitutions
- `src/scenarios/*.ts` — scenario + validation exports
- `src/tools/run-battles.ts` — 100-seed validation runner

## Notes on historical fidelity

These scenarios are intentionally documented as **compressed proxy models**.
The current Ananke arena does not yet expose every mechanic needed for strict historical reconstruction, especially:

- mounted combat
- deployable fieldworks such as stakes or pavises
- scripted multi-phase encirclement / betrayal events

Where those gaps matter, the scenario files record the substitution explicitly in each `DirectValidationScenario.documentation.substitutions` entry.
