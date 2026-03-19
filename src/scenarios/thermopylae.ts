/**
 * thermopylae.ts — Battle of Thermopylae, 480 BC
 *
 * Historical context:
 *   Herodotus (Histories VII.200–233) and Diodorus Siculus (XI.4–11) record
 *   a Greek allied force holding the Hot Gates pass against the Persian
 *   expedition of Xerxes I. The defending force included 300 Spartiate citizens
 *   (hoplites), plus perioikoi and allied contingents (~7,000 total at peak;
 *   the final stand of ~1,500 is the immortalised episode). Modern estimates
 *   of the Persian force range from 70,000 to 300,000; conservative scholarship
 *   (Lazenby 1993, Cartledge 2006) favours 70,000–120,000 effective combatants.
 *
 *   Pass width at the "Middle Gate" choke point: approximately 14 m (Sekunda 2002).
 *   Greek formation depth: ~8 ranks of hoplites, each occupying ~0.9 m frontage.
 *   Effective fighting front: ~15 hoplites at any given moment.
 *
 * Validation claims:
 *   1. PLAUSIBILITY: All 300 Spartiates killed by engagement end (historically
 *      confirmed; only two survived with eye injuries and were later shunned).
 *   2. PLAUSIBILITY: Persian casualties disproportionately high relative to
 *      attacker mass. Modern estimates: 20,000+ Persian dead over three days.
 *      Against a defending force that held for ~3 days before encirclement,
 *      a casualty rate of ≥20% of committed infantry is plausible.
 *   3. PLAUSIBILITY: Engagement duration sustained (terrain prevents quick
 *      envelopment; attrition favours defenders per unit time until flanking).
 *
 * References:
 *   Herodotus, Histories VII.200–233 (c. 430 BC).
 *   Diodorus Siculus, Bibliotheca XI.4–11 (c. 60–30 BC).
 *   Lazenby, J.F. (1993). The Defence of Greece 490–479 BC. Aris & Phillips.
 *   Cartledge, P. (2006). Thermopylae: The Battle That Changed the World. Overlook Press.
 *   Sekunda, N. (2002). Marathon 490 BC. Osprey Publishing.
 */

import type { BattleScenario } from "../types.js";

export const THERMOPYLAE_SCENARIO: BattleScenario = {
  id:          "thermopylae-480bc",
  name:        "Battle of Thermopylae (480 BC)",
  year:        -480,
  location:    "Thermopylae pass, central Greece",
  reference:   [
    "Herodotus, Histories VII.200–233",
    "Diodorus Siculus, Bibliotheca XI.4–11",
    "Lazenby (1993), The Defence of Greece 490–479 BC",
    "Cartledge (2006), Thermopylae: The Battle That Changed the World",
  ],
  claimType: "plausibility",
  description:
    "300 Spartiates (Spartiate citizen hoplites) plus allied Greek contingents " +
    "hold the narrow pass at Thermopylae against the Persian expedition of Xerxes I " +
    "for three days. Validates: terrain choke-point mechanics limiting effective " +
    "frontage, morale effects of disciplined shock infantry (Spartan agoge training), " +
    "and eventual defeat by encirclement via the Anopaea mountain path.",

  historicalForces: {
    defenders: {
      label:       "Greek allied rearguard (final stand)",
      count:       1_500,   // 300 Spartiates + ~700 Thespians + ~400 Thebans; Hdt. VII.222
      notes:       "~7,000 Greeks at peak; 1,500 in the final stand after Ephialtes revealed the Anopaea path",
    },
    attackers: {
      label:       "Persian infantry",
      count:       80_000,  // Conservative modern estimate; Lazenby (1993) favours 70,000–120,000
      notes:       "Ancient sources give 1–2 million; modern scholarship estimates 70,000–300,000 effective; 80,000 used as median conservative figure",
    },
  },

  passCriteria: {
    /**
     * All 300 Spartiates historically died at Thermopylae.
     * The two survivors (Aristodemos and Pantites) had been sent away sick;
     * both were shunned on return. 100% casualty rate is confirmed.
     * max: 1.0 — allow any outcome up to total defender loss.
     * min: 0.80 — simulation should not produce a Spartan survival rate > 20%.
     */
    defenderCasualtyRate: { min: 0.80, max: 1.0 },

    /**
     * Persian casualties documented as severe. Herodotus records 20,000+ dead;
     * modern scholarship accepts significant losses even if exact figures are
     * contested. Against 15-man effective frontage for 3 days, ≥5% of 80,000
     * committed troops = 4,000+ casualties is a conservative lower bound.
     * We set min: 0.05 (conservative) as a plausibility threshold.
     */
    attackerCasualtyRate: { min: 0.05 },

    /**
     * Three-day siege (259,200 seconds); at TICK_HZ = 20, = ~5,184,000 ticks.
     * Even in a compressed simulation the engagement must sustain for a
     * meaningful duration — we require ≥500 ticks to confirm the choke-point
     * mechanic produces prolonged attrition rather than immediate collapse.
     */
    durationTicks: { min: 500 },

    /**
     * Terrain force-multiplier for defenders: the effective attacker throughput
     * is constrained by the ~14 m pass width. The ratio of effective combatants
     * to total attacker mass should be < 0.005 (15 / 80,000 ≈ 0.000188).
     * We express this as a qualitative claim: defenders survive longer than
     * their raw numerical disadvantage (300:80,000 = 0.00375) would predict
     * in open-field combat. The durationTicks criterion operationalises this.
     */
    notes:
      "Terrain choke-point validation: pass width ~14 m constrains effective " +
      "Persian frontage to approximately 15 combatants simultaneously. " +
      "Spartan training (agoge) modelled via high shockTolerance and distressTolerance. " +
      "Defeat by encirclement (Anopaea path) is out-of-scope for current arena kernel " +
      "and deferred to Phase 2 flanking mechanic.",
  },

  // TODO (Phase 2): implement runScenario() using createWorld, stepWorld, buildAICommands.
  // Terrain: narrow corridor grid (14 m wide); Persian AI: aggressive advance;
  // Spartan AI: hold formation, defensive formation bonus.
  // Seed range: 50 seeds; commit result report to scenarios/results/.
};
