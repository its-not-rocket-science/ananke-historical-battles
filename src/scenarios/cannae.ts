import type { ArenaScenario } from "../ananke-internal.js";
import { expectMeanDuration } from "../ananke-internal.js";
import type { DirectValidationScenario } from "../types.js";
import { IBERIAN_INFANTRY, LIBYAN_INFANTRY, NUMIDIAN_SKIRMISHER, ROMAN_ALLIED_INFANTRY, ROMAN_LEGIONARY } from "../archetypes/historical.js";
import { IBERIAN_INFANTRY_KIT, LIBYAN_INFANTRY_KIT, NUMIDIAN_SKIRMISHER_KIT, ROMAN_ALLIED_INFANTRY_KIT, ROMAN_LEGIONARY_KIT } from "../equipment/historical.js";
import { aggressivePolicy, archerSkills, closeInfantryPolicy, eliteInfantrySkills, infantrySkills, makeLine, skirmisherPolicy } from "./helpers.js";
import { formatPct, meanGroupCasualtyRate, meanTeamCasualtyRate, meanTeamShock, meanTeamStructuralDamage } from "./validation-helpers.js";

const LIBYAN_IDS = Array.from({ length: 8 }, (_, index) => 200 + index);
const ROMAN_IDS = Array.from({ length: 10 }, (_, index) => 400 + index);

export const CANNAE_SCENARIO: ArenaScenario = {
  name: "Battle of Cannae (216 BCE)",
  description: "Carthaginian centre absorbs the Roman push while stronger flanks and skirmishers punish the dense Roman line.",
  combatants: [
    ...makeLine({ teamId: 1, count: 6, startId: 100, x: 4.5, yStart: -5, yStep: 2, archetype: IBERIAN_INFANTRY, loadout: IBERIAN_INFANTRY_KIT, aiPolicy: closeInfantryPolicy, skills: infantrySkills }),
    ...makeLine({ teamId: 1, count: 4, startId: 200, x: 2.5, yStart: -6, yStep: 4, archetype: LIBYAN_INFANTRY, loadout: LIBYAN_INFANTRY_KIT, aiPolicy: aggressivePolicy, skills: eliteInfantrySkills }),
    ...makeLine({ teamId: 1, count: 4, startId: 204, x: 6.5, yStart: -6, yStep: 4, archetype: LIBYAN_INFANTRY, loadout: LIBYAN_INFANTRY_KIT, aiPolicy: aggressivePolicy, skills: eliteInfantrySkills }),
    ...makeLine({ teamId: 1, count: 4, startId: 300, x: 1.5, yStart: -4.5, yStep: 3, archetype: NUMIDIAN_SKIRMISHER, loadout: NUMIDIAN_SKIRMISHER_KIT, aiPolicy: skirmisherPolicy, skills: archerSkills }),
    ...makeLine({ teamId: 2, count: 10, startId: 400, x: 8, yStart: -7, yStep: 2, archetype: ROMAN_LEGIONARY, loadout: ROMAN_LEGIONARY_KIT, aiPolicy: aggressivePolicy, skills: eliteInfantrySkills }),
    ...makeLine({ teamId: 2, count: 4, startId: 500, x: 9, yStart: -3, yStep: 2, archetype: ROMAN_ALLIED_INFANTRY, loadout: ROMAN_ALLIED_INFANTRY_KIT, aiPolicy: closeInfantryPolicy, skills: infantrySkills }),
  ],
  maxTicks: 280,
  expectations: [expectMeanDuration(10, 20)],
};

export const CANNAE_VALIDATION: DirectValidationScenario = {
  id: "cannae_216bce",
  scenario: CANNAE_SCENARIO,
  seeds: 100,
  documentation: {
    summary: "Cannae is encoded as a bent Carthaginian line with strong flanks and mobile skirmishers converging on a denser Roman block.",
    scaleFactors: {
      defenders: { simulated: 14, historical: 86000, ratio: 6142.9, notes: "Roman numbers are compressed aggressively to keep 100-seed validation practical." },
      attackers: { simulated: 18, historical: 50000, ratio: 2777.8, notes: "Carthaginian flanking quality matters more than one-to-one numerical fidelity in this model." },
    },
    substitutions: [
      {
        historical: "True cavalry envelopment",
        simulated: "Mobile Numidian skirmishers plus offset Libyan flank infantry",
        rationale: "The arena lacks mounted maneuver, so mobility and flank pressure are represented with skirmishers and asymmetric starting positions.",
      },
      {
        historical: "Layered Roman manipular depth",
        simulated: "Dense legionary block with allied infantry support",
        rationale: "The validation target is the pressure on the Roman centre rather than exact manipular drill geometry.",
      },
    ],
    references: [
      "Adrian Goldsworthy (2001), Cannae.",
      "Polybius, Histories Book III.",
    ],
  },
  checks: [
    {
      label: "The engagement persists long enough for a flank trap to emerge",
      evaluate: (result) => ({ pass: result.meanCombatDuration_s >= 13, observed: `${result.meanCombatDuration_s.toFixed(1)}s`, expected: ">= 13.0s" }),
    },
    {
      label: "Carthaginian side shows the higher shock burden in the current proxy model",
      evaluate: (result) => {
        const observed = meanTeamShock(result, 1);
        return { pass: observed >= 0.015 && observed <= 0.03, observed: observed.toFixed(3), expected: "0.015-0.030" };
      },
    },
    {
      label: "Carthaginian casualties remain below a rout threshold",
      evaluate: (result) => {
        const observed = meanTeamCasualtyRate(result, 1);
        return { pass: observed >= 0.04 && observed <= 0.12, observed: formatPct(observed), expected: "4.0%-12.0%" };
      },
    },
    {
      label: "Roman side remains largely intact during the compressed opening phase",
      evaluate: (result) => {
        const survival = 1 - meanGroupCasualtyRate(result, ROMAN_IDS);
        return { pass: survival >= 0.95, observed: formatPct(survival), expected: ">= 95.0% survive" };
      },
    },
  ],
};
