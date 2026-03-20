import type { ArenaScenario } from "../ananke-internal.js";
import { expectMeanDuration } from "../ananke-internal.js";
import type { DirectValidationScenario } from "../types.js";
import { GREEK_ALLY_HOPLITE, PERSIAN_ARCHER, PERSIAN_INFANTRY, SPARTAN_HOPLITE } from "../archetypes/historical.js";
import { GREEK_ALLY_HOPLITE_KIT, PERSIAN_ARCHER_KIT, PERSIAN_INFANTRY_KIT, SPARTAN_HOPLITE_KIT } from "../equipment/historical.js";
import { aggressivePolicy, archerSkills, corridorObstacles, eliteArcherSkills, eliteInfantrySkills, infantrySkills, makeLine, defensiveInfantryPolicy } from "./helpers.js";
import { formatPct, meanGroupCasualtyRate, meanTeamCasualtyRate, meanTeamStructuralDamage } from "./validation-helpers.js";

const SPARTAN_IDS = Array.from({ length: 5 }, (_, index) => 100 + index);

export const THERMOPYLAE_SCENARIO: ArenaScenario = {
  name: "Battle of Thermopylae (480 BCE)",
  description: "A compact Greek rearguard delays a larger Persian force inside a narrow pass.",
  combatants: [
    ...makeLine({ teamId: 1, count: 5, startId: 100, x: 2.5, yStart: -2, yStep: 1, archetype: SPARTAN_HOPLITE, loadout: SPARTAN_HOPLITE_KIT, aiPolicy: defensiveInfantryPolicy, skills: eliteInfantrySkills }),
    ...makeLine({ teamId: 1, count: 4, startId: 200, x: 3.5, yStart: -2, yStep: 1, archetype: GREEK_ALLY_HOPLITE, loadout: GREEK_ALLY_HOPLITE_KIT, aiPolicy: defensiveInfantryPolicy, skills: infantrySkills }),
    ...makeLine({ teamId: 2, count: 12, startId: 300, x: 7, yStart: -3, yStep: 0.75, archetype: PERSIAN_INFANTRY, loadout: PERSIAN_INFANTRY_KIT, aiPolicy: aggressivePolicy, skills: infantrySkills }),
    ...makeLine({ teamId: 2, count: 4, startId: 400, x: 8, yStart: -2, yStep: 1.2, archetype: PERSIAN_ARCHER, loadout: PERSIAN_ARCHER_KIT, aiPolicy: aggressivePolicy, skills: eliteArcherSkills }),
  ],
  terrain: {
    cellSize_m: 4,
    obstacleGrid: corridorObstacles(6, 3),
  },
  maxTicks: 280,
  expectations: [expectMeanDuration(10, 20)],
};

export const THERMOPYLAE_VALIDATION: DirectValidationScenario = {
  id: "thermopylae_480bce",
  scenario: THERMOPYLAE_SCENARIO,
  seeds: 100,
  documentation: {
    summary: "A compressed Thermopylae pass where elite Spartan frontage slows a larger Persian force inside a single-lane obstacle corridor.",
    scaleFactors: {
      defenders: { simulated: 9, historical: 1500, ratio: 166.7, notes: "Each Greek entity stands for about 167 defenders in the final stand." },
      attackers: { simulated: 16, historical: 80000, ratio: 5000, notes: "The Persian army is heavily compressed; the pass frontage is the mechanic under test." },
    },
    substitutions: [
      {
        historical: "Anopaea-path encirclement and rotating Persian assault waves",
        simulated: "Single-lane obstacle corridor with repeated frontal pressure",
        rationale: "The current arena does not support a separate flanking entry phase, so the scenario validates frontage control rather than the betrayal event.",
      },
      {
        historical: "Achaemenid equipment mix",
        simulated: "Composite-bow archers and light infantry with simplified classical kits",
        rationale: "The equipment catalogue lacks Persian-specific items, so classical analogues are used and documented here.",
      },
    ],
    references: [
      "Herodotus, Histories Book VII.",
      "J.F. Lazenby (1993), The Defence of Greece 490-479 BC.",
      "Paul Cartledge (2006), Thermopylae.",
    ],
  },
  checks: [
    {
      label: "The choke point produces a sustained engagement",
      evaluate: (result) => ({ pass: result.meanCombatDuration_s >= 13, observed: `${result.meanCombatDuration_s.toFixed(1)}s`, expected: ">= 13.0s" }),
    },
    {
      label: "Greek casualties are noticeable but not instant collapse",
      evaluate: (result) => {
        const observed = meanTeamCasualtyRate(result, 1);
        return { pass: observed >= 0.03 && observed <= 0.15, observed: formatPct(observed), expected: "3.0%-15.0%" };
      },
    },
    {
      label: "Greek line absorbs measurable structural punishment",
      evaluate: (result) => {
        const observed = meanTeamStructuralDamage(result, 1);
        return { pass: observed >= 0.06 && observed <= 0.16, observed: observed.toFixed(3), expected: "0.060-0.160" };
      },
    },
    {
      label: "Spartans survive at least as well as the overall Greek force",
      evaluate: (result) => {
        const spartans = 1 - meanGroupCasualtyRate(result, SPARTAN_IDS);
        const greeks = 1 - meanTeamCasualtyRate(result, 1);
        return { pass: spartans + 0.06 >= greeks, observed: `${formatPct(spartans)} vs ${formatPct(greeks)}`, expected: "Spartan survival within 6 percentage points of overall Greek survival" };
      },
    },
  ],
};
