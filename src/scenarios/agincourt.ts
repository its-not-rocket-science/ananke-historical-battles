import type { ArenaScenario } from "../ananke-internal.js";
import { expectMeanDuration } from "../ananke-internal.js";
import type { DirectValidationScenario } from "../types.js";
import {
  AGINCOURT_ENGLISH_ARCHER,
  AGINCOURT_ENGLISH_MAN_AT_ARMS,
  AGINCOURT_FRENCH_REARGUARD,
  AGINCOURT_FRENCH_VANGUARD,
} from "../archetypes/historical.js";
import {
  AGINCOURT_ARCHER_KIT,
  AGINCOURT_ENGLISH_MAN_AT_ARMS_KIT,
  AGINCOURT_FRENCH_REARGUARD_KIT,
  AGINCOURT_FRENCH_VANGUARD_KIT,
} from "../equipment/historical.js";
import {
  aggressivePolicy,
  closeInfantryPolicy,
  corridorObstacles,
  eliteArcherSkills,
  eliteInfantrySkills,
  makeLine,
  muddyField,
  skirmisherPolicy,
} from "./helpers.js";
import {
  formatPct,
  meanGroupCasualtyRate,
  meanGroupStructuralDamage,
  meanTeamCasualtyRate,
  meanTeamStructuralDamage,
} from "./validation-helpers.js";

const ENGLISH_ARCHER_IDS = Array.from({ length: 10 }, (_, index) => 100 + index);
const ENGLISH_MAN_AT_ARMS_IDS = Array.from({ length: 4 }, (_, index) => 200 + index);

export const AGINCOURT_SCENARIO: ArenaScenario = {
  name: "Battle of Agincourt (1415)",
  description: "English archers and dismounted men-at-arms hold a muddy, wooded frontage against a denser French assault.",
  combatants: [
    ...makeLine({ teamId: 1, count: 5, startId: 100, x: 2.4, yStart: -6.5, yStep: 1.4, archetype: AGINCOURT_ENGLISH_ARCHER, loadout: AGINCOURT_ARCHER_KIT, aiPolicy: skirmisherPolicy, skills: eliteArcherSkills }),
    ...makeLine({ teamId: 1, count: 5, startId: 105, x: 4.2, yStart: 0.9, yStep: 1.4, archetype: AGINCOURT_ENGLISH_ARCHER, loadout: AGINCOURT_ARCHER_KIT, aiPolicy: skirmisherPolicy, skills: eliteArcherSkills }),
    ...makeLine({ teamId: 1, count: 4, startId: 200, x: 3.3, yStart: -2.25, yStep: 1.5, archetype: AGINCOURT_ENGLISH_MAN_AT_ARMS, loadout: AGINCOURT_ENGLISH_MAN_AT_ARMS_KIT, aiPolicy: closeInfantryPolicy, skills: eliteInfantrySkills }),
    ...makeLine({ teamId: 2, count: 8, startId: 300, x: 8.2, yStart: -3.5, yStep: 1, archetype: AGINCOURT_FRENCH_VANGUARD, loadout: AGINCOURT_FRENCH_VANGUARD_KIT, aiPolicy: aggressivePolicy, skills: eliteInfantrySkills }),
    ...makeLine({ teamId: 2, count: 6, startId: 400, x: 9.4, yStart: -2.5, yStep: 1, archetype: AGINCOURT_FRENCH_REARGUARD, loadout: AGINCOURT_FRENCH_REARGUARD_KIT, aiPolicy: aggressivePolicy, skills: eliteInfantrySkills }),
  ],
  terrain: {
    cellSize_m: 4,
    obstacleGrid: corridorObstacles(7, 5),
    terrainGrid: muddyField(7, 5),
  },
  maxTicks: 320,
  expectations: [expectMeanDuration(10, 24)],
};

