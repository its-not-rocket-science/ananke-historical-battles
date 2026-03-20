import type { ArenaScenario } from "../ananke-internal.js";
import { expectMeanDuration } from "../ananke-internal.js";
import type { DirectValidationScenario } from "../types.js";
import { NORMAN_ARCHER, NORMAN_INFANTRY, NORMAN_KNIGHT, SAXON_FYRD, SAXON_HUSCARL } from "../archetypes/historical.js";
import { NORMAN_ARCHER_KIT, NORMAN_INFANTRY_KIT, NORMAN_KNIGHT_KIT, SAXON_FYRD_KIT, SAXON_HUSCARL_KIT } from "../equipment/historical.js";
import { archerSkills, closeInfantryPolicy, eliteInfantrySkills, infantrySkills, makeLine, ridgeElevation, skirmisherPolicy, aggressivePolicy, defensiveInfantryPolicy } from "./helpers.js";
import { formatPct, meanGroupCasualtyRate, meanTeamCasualtyRate, meanTeamStructuralDamage } from "./validation-helpers.js";

const NORMAN_KNIGHT_IDS = Array.from({ length: 4 }, (_, index) => 100 + index);
const SAXON_HUSCARL_IDS = Array.from({ length: 5 }, (_, index) => 300 + index);
const FYRD_IDS = Array.from({ length: 7 }, (_, index) => 400 + index);

export const HASTINGS_SCENARIO: ArenaScenario = {
  name: "Battle of Hastings (1066)",
  description: "Norman mixed arms attack uphill into a Saxon shield wall on a ridge.",
  combatants: [
    ...makeLine({ teamId: 1, count: 4, startId: 100, x: 2, yStart: -4.5, yStep: 3, archetype: NORMAN_KNIGHT, loadout: NORMAN_KNIGHT_KIT, aiPolicy: aggressivePolicy, skills: eliteInfantrySkills }),
    ...makeLine({ teamId: 1, count: 5, startId: 200, x: 3.5, yStart: -4, yStep: 2, archetype: NORMAN_INFANTRY, loadout: NORMAN_INFANTRY_KIT, aiPolicy: closeInfantryPolicy, skills: infantrySkills }),
    ...makeLine({ teamId: 1, count: 4, startId: 260, x: 1, yStart: -3, yStep: 2, archetype: NORMAN_ARCHER, loadout: NORMAN_ARCHER_KIT, aiPolicy: skirmisherPolicy, skills: archerSkills }),
    ...makeLine({ teamId: 2, count: 5, startId: 300, x: 7, yStart: -4, yStep: 2, archetype: SAXON_HUSCARL, loadout: SAXON_HUSCARL_KIT, aiPolicy: defensiveInfantryPolicy, skills: eliteInfantrySkills }),
    ...makeLine({ teamId: 2, count: 7, startId: 400, x: 8.5, yStart: -6, yStep: 2, archetype: SAXON_FYRD, loadout: SAXON_FYRD_KIT, aiPolicy: defensiveInfantryPolicy, skills: infantrySkills }),
  ],
  terrain: {
    cellSize_m: 4,
    elevationGrid: ridgeElevation(2, 4, -3, 3, 2),
  },
  maxTicks: 280,
  expectations: [expectMeanDuration(10, 20)],
};

export const HASTINGS_VALIDATION: DirectValidationScenario = {
  id: "hastings_1066",
  scenario: HASTINGS_SCENARIO,
  seeds: 100,
  documentation: {
    summary: "Hastings is represented as an uphill mixed-arms assault against a ridge-held shield wall, emphasizing duration and shield-wall resilience.",
    scaleFactors: {
      defenders: { simulated: 12, historical: 7000, ratio: 583.3, notes: "The Saxon shield wall is compressed to housecarls and fyrd blocks." },
      attackers: { simulated: 13, historical: 7000, ratio: 538.5, notes: "Norman numbers are near-parity scaled so composition and slope matter most." },
    },
    substitutions: [
      {
        historical: "Norman cavalry charges",
        simulated: "Fast heavy infantry with lance-substitute weapons",
        rationale: "The kernel lacks mounted units, so mounted shock is represented with aggressive AI, extra reach, and shielded heavy troops.",
      },
      {
        historical: "Feigned retreats and rally cycles",
        simulated: "Single sustained assault with duration-focused validation",
        rationale: "There is no scripted retreat-and-rally phase, so the validation concentrates on uphill attrition rather than operational deception.",
      },
    ],
    references: [
      "M.K. Lawson (2002), The Battle of Hastings 1066.",
      "Stephen Morillo (1996), Warfare under the Anglo-Norman Kings.",
    ],
  },
  checks: [
    {
      label: "The uphill fight lasts a meaningful amount of time",
      evaluate: (result) => ({ pass: result.meanCombatDuration_s >= 13, observed: `${result.meanCombatDuration_s.toFixed(1)}s`, expected: ">= 13.0s" }),
    },
    {
      label: "Norman casualties stay limited in the compressed assault",
      evaluate: (result) => {
        const observed = meanTeamCasualtyRate(result, 1);
        return { pass: observed <= 0.03, observed: formatPct(observed), expected: "<= 3.0%" };
      },
    },
    {
      label: "Norman side still takes visible structural punishment uphill",
      evaluate: (result) => {
        const observed = meanTeamStructuralDamage(result, 1);
        return { pass: observed >= 0.05 && observed <= 0.11, observed: observed.toFixed(3), expected: "0.050-0.110" };
      },
    },
    {
      label: "Housecarls survive at least as well as the fyrd",
      evaluate: (result) => {
        const housecarlSurvival = 1 - meanGroupCasualtyRate(result, SAXON_HUSCARL_IDS);
        const fyrdSurvival = 1 - meanGroupCasualtyRate(result, FYRD_IDS);
        return { pass: housecarlSurvival >= fyrdSurvival, observed: `${formatPct(housecarlSurvival)} vs ${formatPct(fyrdSurvival)}`, expected: "housecarl survival >= fyrd survival" };
      },
    },
  ],
};
