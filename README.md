# @its-not-rocket-science/ananke-historical-battles

Historical battle validation scenarios using the emergent simulation capabilities of
[@its-not-rocket-science/ananke](https://github.com/its-not-rocket-science/ananke).

Each scenario defines pass/fail criteria grounded in documented historical outcomes.
Phase 1 provides scenario stubs with structural validation. Phase 2 will add full
simulation runs across 50 seeds and commit result reports.

---

## Install and run

```
npm install
npm run build
npm run run:battles
```

Or run the test suite:

```
npm test
```

---

## Scenarios included

### 1. Battle of Thermopylae (480 BC)

**Reference:** Herodotus, Histories VII.200–233; Lazenby (1993), The Defence of Greece.

300 Spartiates (plus ~1,200 allied Greeks) hold the 14 m-wide Hot Gates pass against
a Persian expedition of ~80,000+ under Xerxes I for three days.

**Validates:**
- Terrain choke-point mechanics (14 m pass width limits effective Persian frontage to ~15 combatants)
- Morale effects of disciplined shock infantry (Spartan agoge training → high shockTolerance)
- All-defender-killed outcome: 100% Spartiate casualty rate is historically confirmed

**Pass criteria (plausibility):**
- Defender casualty rate ≥ 80% (historically 100%)
- Attacker casualty rate ≥ 5% (Herodotus: 20,000+ Persian dead)
- Duration ≥ 500 ticks (sustained engagement before encirclement)

---

### 2. Battle of Agincourt (25 October 1415)

**Reference:** Curry (2000), The Battle of Agincourt; Rogers (2008), The Hundred Years War.

~8,500 English troops (6,000–7,000 longbowmen + ~1,500 men-at-arms) under Henry V defeat
~12,000 dismounted French men-at-arms on a muddy field at Tramecourt.

**Validates:**
- Ranged superiority of the English warbow (~180 N draw weight) against armoured targets
- Fatigue-armour interaction: 30–45 kg plate armour in churned mud produces severe fatigue
  accumulation before melee is joined (modelled via hazard zone fatigueInc)
- Asymmetric casualty ratios: ~6,000–10,000 French dead vs. ~100–400 English

**Pass criteria (plausibility):**
- Defender (English) casualty rate ≤ 10%
- Attacker (French) casualty rate ≥ 40%
- Mean attacker fatigue at contact ≥ 0.30
- Duration ≥ 200 ticks

---

### 3. Battle of Marathon (490 BC)

**Reference:** Herodotus, Histories VI.102–117; Krentz (2010), The Battle of Marathon.

~11,000 Greek hoplites (Athenians + Plataeans) under Miltiades defeat ~25,000 Persian
infantry on the Marathon coastal plain using double-envelopment wing tactics.

**Validates:**
- Phalanx formation cohesion mechanics (ananke `formation.ts` / `formation-unit.ts`)
- Double-envelopment: reinforced wings rout Persian flanks, then wheel into the centre
- Heavy hoplite panoplia effectiveness against Persian archers and lighter infantry
- Historically documented 33:1 kill ratio (6,400 Persian vs. 192 Athenian dead per Herodotus VI.117)

**Pass criteria (plausibility):**
- Defender (Greek) casualty rate ≤ 5% (historically ~1.7%)
- Attacker (Persian) casualty rate ≥ 15% (Herodotus: 6,400 dead from ~25,000 = 25.6%)
- Duration ≥ 200 ticks

---

### 4. Siege of Constantinople (6 April – 29 May 1453)

**Reference:** Runciman (1965), The Fall of Constantinople 1453; Barbaro (trans. Jones 1969), Diary of the Siege.

53-day Ottoman siege of Constantinople. ~7,000 defenders under Giovanni Giustiniani
hold 14 km of walls against ~80,000 Ottoman troops and 70 artillery pieces.

**Validates:**
- Disease attrition exceeds direct combat attrition over a prolonged siege
  (extends ananke [emergent-validation-report](https://github.com/its-not-rocket-science/ananke/blob/master/docs/emergent-validation-report.md) S4)
- Dysentery (waterborne, no immunity) + wound_fever compound with starvation fatigue
- Garrison effective strength falls to < 40% of initial by final assault day

**Pass criteria (plausibility):**
- Disease-to-combat casualty ratio ≥ 1.0 (disease kills more than direct combat)
- Defender effective fraction at siege end ≤ 40%
- Disease incidence rate ≥ 20% of garrison
- Mean defender fatigue_Q ≥ 0.60 at final Ottoman assault
- Duration ≥ 1,000 ticks (53-day campaign)

---

## Pass criteria explanation

All Phase 1 scenarios use `claimType: "plausibility"`. This means:

- The simulation is not expected to reproduce exact historical numbers.
- The outcome must fall within the documented *range* of historical scholarship.
- Tolerance is ±30% on any single numeric criterion unless explicitly noted.

Phase 2 will introduce `claimType: "quantitative"` scenarios with tighter confidence
intervals derived from 50-seed baseline runs.

---

## Links

- ananke engine: https://github.com/its-not-rocket-science/ananke
- ananke npm: https://www.npmjs.com/package/@its-not-rocket-science/ananke
- Emergent validation report: https://github.com/its-not-rocket-science/ananke/blob/master/docs/emergent-validation-report.md
- Issue tracker: https://github.com/its-not-rocket-science/ananke-historical-battles/issues
