/**
 * types.ts — Shared types for ananke-historical-battles
 *
 * BattleScenario is the top-level descriptor for a historical engagement.
 * It is intentionally separate from ananke's ArenaScenario so that scenario
 * stubs can be defined and tested without requiring a runnable arena setup.
 *
 * Phase 2 will add a runScenario() method to each BattleScenario that wires
 * the pass criteria to actual ananke simulation outputs.
 */

/** Claim type mirrors ananke validation terminology. */
export type ClaimType = "plausibility" | "quantitative";

/** Historical force descriptor for documentation purposes. */
export interface HistoricalForce {
  /** Short label for the force (e.g. "Greek allied hoplites"). */
  label: string;
  /**
   * Best modern estimate of engaged strength.
   * Ancient/medieval sources are often unreliable; use modern scholarly consensus.
   */
  count: number;
  /** Free-text notes on source uncertainty, composition, etc. */
  notes?: string | undefined;
}

/**
 * Pass/fail criteria for a historical battle scenario.
 *
 * All fields are optional — a scenario need not claim all metrics.
 * Numeric range fields use `{ min?, max? }` patterns.
 * Ratio fields (0–1) represent fractions of the relevant force.
 */
export interface BattlePassCriteria {
  /**
   * Fraction of the defending force that should be casualties (dead/incapacitated).
   * `min`: at least this fraction are casualties.
   * `max`: at most this fraction are casualties.
   */
  defenderCasualtyRate?: { min?: number; max?: number } | undefined;

  /**
   * Fraction of the attacking force that should be casualties.
   */
  attackerCasualtyRate?: { min?: number; max?: number } | undefined;

  /**
   * Minimum number of simulation ticks the engagement must last.
   * Prevents trivial collapse scenarios from passing.
   */
  durationTicks?: { min?: number; max?: number } | undefined;

  /**
   * Mean fatigue_Q fraction [0–1] of attackers when melee is joined.
   * Validates fatigue-penalising terrain / equipment interactions.
   */
  attackerFatigueAtContact?: { min?: number; max?: number } | undefined;

  /**
   * Mean fatigue_Q fraction [0–1] of defenders at a specified engagement phase.
   */
  defenderFatigueAtFinalAssault?: { min?: number; max?: number } | undefined;

  /**
   * Ratio of disease-caused incapacitation to direct combat deaths.
   * > 1.0 means disease killed/incapacitated more than combat.
   */
  diseaseToDirectCombatCasualtyRatio?: { min?: number; max?: number } | undefined;

  /**
   * Fraction of defending force with active disease at siege end.
   */
  diseaseIncidenceRate?: { min?: number; max?: number } | undefined;

  /**
   * Fraction of initial defender count still combat-effective at end.
   */
  defenderEffectiveFractionAtSiegeEnd?: { min?: number; max?: number } | undefined;

  /** Free-text notes on methodology, caveats, deferred mechanics, etc. */
  notes?: string | undefined;
}

/** Top-level descriptor for a historical battle scenario. */
export interface BattleScenario {
  /** Unique machine-readable identifier (e.g. "thermopylae-480bc"). */
  id: string;

  /** Human-readable name. */
  name: string;

  /**
   * Year of the battle in proleptic Gregorian calendar.
   * Negative = BC (e.g. -480 for 480 BC).
   */
  year: number;

  /** Geographic location. */
  location: string;

  /**
   * Array of scholarly references used for force estimates and pass criteria.
   * Use author–date–title format for consistency.
   */
  reference: string[];

  /**
   * Claim type:
   *   "plausibility" — simulation outcome should be consistent with documented
   *                    range of historical outcomes; tolerates ±30% on numbers.
   *   "quantitative" — simulation must match specific empirical values within
   *                    a stated confidence interval (Phase 2+).
   */
  claimType: ClaimType;

  /** One-paragraph description of the scenario and what it validates. */
  description: string;

  /** Documented force sizes for reference and scenario setup. */
  historicalForces: {
    defenders: HistoricalForce;
    attackers: HistoricalForce;
  };

  /** Quantified pass/fail criteria derived from historical record. */
  passCriteria: BattlePassCriteria;
}

/** Outcome of running a battle scenario across multiple seeds. */
export interface BattleRunResult {
  scenarioId:    string;
  scenarioName:  string;
  seeds:         number;
  pass:          boolean;
  criteriaResults: Array<{
    criterion:   string;
    expected:    string;
    observed:    string | number;
    pass:        boolean;
  }>;
  notes?:        string | undefined;
}
