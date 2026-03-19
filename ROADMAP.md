# ananke-historical-battles — Roadmap

## Phase 1 (current — v0.1.x): Scenario stubs with structural validation

- 4 battle scenarios with documented pass criteria and historical references:
  - Thermopylae (480 BC) — terrain choke-point + elite infantry morale
  - Marathon (490 BC) — phalanx formation + double envelopment
  - Agincourt (1415) — ranged superiority + armour-fatigue interaction
  - Constantinople (1453) — siege disease attrition + starvation fatigue
- Shared `BattleScenario` type with `BattlePassCriteria` range checks
- Structural Vitest suite (8 test groups): required fields, criteria bounds, historical accuracy
- CLI runner `run:battles` printing pass/fail table for structural checks

## Phase 2: Full simulation runs with 50-seed baselines

**Target per scenario:**

1. Implement `runScenario(scenario, seeds)` using ananke's:
   - `createWorld()` / `stepWorld()` — combat simulation
   - `stepDowntime()` / `stepDiseaseForEntity()` / `stepWoundAging()` — siege attrition
   - `buildAICommands()` — AI-driven combatants
   - `TerrainGrid` / `HazardGrid` — choke-point and mud-fatigue terrain
2. Commit 50-seed baseline result reports to `scenarios/results/*.json`
3. Promote `claimType` to `"quantitative"` for Thermopylae and Marathon once
   baseline CI half-widths are below 10%

**Scenario-specific work:**

| Scenario        | Key ananke integration points                                      |
|-----------------|--------------------------------------------------------------------|
| Thermopylae     | Narrow corridor `TerrainGrid`; formation cohesion bonus; flanking event at tick T |
| Agincourt       | Mud `HazardGrid` (elevated fatigueInc); longbow RANGED archetype; plate armour |
| Marathon        | Three-unit formation (left/centre/right wings); morale contagion on rout |
| Constantinople  | Campaign-mode loop; `spreadDisease()` daily; `stepSleep()` 53-day debt; starvation `reserveEnergy_J` drain |

## Phase 3: 10 additional battles

Target battles (chronological):

| Battle                  | Year | Primary validation claim                                 |
|-------------------------|------|----------------------------------------------------------|
| Battle of Gaugamela     | -331 | Cavalry oblique charge envelopment (Alexander vs. Darius)|
| Battle of Zama          | -202 | Elephant panic + formation gap exploitation              |
| Battle of Leuctra       | -371 | Oblique phalanx (Sacred Band) vs. Spartan line           |
| Battle of Cannae        | -216 | Double envelopment; highest single-day casualties ratio  |
| Battle of Adrianople    | 378  | Gothic cavalry vs. Roman infantry (cavalry arm debut)    |
| Battle of Hastings      | 1066 | Shield wall defence vs. Norman cavalry charge            |
| Battle of Bannockburn   | 1314 | Schiltron spearmen vs. English heavy cavalry             |
| Battle of Crécy         | 1346 | Longbow vs. Genoese crossbow + French cavalry            |
| Battle of Breitenfeld   | 1631 | Early firearms (musketeer) integration into pike formation|
| Battle of Waterloo      | 1815 | Artillery attrition + combined-arms (infantry/cavalry/guns)|

## Phase 4: Interactive battle report generator

- `generateBattleReport(scenarioId, seeds)` → Markdown + JSON output
- Includes: force ratio chart, casualty progression by tick, disease incidence
  curve (for siege scenarios), confidence interval summary
- Integrated with ananke's `formatArenaReport()` and `narrateRepresentativeTrial()`
- Output committed to `scenarios/results/<id>-report.md` on each CI run
