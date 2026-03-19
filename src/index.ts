/**
 * @its-not-rocket-science/ananke-historical-battles
 *
 * Public API surface. Exports all four Phase 1 scenario stubs and shared types.
 */

export type { BattleScenario, BattlePassCriteria, BattleRunResult, ClaimType, HistoricalForce } from "./types.js";

import { THERMOPYLAE_SCENARIO }    from "./scenarios/thermopylae.js";
import { AGINCOURT_SCENARIO }      from "./scenarios/agincourt.js";
import { MARATHON_SCENARIO }       from "./scenarios/marathon.js";
import { CONSTANTINOPLE_SCENARIO } from "./scenarios/constantinople.js";

export {
  THERMOPYLAE_SCENARIO,
  AGINCOURT_SCENARIO,
  MARATHON_SCENARIO,
  CONSTANTINOPLE_SCENARIO,
};

/**
 * All Phase 1 scenarios in chronological order by year.
 * Import individual named exports for tree-shaking in host applications.
 */
export const ALL_SCENARIOS = [
  MARATHON_SCENARIO,       // -490
  THERMOPYLAE_SCENARIO,    // -480
  AGINCOURT_SCENARIO,      //  1415
  CONSTANTINOPLE_SCENARIO, //  1453
] as const;
