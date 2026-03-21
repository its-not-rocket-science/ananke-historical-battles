import { HUMAN_BASE, KNIGHT_INFANTRY, q, to } from "@its-not-rocket-science/ananke";
import type { Archetype } from "@its-not-rocket-science/ananke";

function tweak(base: Archetype, patch: Partial<Archetype>): Archetype {
  return { ...base, ...patch };
}

export const ENGLISH_LONGBOWMAN = tweak(HUMAN_BASE, {
  peakForce_N: to.N(1900),
  peakPower_W: to.W(1250),
  controlQuality: q(0.67),
  fineControl: q(0.7),
  shockTolerance: q(0.58),
  fatigueRate: q(0.94),
  recoveryRate: q(1.08),
});

export const FRENCH_MAN_AT_ARMS = tweak(KNIGHT_INFANTRY, {
  mass_kg: to.kg(82),
  peakForce_N: to.N(1750),
  controlQuality: q(0.63),
  stability: q(0.68),
  fatigueRate: q(1.08),
});

export const ENGLISH_MAN_AT_ARMS = tweak(KNIGHT_INFANTRY, {
  peakForce_N: to.N(1800),
  controlQuality: q(0.66),
  stability: q(0.69),
  fatigueRate: q(1.0),
});

export const GENOESE_CROSSBOWMAN = tweak(HUMAN_BASE, {
  peakForce_N: to.N(1500),
  controlQuality: q(0.58),
  fineControl: q(0.68),
  fatigueRate: q(1.02),
});

export const AGINCOURT_ENGLISH_ARCHER = tweak(ENGLISH_LONGBOWMAN, {
  peakForce_N: to.N(1950),
  peakPower_W: to.W(1280),
  controlQuality: q(0.69),
  fineControl: q(0.73),
  stability: q(0.63),
  fatigueRate: q(0.89),
  recoveryRate: q(1.12),
});

export const AGINCOURT_ENGLISH_MAN_AT_ARMS = tweak(ENGLISH_MAN_AT_ARMS, {
  mass_kg: to.kg(80),
  peakForce_N: to.N(1820),
  controlQuality: q(0.68),
  stability: q(0.72),
  shockTolerance: q(0.68),
  fatigueRate: q(0.96),
});

export const AGINCOURT_FRENCH_VANGUARD = tweak(FRENCH_MAN_AT_ARMS, {
  mass_kg: to.kg(84),
  peakForce_N: to.N(1780),
  controlQuality: q(0.62),
  stability: q(0.66),
  shockTolerance: q(0.56),
  fatigueRate: q(1.16),
  recoveryRate: q(0.93),
});

export const AGINCOURT_FRENCH_REARGUARD = tweak(FRENCH_MAN_AT_ARMS, {
  mass_kg: to.kg(83),
  peakForce_N: to.N(1730),
  controlQuality: q(0.61),
  stability: q(0.64),
  shockTolerance: q(0.54),
  fatigueRate: q(1.12),
  recoveryRate: q(0.95),
});

export const SPARTAN_HOPLITE = tweak(KNIGHT_INFANTRY, {
  peakForce_N: to.N(1850),
  controlQuality: q(0.7),
  stability: q(0.76),
  distressTolerance: q(0.82),
  shockTolerance: q(0.8),
  fatigueRate: q(0.88),
  recoveryRate: q(1.05),
});

export const GREEK_ALLY_HOPLITE = tweak(HUMAN_BASE, {
  peakForce_N: to.N(1650),
  controlQuality: q(0.61),
  stability: q(0.67),
  distressTolerance: q(0.68),
  fatigueRate: q(0.94),
});

export const PERSIAN_INFANTRY = tweak(HUMAN_BASE, {
  peakForce_N: to.N(1500),
  controlQuality: q(0.55),
  stability: q(0.54),
  fatigueRate: q(1.03),
});

export const PERSIAN_ARCHER = tweak(HUMAN_BASE, {
  peakForce_N: to.N(1450),
  controlQuality: q(0.57),
  fineControl: q(0.63),
  fatigueRate: q(0.99),
});

export const NORMAN_KNIGHT = tweak(KNIGHT_INFANTRY, {
  peakForce_N: to.N(1850),
  controlQuality: q(0.65),
  stability: q(0.68),
  fatigueRate: q(0.98),
});

export const NORMAN_INFANTRY = tweak(HUMAN_BASE, {
  peakForce_N: to.N(1625),
  controlQuality: q(0.58),
  stability: q(0.59),
});

export const NORMAN_ARCHER = tweak(HUMAN_BASE, {
  peakForce_N: to.N(1550),
  controlQuality: q(0.61),
  fineControl: q(0.64),
});

export const SAXON_HUSCARL = tweak(KNIGHT_INFANTRY, {
  peakForce_N: to.N(1825),
  controlQuality: q(0.66),
  stability: q(0.74),
  shockTolerance: q(0.73),
  fatigueRate: q(0.94),
});

export const SAXON_FYRD = tweak(HUMAN_BASE, {
  peakForce_N: to.N(1500),
  controlQuality: q(0.53),
  stability: q(0.57),
  distressTolerance: q(0.5),
});

export const ROMAN_LEGIONARY = tweak(KNIGHT_INFANTRY, {
  peakForce_N: to.N(1760),
  controlQuality: q(0.69),
  stability: q(0.72),
  fatigueRate: q(0.93),
});

export const ROMAN_ALLIED_INFANTRY = tweak(HUMAN_BASE, {
  peakForce_N: to.N(1600),
  controlQuality: q(0.58),
  stability: q(0.61),
});

export const LIBYAN_INFANTRY = tweak(KNIGHT_INFANTRY, {
  peakForce_N: to.N(1720),
  controlQuality: q(0.65),
  stability: q(0.7),
  fatigueRate: q(0.94),
});

export const IBERIAN_INFANTRY = tweak(HUMAN_BASE, {
  peakForce_N: to.N(1680),
  controlQuality: q(0.62),
  stability: q(0.6),
  shockTolerance: q(0.62),
});

export const NUMIDIAN_SKIRMISHER = tweak(HUMAN_BASE, {
  peakForce_N: to.N(1450),
  controlQuality: q(0.59),
  fineControl: q(0.66),
  fatigueRate: q(0.86),
  recoveryRate: q(1.12),
});
