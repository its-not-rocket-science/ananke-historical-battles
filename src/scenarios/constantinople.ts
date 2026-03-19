/**
 * constantinople.ts — Siege of Constantinople, April–May 1453
 *
 * Historical context:
 *   The Ottoman siege of Constantinople under Sultan Mehmed II ended the
 *   Byzantine Empire. The siege lasted 53 days (6 April – 29 May 1453).
 *
 *   Defending force: ~7,000 defenders (Nicol 1993) — approximately 5,000
 *   Byzantine troops and 2,000 Genoese/Venetian mercenaries under Giovanni
 *   Giustiniani Longo — holding 14 km of land and sea walls.
 *
 *   Attacking force: ~80,000 Ottoman troops (Runciman 1965; modern estimates
 *   range 50,000–150,000); ~70 artillery pieces including the great bronze
 *   bombard cast by Urban of Hungary (~60 cm calibre, ~540 kg stone shot).
 *
 *   Disease and attrition context:
 *   The siege was a classic attritional campaign with multiple vectors:
 *   (a) Direct combat casualties from daily assaults.
 *   (b) Dysentery and other waterborne diseases endemic in a besieged city
 *       with compromised sanitation (Tursun Beg; Doukas).
 *   (c) Starvation / supply depletion — the final grain reserve of the city
 *       was exhausted by late April 1453 (Barbaro, Diary of the Siege).
 *   (d) Fatigue accumulation: the garrison was on continuous wall duty
 *       with no rotation, for 53 days.
 *
 *   This scenario extends the ananke emergent-validation S4 disease scenario
 *   ("disease > combat attrition in prolonged siege") and validates that
 *   cumulative disease + starvation fatigue causes effective combat strength
 *   degradation exceeding direct combat losses over the siege duration.
 *
 * References:
 *   Runciman, S. (1965). The Fall of Constantinople 1453. Cambridge University Press.
 *   Nicol, D.M. (1993). The Last Centuries of Byzantium, 1261–1453. Cambridge UP.
 *   Barbaro, N. (1453/trans. Jones 1969). Diary of the Siege of Constantinople. Exposition Press.
 *   Doukas (c.1462). Historia Turco-Byzantina. [primary Byzantine chronicle]
 *   Tursun Beg (c.1490). Tarih-i Ebu'l-Feth. [Ottoman primary source]
 *   DeVries, K. (1992). Medieval Military Technology. Broadview Press.
 *   Haldon, J. (2015). "Constantinople and Its Hinterland: Networks, Resources,
 *     and the Ottoman Conquest." In Trade and Markets in Byzantium, ed. C. Morrisson.
 */

import type { BattleScenario } from "../types.js";

export const CONSTANTINOPLE_SCENARIO: BattleScenario = {
  id:          "constantinople-1453",
  name:        "Siege of Constantinople (6 April – 29 May 1453)",
  year:        1453,
  location:    "Constantinople (modern Istanbul), Byzantine Empire",
  reference:   [
    "Runciman (1965), The Fall of Constantinople 1453",
    "Nicol (1993), The Last Centuries of Byzantium",
    "Barbaro (trans. Jones 1969), Diary of the Siege of Constantinople",
    "Doukas (c.1462), Historia Turco-Byzantina",
    "Tursun Beg (c.1490), Tarih-i Ebu'l-Feth",
  ],
  claimType: "plausibility",
  description:
    "53-day Ottoman siege of Constantinople. Validates that cumulative disease " +
    "(dysentery, wound sepsis) and starvation-fatigue attrition of the ~7,000 " +
    "defenders exceed direct combat casualties over the siege duration, consistent " +
    "with the documented collapse of effective garrison strength from ~7,000 to " +
    "an effective fighting capacity of ~2,000–3,000 by the final assault. " +
    "Extends ananke emergent-validation S4 (disease > combat attrition in siege).",

  historicalForces: {
    defenders: {
      label:       "Byzantine + Genoese/Venetian garrison",
      count:       7_000,   // Nicol (1993); Runciman estimates 6,000–7,000
      notes:       "~5,000 Byzantine regulars + ~2,000 Genoese/Venetian mercenaries. 14 km of walls to defend; extreme undermanning. Giustiniani Longo commanded the Land Walls.",
    },
    attackers: {
      label:       "Ottoman army (Mehmed II)",
      count:       80_000,  // Runciman (1965); modern range 50,000–150,000
      notes:       "70 artillery pieces; great bombard (Urban cannon) ~60 cm calibre. Naval blockade closed Bosphorus supply. Ottoman janissary corps provided elite infantry for final assault.",
    },
  },

  passCriteria: {
    /**
     * Direct combat killed: Byzantine chronicles record approximately 2,000
     * defenders killed in battle. Disease and starvation are estimated to have
     * reduced effective garrison capacity by a further 1,500–2,000 over 53 days.
     * Defender attrition to disease/starvation should exceed direct combat
     * killed: disease_killed / combat_killed ≥ 1.0 (i.e. at least equal).
     * We set min: 1.0 for the ratio.
     */
    diseaseToDirectCombatCasualtyRatio: { min: 1.0 },

    /**
     * Garrison effective strength at end of siege should be < 40% of initial.
     * Historical: ~7,000 initial → ~2,000–3,000 effective by final assault
     *             = 29–43% remaining (Runciman 1965 narrative).
     * We set max: 0.40 for surviving effective fraction.
     */
    defenderEffectiveFractionAtSiegeEnd: { max: 0.40 },

    /**
     * Dysentery (waterborne disease) should show ≥ 20% incidence in the
     * garrison over 53 days, consistent with documented disease burden in
     * besieged medieval cities (Nicol 1993; Keegan 1993, A History of Warfare).
     */
    diseaseIncidenceRate: { min: 0.20 },

    /**
     * Mean defender fatigue_Q at final assault should be ≥ 0.60, reflecting
     * 53 days of continuous wall duty with no rotation and food depletion.
     * Modelled via ananke sleep.ts sleepDebt_s accumulation and disease
     * fatigueInc from stepDiseaseForEntity().
     */
    defenderFatigueAtFinalAssault: { min: 0.60 },

    /**
     * The siege must last ≥ 45 simulated days (≥ 3,888,000 ticks at TICK_HZ=1
     * in downtime mode) before wall breach, to reflect the historical 53-day
     * duration. In compressed campaign-mode simulation, ≥ 1,000 ticks.
     */
    durationTicks: { min: 1_000 },

    notes:
      "This scenario operates in campaign / downtime mode (ananke downtime.ts / " +
      "disease.ts / sleep.ts / wound-aging.ts), not pure arena combat. " +
      "Disease modelled via dysentery DiseaseProfile (waterborne, no immunity) " +
      "and wound_fever (contact, 5% mortality) applied to combat casualties. " +
      "Starvation modelled via reserveEnergy_J depletion without replenishment. " +
      "Sleep debt accumulation from 53-day continuous duty. " +
      "Extends emergent-validation-report S4 with quantitative siege attrition data.",
  },

  // TODO (Phase 2): implement runScenario() using stepWorld + stepDowntime +
  // stepDiseaseForEntity + stepWoundAging in a campaign loop.
  // 53-day simulation at 1 tick/second campaign time.
  // Apply dysentery exposure daily via spreadDisease(); wound_fever on
  // combat injury; starvation via reserveEnergy_J depletion.
  // Track direct_killed vs disease_killed vs starvation_incapacitated.
};
