import type { ArenaScenario } from "../ananke-internal.js";
import { expectMeanDuration } from "../ananke-internal.js";
import type { DirectValidationScenario } from "../types.js";
import { ENGLISH_LONGBOWMAN, ENGLISH_MAN_AT_ARMS, FRENCH_MAN_AT_ARMS, GENOESE_CROSSBOWMAN } from "../archetypes/historical.js";
import { ENGLISH_LONGBOW_KIT, ENGLISH_MAN_AT_ARMS_KIT, FRENCH_MAN_AT_ARMS_KIT, GENOESE_CROSSBOW_KIT } from "../equipment/historical.js";
import { aggressivePolicy, archerSkills, closeInfantryPolicy, eliteArcherSkills, eliteInfantrySkills, makeLine, muddyField, skirmisherPolicy } from "./helpers.js";
import { formatPct, meanGroupCasualtyRate, meanTeamCasualtyRate, meanTeamStructuralDamage } from "./validation-helpers.js";

const ENGLISH_LONGBOW_IDS = Array.from({ length: 8 }, (_, index) => 100 + index);

export const AGINCOURT_SCENARIO: ArenaScenario = {
  name: "Battle of Agincourt (1415)",
  description: "English longbowmen and dismounted men-at-arms resist a larger French assault in deep mud.",
  combatants: [
    ...makeLine({ teamId: 1, count: 8, startId: 100, x: 2, yStart: -7, yStep: 2, archetype: ENGLISH_LONGBOWMAN, loadout: ENGLISH_LONGBOW_KIT(), aiPolicy: skirmisherPolicy, skills: eliteArcherSkills }),
    ...makeLine({ teamId: 1, count: 3, startId: 200, x: 3, yStart: -3, yStep: 3, archetype: ENGLISH_MAN_AT_ARMS, loadout: ENGLISH_MAN_AT_ARMS_KIT, aiPolicy: closeInfantryPolicy, skills: eliteInfantrySkills }),
    ...makeLine({ teamId: 2, count: 9, startId: 300, x: 8, yStart: -7, yStep: 2, archetype: FRENCH_MAN_AT_ARMS, loadout: FRENCH_MAN_AT_ARMS_KIT, aiPolicy: aggressivePolicy, skills: eliteInfantrySkills }),
    ...makeLine({ teamId: 2, count: 3, startId: 400, x: 10, yStart: -3, yStep: 2, archetype: GENOESE_CROSSBOWMAN, loadout: GENOESE_CROSSBOW_KIT, aiPolicy: skirmisherPolicy, skills: archerSkills }),
  ],
  terrain: {
    cellSize_m: 4,
    terrainGrid: muddyField(6, 4),
  },
  maxTicks: 260,
  expectations: [expectMeanDuration(8, 20)],
};

export const AGINCOURT_VALIDATION: DirectValidationScenario = {
  id: "agincourt_1415",
  scenario: AGINCOURT_SCENARIO,
  seeds: 100,
  documentation: {
    summary: "Scaled Agincourt model focused on mud-friction, compressed frontage, and the survivability of an English line built around warbow specialists.",
    scaleFactors: {
      defenders: { simulated: 11, historical: 8500, ratio: 772.7, notes: "Each English entity represents roughly 773 soldiers." },
      attackers: { simulated: 12, historical: 12000, ratio: 1000, notes: "Each French entity represents roughly 1,000 attackers." },
    },
    substitutions: [
      {
        historical: "French mounted and dismounted men-at-arms in bespoke 1415 harnesses",
        simulated: "Knight infantry archetype with mud-soaked plate loadout and poleaxe",
        rationale: "The arena kernel has no horse system, so the decisive burden is represented as slower, higher-fatigue heavy infantry.",
      },
      {
        historical: "English longbowmen protected by stakes",
        simulated: "Warbow loadout plus elite ranged skill and skirmisher spacing",
        rationale: "The current arena DSL lacks deployable stakes; spacing and superior ranged accuracy stand in for the prepared archer frontage.",
      },
    ],
    references: [
      "Anne Curry (2005), Agincourt: A New History.",
      "Juliet Barker (2005), Agincourt: Henry V and the Battle That Made England.",
    ],
  },
  checks: [
    {
      label: "Battle lasts long enough for mud and frontage to matter",
      evaluate: (result) => ({ pass: result.meanCombatDuration_s >= 12, observed: `${result.meanCombatDuration_s.toFixed(1)}s`, expected: ">= 12.0s" }),
    },
    {
      label: "English casualties stay low in the compressed model",
      evaluate: (result) => {
        const observed = meanTeamCasualtyRate(result, 1);
        return { pass: observed <= 0.05, observed: formatPct(observed), expected: "<= 5.0%" };
      },
    },
    {
      label: "English line absorbs manageable structural damage",
      evaluate: (result) => {
        const observed = meanTeamStructuralDamage(result, 1);
        return { pass: observed >= 0.12 && observed <= 0.24, observed: observed.toFixed(3), expected: "0.120-0.240" };
      },
    },
    {
      label: "Longbow contingent remains mostly intact",
      evaluate: (result) => {
        const survival = 1 - meanGroupCasualtyRate(result, ENGLISH_LONGBOW_IDS);
        return { pass: survival >= 0.9, observed: formatPct(survival), expected: ">= 90.0% survive" };
      },
    },
  ],
};
