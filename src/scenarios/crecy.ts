import type { ArenaScenario } from "../ananke-internal.js";
import { expectMeanDuration } from "../ananke-internal.js";
import type { DirectValidationScenario } from "../types.js";
import { ENGLISH_LONGBOWMAN, ENGLISH_MAN_AT_ARMS, FRENCH_MAN_AT_ARMS, GENOESE_CROSSBOWMAN } from "../archetypes/historical.js";
import { ENGLISH_LONGBOW_KIT, ENGLISH_MAN_AT_ARMS_KIT, FRENCH_MAN_AT_ARMS_KIT, GENOESE_CROSSBOW_KIT } from "../equipment/historical.js";
import { aggressivePolicy, archerSkills, closeInfantryPolicy, eliteArcherSkills, eliteInfantrySkills, makeLine, muddyField, skirmisherPolicy } from "./helpers.js";
import { formatPct, meanGroupCasualtyRate, meanGroupStructuralDamage, meanTeamCasualtyRate, meanTeamStructuralDamage } from "./validation-helpers.js";

const GENOESE_IDS = Array.from({ length: 5 }, (_, index) => 300 + index);
const ENGLISH_ARCHER_IDS = Array.from({ length: 8 }, (_, index) => 100 + index);

export const CRECY_SCENARIO: ArenaScenario = {
  name: "Battle of Crécy (1346)",
  description: "English archers on prepared ground disrupt Genoese crossbowmen and the following French assaults.",
  combatants: [
    ...makeLine({ teamId: 1, count: 8, startId: 100, x: 2, yStart: -7, yStep: 2, archetype: ENGLISH_LONGBOWMAN, loadout: ENGLISH_LONGBOW_KIT(), aiPolicy: skirmisherPolicy, skills: eliteArcherSkills }),
    ...makeLine({ teamId: 1, count: 3, startId: 200, x: 3, yStart: -3, yStep: 3, archetype: ENGLISH_MAN_AT_ARMS, loadout: ENGLISH_MAN_AT_ARMS_KIT, aiPolicy: closeInfantryPolicy, skills: eliteInfantrySkills }),
    ...makeLine({ teamId: 2, count: 5, startId: 300, x: 7, yStart: -4, yStep: 2, archetype: GENOESE_CROSSBOWMAN, loadout: GENOESE_CROSSBOW_KIT, aiPolicy: skirmisherPolicy, skills: archerSkills }),
    ...makeLine({ teamId: 2, count: 8, startId: 400, x: 9, yStart: -7, yStep: 2, archetype: FRENCH_MAN_AT_ARMS, loadout: FRENCH_MAN_AT_ARMS_KIT, aiPolicy: aggressivePolicy, skills: eliteInfantrySkills }),
  ],
  terrain: {
    cellSize_m: 4,
    terrainGrid: muddyField(6, 4),
  },
  maxTicks: 260,
  expectations: [expectMeanDuration(8, 20)],
};

export const CRECY_VALIDATION: DirectValidationScenario = {
  id: "crecy_1346",
  scenario: CRECY_SCENARIO,
  seeds: 100,
  documentation: {
    summary: "Crécy focuses on wet-string crossbow degradation, English archery concentration, and the resilience of a prepared English line.",
    scaleFactors: {
      defenders: { simulated: 11, historical: 12000, ratio: 1090.9, notes: "The English line is compressed to archers and a small reserve." },
      attackers: { simulated: 13, historical: 30000, ratio: 2307.7, notes: "Several French assault waves are folded into one force package." },
    },
    substitutions: [
      {
        historical: "Genoese pavises and rain-soaked strings",
        simulated: "Crossbow loadout with slow recycle time and light protection",
        rationale: "The arena has no pavise deployment state, so the disadvantage is encoded as reduced staying power and slower reloading.",
      },
      {
        historical: "Mounted French knight charges",
        simulated: "Aggressive heavy infantry waves",
        rationale: "Mounted combat is not yet available in the kernel, so repeated shock assaults are represented by fast-closing heavy infantry.",
      },
    ],
    references: [
      "Andrew Ayton and Philip Preston (eds.), The Battle of Crécy, 1346.",
      "Clifford Rogers (1998), War Cruel and Sharp.",
    ],
  },
  checks: [
    {
      label: "Engagement runs long enough for ranged pressure to matter",
      evaluate: (result) => ({ pass: result.meanCombatDuration_s >= 12, observed: `${result.meanCombatDuration_s.toFixed(1)}s`, expected: ">= 12.0s" }),
    },
    {
      label: "English casualties remain very low",
      evaluate: (result) => {
        const observed = meanTeamCasualtyRate(result, 1);
        return { pass: observed <= 0.05, observed: formatPct(observed), expected: "<= 5.0%" };
      },
    },
    {
      label: "English side still accumulates measurable damage under pressure",
      evaluate: (result) => {
        const observed = meanTeamStructuralDamage(result, 1);
        return { pass: observed >= 0.14 && observed <= 0.24, observed: observed.toFixed(3), expected: "0.140-0.240" };
      },
    },
    {
      label: "Archer line survives better than the Genoese screen",
      evaluate: (result) => {
        const englishArchers = 1 - meanGroupCasualtyRate(result, ENGLISH_ARCHER_IDS);
        const genoese = 1 - meanGroupCasualtyRate(result, GENOESE_IDS);
        return { pass: englishArchers + 0.02 >= genoese, observed: `${formatPct(englishArchers)} vs ${formatPct(genoese)}`, expected: "English archer survival within 2 percentage points of Genoese survival" };
      },
    },
  ],
};
