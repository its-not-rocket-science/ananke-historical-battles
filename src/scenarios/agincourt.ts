/**
 * agincourt.ts — Battle of Agincourt, 25 October 1415
 *
 * Historical context:
 *   An English army under Henry V defeated a larger French force in northern
 *   France during the Hundred Years' War. The English deployed approximately
 *   1,500 men-at-arms and 6,000–7,000 longbowmen. The French force is
 *   estimated at 12,000–36,000 (Rogers 2008 favours ~12,000 fighting men);
 *   the traditional figure of 25,000+ is now considered an overestimate.
 *
 *   Terrain: a freshly-ploughed muddy field between two woods at Tramecourt
 *   and Agincourt, width ~900 m funnelling to ~700 m. Thick mud from heavy
 *   overnight rain (24–25 October) severely hampered the French dismounted
 *   advance in heavy plate armour (30–45 kg per man-at-arms).
 *
 *   French casualties: approximately 6,000–10,000 dead, including three dukes,
 *   five counts, and 90+ lords. English casualties: disputed; most modern
 *   accounts give ~100–400 (Curry 2000, Barker 2005).
 *
 *   This scenario validates:
 *   1. Ranged weapon superiority (longbow, ~180 N draw, ~60 J per arrow) against
 *      armoured infantry at 50–100 m range under restrictive terrain.
 *   2. Armour-fatigue interaction: 30–45 kg plate in mud produces severe fatigue
 *      accumulation, degrading combat effectiveness on arrival at melee range.
 *   3. Asymmetric casualty ratios (≥10:1 French:English killed).
 *
 * References:
 *   Curry, A. (2000). The Battle of Agincourt: Sources and Interpretations. Boydell Press.
 *   Barker, J. (2005). Agincourt: Henry V and the Battle That Made England. Little, Brown.
 *   Rogers, C.J. (2008). "The Battle of Agincourt." In The Hundred Years War (Part II),
 *     ed. L.J. Andrew Villalon & D. Kagay. Brill.
 *   Stirland, A.J. (2000). Raising the Dead: The Skeleton Crew of King Henry V's Great Ship.
 *     Wiley. [longbow musculoskeletal analysis]
 *   Hardy, R. (1976). Longbow: A Social and Military History. Patrick Stephens.
 */

import type { BattleScenario } from "../types.js";

export const AGINCOURT_SCENARIO: BattleScenario = {
  id:          "agincourt-1415",
  name:        "Battle of Agincourt (25 October 1415)",
  year:        1415,
  location:    "Agincourt / Tramecourt, Artois, northern France",
  reference:   [
    "Curry (2000), The Battle of Agincourt: Sources and Interpretations",
    "Barker (2005), Agincourt: Henry V and the Battle That Made England",
    "Rogers (2008), The Battle of Agincourt, in The Hundred Years War (Part II)",
    "Hardy (1976), Longbow: A Social and Military History",
  ],
  claimType: "plausibility",
  description:
    "English longbowmen and dismounted men-at-arms defeat a larger French force " +
    "of dismounted knights and men-at-arms on a muddy field. Validates ranged " +
    "superiority of the English warbow (~180 N draw weight, 60 J per arrow) " +
    "against armoured targets at 50–100 m, and the catastrophic fatigue penalty " +
    "of advancing 200+ m in 30–45 kg plate armour through churned mud.",

  historicalForces: {
    defenders: {
      label:       "English army (Henry V)",
      count:       8_500,   // ~1,500 men-at-arms + ~7,000 longbowmen; Curry (2000)
      notes:       "Range: 7,000–9,000. English deployed in three \"battles\" with archer wings staked with sharpened poles against cavalry.",
    },
    attackers: {
      label:       "French army (Constable d'Albret / Boucicaut)",
      count:       12_000,  // Rogers (2008) revised estimate; traditional figures range to 36,000
      notes:       "Modern scholarship (Rogers 2008) favours ~12,000 fighting men. Dismounted men-at-arms in front rank; cavalry on flanks.",
    },
  },

  passCriteria: {
    /**
     * English casualties: ~100–400 dead (Curry 2000; includes the disputed
     * slaughter of prisoners). English casualty rate: ~1–5% of ~8,500.
     * max: 0.10 — English losses should not exceed 10% for the scenario to
     * be plausible. The historical result is ~2–5%.
     */
    defenderCasualtyRate: { max: 0.10 },

    /**
     * French casualties: 6,000–10,000 dead from ~12,000 engaged.
     * Casualty rate: 50–83%. We set min: 0.40 as a conservative threshold.
     * The ranged fire + mud fatigue combination should produce heavy French
     * losses before melee is joined.
     */
    attackerCasualtyRate: { min: 0.40 },

    /**
     * French men-at-arms arriving at English lines should have fatigue_Q
     * significantly elevated by the ~200 m advance in mud with 30–45 kg armour.
     * We require that mean attacker fatigue at melee engagement ≥ 0.30 (i.e.
     * ≥30% fatigue fraction at contact). This is expressed as a qualitative
     * note; operationalisation deferred to Phase 2 fatigue extraction.
     */
    attackerFatigueAtContact: { min: 0.30 },

    /**
     * Longbow arrows at 50 m range should achieve ≥10% surfaceDamage per
     * hit on armoured target, validating the ranged damage channel against
     * CALIBRATION_PLATE_ARMOUR baseline. Operationalised in Phase 2.
     */
    durationTicks: { min: 200 },

    notes:
      "Key mechanic: mud terrain should multiply fatigue accumulation for " +
      "the advancing French force (analogous to extreme_cold hazard zone's " +
      "fatigueInc rate). Longbow range modelled via RANGED archetype with " +
      "peakForce_N ~= 180 N draw. Plate armour modelled via CALIBRATION_PLATE_ARMOUR " +
      "archetype. Prisoner slaughter episode (halftime) is out of scope for Phase 1.",
  },

  // TODO (Phase 2): implement runScenario(). Terrain: muddy field (elevated
  // fatigue hazard zone); English AI: hold position, range attack; French AI:
  // advance formation. Validate longbow ranged hits against armour surface damage.
};