export const AGINCOURT_VALIDATION: DirectValidationScenario = {
  id: "agincourt_1415",
  scenario: AGINCOURT_SCENARIO,
  seeds: 100,
  documentation: {
    summary: "Agincourt is encoded as a muddy woodland corridor where bow-heavy English wings absorb the first contact and keep the French attack from cleanly reaching the central reserve.",
    scaleFactors: {
      defenders: { simulated: 14, historical: 9000, ratio: 642.9, notes: "The English deployment keeps the historically bow-heavy proportion, with ten archers and four dismounted men-at-arms." },
      attackers: { simulated: 14, historical: 12000, ratio: 857.1, notes: "The French force compresses the dismounted first battles into two heavy-infantry blocks so mud and frontage dominate the interaction." },
    },
    substitutions: [
      {
        historical: "Prepared archer stakes and exact baggage/woods geometry",
        simulated: "A narrow obstacle corridor plus separated archer wings",
        rationale: "The arena cannot place individual stakes, so flank archer spacing and blocked side lanes stand in for the anti-cavalry/anti-overlap preparation that fixed the English front.",
      },
      {
        historical: "Mounted French contingents and multiple sequential battles",
        simulated: "Two waves of dismounted mud-loaded men-at-arms",
        rationale: "The kernel has no horse model or scripted reinforcements, so the French assault is represented by fatigued heavy infantry entering in depth across the same bad ground.",
      },
    ],
    references: [
      "Anne Curry (2005), Agincourt: A New History.",
      "Juliet Barker (2005), Agincourt: Henry V and the Battle That Made England.",
      "The Mary Rose Trust, archery and longbow collections guidance.",
      "The Metropolitan Museum of Art, Arms and Armor FAQ on field armor weight and mobility.",
    ],
  },
  checks: [
    {
      label: "Battle lasts long enough for mud and frontage to matter",
      evaluate: (result) => ({ pass: result.meanCombatDuration_s >= 13, observed: `${result.meanCombatDuration_s.toFixed(1)}s`, expected: ">= 13.0s" }),
    },
    {
      label: "English casualties stay low in the compressed defence",
      evaluate: (result) => {
        const observed = meanTeamCasualtyRate(result, 1);
        return { pass: observed <= 0.05, observed: formatPct(observed), expected: "<= 5.0%" };
      },
    },
    {
      label: "Archer wings absorb more structural damage than the English centre reserve",
      evaluate: (result) => {
        const archers = meanGroupStructuralDamage(result, ENGLISH_ARCHER_IDS);
        const menAtArms = meanGroupStructuralDamage(result, ENGLISH_MAN_AT_ARMS_IDS);
        return {
          pass: archers >= menAtArms + 0.1,
          observed: `${archers.toFixed(3)} vs ${menAtArms.toFixed(3)}`,
          expected: "archer structural damage exceeds centre damage by at least 0.100",
        };
      },
    },
    {
      label: "English centre reserve remains largely intact",
      evaluate: (result) => {
        const centreSurvival = 1 - meanGroupCasualtyRate(result, ENGLISH_MAN_AT_ARMS_IDS);
        return {
          pass: centreSurvival >= 0.98,
          observed: formatPct(centreSurvival),
          expected: ">= 98.0% survive",
        };
      },
    },
    {
      label: "Archer wings remain mostly intact after the opening contact",
      evaluate: (result) => {
        const archerSurvival = 1 - meanGroupCasualtyRate(result, ENGLISH_ARCHER_IDS);
        return {
          pass: archerSurvival >= 0.9,
          observed: formatPct(archerSurvival),
          expected: ">= 90.0% survive",
        };
      },
    },
    {
      label: "English line still accumulates visible structural damage",
      evaluate: (result) => {
        const observed = meanTeamStructuralDamage(result, 1);
        return { pass: observed >= 0.08 && observed <= 0.22, observed: observed.toFixed(3), expected: "0.080-0.220" };
      },
    },
  ],
};
