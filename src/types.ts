import type { ArenaResult, ArenaScenario } from "./ananke-internal.js";

export interface ScenarioScaleFactor {
  simulated: number;
  historical: number;
  ratio: number;
  notes?: string;
}

export interface ScenarioSubstitution {
  historical: string;
  simulated: string;
  rationale: string;
}

export interface ScenarioDocumentation {
  summary: string;
  scaleFactors: {
    attackers: ScenarioScaleFactor;
    defenders: ScenarioScaleFactor;
  };
  substitutions: ScenarioSubstitution[];
  references: string[];
}

export interface ValidationObservation {
  pass: boolean;
  observed: string;
  expected: string;
}

export interface ValidationCheck {
  label: string;
  evaluate: (result: ArenaResult) => ValidationObservation;
}

export interface DirectValidationScenario {
  id: string;
  scenario: ArenaScenario;
  seeds: number;
  documentation: ScenarioDocumentation;
  checks: ValidationCheck[];
}

export interface ValidationRunResult {
  id: string;
  name: string;
  seeds: number;
  pass: boolean;
  observations: Array<ValidationObservation & { label: string }>;
  documentation: ScenarioDocumentation;
}
