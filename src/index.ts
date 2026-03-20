import type { ArenaScenario } from "./ananke-internal.js";

export type { DirectValidationScenario, ScenarioDocumentation, ScenarioScaleFactor, ScenarioSubstitution, ValidationCheck, ValidationObservation, ValidationRunResult } from "./types.js";

export { AGINCOURT_SCENARIO, AGINCOURT_VALIDATION } from "./scenarios/agincourt.js";
export { THERMOPYLAE_SCENARIO, THERMOPYLAE_VALIDATION } from "./scenarios/thermopylae.js";
export { CRECY_SCENARIO, CRECY_VALIDATION } from "./scenarios/crecy.js";
export { HASTINGS_SCENARIO, HASTINGS_VALIDATION } from "./scenarios/hastings.js";
export { CANNAE_SCENARIO, CANNAE_VALIDATION } from "./scenarios/cannae.js";

import { AGINCOURT_VALIDATION } from "./scenarios/agincourt.js";
import { CANNAE_VALIDATION } from "./scenarios/cannae.js";
import { CRECY_VALIDATION } from "./scenarios/crecy.js";
import { HASTINGS_VALIDATION } from "./scenarios/hastings.js";
import { THERMOPYLAE_VALIDATION } from "./scenarios/thermopylae.js";

export const ALL_VALIDATIONS = [
  THERMOPYLAE_VALIDATION,
  AGINCOURT_VALIDATION,
  CRECY_VALIDATION,
  HASTINGS_VALIDATION,
  CANNAE_VALIDATION,
] as const;

export const ALL_SCENARIOS: ArenaScenario[] = ALL_VALIDATIONS.map((validation) => validation.scenario);
