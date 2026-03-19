/**
 * marathon.ts — Battle of Marathon, August/September 490 BC
 *
 * Historical context:
 *   The first Persian invasion of Greece. An Athenian force (with Plataean
 *   allies) under Miltiades defeated a Persian expeditionary force at the
 *   coastal plain of Marathon. Herodotus (VI.102–117) provides the primary
 *   ancient account; Nepos (Miltiades) and Plutarch add secondary detail.
 *
 *   Greek force: ~10,000 Athenian hoplites + ~1,000 Plataeans.
 *   Persian force: ancient sources and modern estimates range from 20,000 to
 *   90,000 infantry and cavalry; Hammond (1968) and Lazenby (1993) favour
 *   approximately 25,000 infantry. Persian cavalry was absent at the critical
 *   engagement (possibly re-embarking; Hdt. VI.102).
 *
 *   Greek formation tactic (Miltiades): standard phalanx depth (8 ranks)
 *   thinned at centre to match Persian front, reinforced on wings. The wings
 *   advanced at a run (~200 m "at the double" — the famous dromoi) to pass
 *   through the Persian arrow-beaten zone quickly, then enveloped the Persian
 *   centre after the wings routed.
 *
 *   Casualties: Herodotus records 6,400 Persian dead vs. 192 Athenians
 *   (VI.117). The 192 is confirmed by the soros burial mound excavated at
 *   Marathon. The 6,400 Persian figure is accepted as plausible by most
 *   modern scholarship (Lazenby 1993).
 *
 * References:
 *   Herodotus, Histories VI.102–117 (c. 430 BC).
 *   Hammond, N.G.L. (1968). "The Campaign and the Battle of Marathon."
 *     Journal of Hellenic Studies 88, 13–57.
 *   Lazenby, J.F. (1993). The Defence of Greece 490–479 BC. Aris & Phillips.
 *   Krentz, P. (2010). The Battle of Marathon. Yale University Press.
 */

import type { BattleScenario } from "../types.js";

export const MARATHON_SCENARIO: BattleScenario = {
  id:          "marathon-490bc",
  name:        "Battle of Marathon (490 BC)",
  year:        -490,
  location:    "Marathon plain, Attica, Greece",
  reference:   [
    "Herodotus, Histories VI.102–117",
    "Hammond (1968), The Campaign and the Battle of Marathon, JHS 88",
    "Lazenby (1993), The Defence of Greece 490–479 BC",
    "Krentz (2010), The Battle of Marathon. Yale University Press.",
  ],
  claimType: "plausibility",
  description:
    "Athenian and Plataean hoplites under Miltiades defeat a Persian " +
    "expeditionary force at the Marathon plain. Validates phalanx formation " +
    "cohesion mechanics (ananke formation.ts / formation-unit.ts), the tactical " +
    "advantage of double-envelopment on wings, and the protective value of " +
    "heavy Greek hoplite panoplia (bronze breastplate, greaves, aspis shield) " +
    "against Persian archery and lighter infantry.",

  historicalForces: {
    defenders: {
      label:       "Greek allied hoplites (Athens + Plataea)",
      count:       11_000,  // 10,000 Athenians + 1,000 Plataeans; Hdt. VI.103, 108
      notes:       "No Spartan support (Spartans delayed by religious observance of Carneia).",
    },
    attackers: {
      label:       "Persian expeditionary force",
      count:       25_000,  // Hammond (1968) and Lazenby (1993) consensus; ancient sources vary wildly
      notes:       "Persian cavalry absent at critical moment (possibly re-embarking). Main infantry: Saka archers, Median infantry, Persian immortals not at Marathon.",
    },
  },

  passCriteria: {
    /**
     * Herodotus records 192 Athenian dead (confirmed by soros mound).
     * Greek casualty rate: 192 / 11,000 ≈ 1.7%.
     * We set max: 0.05 — Greek casualties should not exceed 5% for plausibility.
     */
    defenderCasualtyRate: { max: 0.05 },

    /**
     * Herodotus records 6,400 Persian dead from ~25,000 engaged = 25.6%.
     * We set min: 0.15 as conservative plausibility threshold.
     * The wing-envelopment should convert Persian numerical advantage into
     * a rout with disproportionate casualties.
     */
    attackerCasualtyRate: { min: 0.15 },

    /**
     * The engagement lasted roughly half a day (Hdt. VI.113: "long time").
     * Greek formation cohesion is critical: the thinned centre held long
     * enough for the wings to rout and wheel inward. The scenario should
     * not resolve in a quick Greek collapse (< 200 ticks) as that would
     * falsify formation toughness.
     */
    durationTicks: { min: 200 },

    /**
     * Wing envelopment metric (Phase 2): after defender wings win their
     * respective flanks, attacker morale should collapse (high shock/fear
     * accumulation). Modelled via ananke formation-unit morale contagion
     * when adjacent units rout.
     */
    notes:
      "Phalanx mechanics: formation.ts formation cohesion bonus should give " +
      "Greek hoplites a frontage-adjusted combat multiplier vs. lighter Persian " +
      "infantry. The double-envelopment requires two separate wing units in the " +
      "arena scenario; validated by attacker team-level casualty asymmetry. " +
      "Persian cavalry absence modelled by omitting mounted units entirely.",
  },

  // TODO (Phase 2): implement runScenario(). Three Greek \"battalions\" (left wing,
  // centre, right wing); two Persian flank units + centre. Greek wings use
  // aggressive AI; centre uses hold/defensive AI until wings succeed.
};
