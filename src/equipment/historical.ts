import { q, to, STARTER_ARMOUR, STARTER_RANGED_WEAPONS, STARTER_SHIELDS } from "@its-not-rocket-science/ananke";
import type { Armour, Loadout, RangedWeapon, Shield, Weapon } from "@its-not-rocket-science/ananke";
import { CLASSICAL_MELEE, CLASSICAL_RANGED, MEDIEVAL_MELEE } from "../ananke-internal.js";

function requireItem<T extends { id: string }>(items: readonly T[], id: string): T {
  const found = items.find((item) => item.id === id);
  if (!found) {
    throw new Error(`Missing item ${id}`);
  }
  return found;
}

function cloneWeapon(base: Weapon, patch: Partial<Weapon>): Weapon {
  return { ...base, ...patch };
}

function cloneRanged(base: RangedWeapon, patch: Partial<RangedWeapon>): RangedWeapon {
  return { ...base, ...patch };
}

function cloneArmour(base: Armour, patch: Partial<Armour>): Armour {
  return { ...base, ...patch };
}

function cloneShield(base: Shield, patch: Partial<Shield>): Shield {
  return { ...base, ...patch };
}

const PLATE = requireItem(STARTER_ARMOUR, "arm_plate");
const MAIL = requireItem(STARTER_ARMOUR, "arm_mail");
const LEATHER = requireItem(STARTER_ARMOUR, "arm_leather");
const SMALL_SHIELD = requireItem(STARTER_SHIELDS, "shd_small");

const WARBOW = requireItem(CLASSICAL_RANGED, "rng_warbow");
const COMPOSITE_BOW = requireItem(CLASSICAL_RANGED, "rng_composite_bow");
const CROSSBOW = requireItem(STARTER_RANGED_WEAPONS, "rng_crossbow");
const DORY = requireItem(CLASSICAL_MELEE, "wpn_dory");
const XIPHOS = requireItem(CLASSICAL_MELEE, "wpn_xiphos");
const GLADIUS = requireItem(CLASSICAL_MELEE, "wpn_gladius");
const PILUM = requireItem(CLASSICAL_MELEE, "wpn_pilum");
const ARBALD = requireItem(MEDIEVAL_MELEE, "wpn_halberd");
const ARMING_SWORD = requireItem(MEDIEVAL_MELEE, "wpn_arming_sword");
const DANE_AXE = requireItem(MEDIEVAL_MELEE, "wpn_dane_axe");
const MACE = requireItem(MEDIEVAL_MELEE, "wpn_flanged_mace");

export const ENGLISH_WARBOW = cloneRanged(WARBOW, {
  id: "rng_english_warbow",
  name: "English warbow",
  launchEnergy_J: to.J(220),
  recycleTime_s: to.s(1.8),
  suppressionFearMul: q(1.8),
  damage: {
    surfaceFrac: q(0.18),
    internalFrac: q(0.68),
    structuralFrac: q(0.14),
    bleedFactor: q(0.95),
    penetrationBias: q(0.82),
  },
});

export const GENOESE_CROSSBOW = cloneRanged(CROSSBOW, {
  id: "rng_genoese_crossbow",
  name: "Genoese pavise crossbow",
  recycleTime_s: to.s(5.8),
  suppressionFearMul: q(1.1),
});

export const PERSIAN_COMPOSITE_BOW = cloneRanged(COMPOSITE_BOW, {
  id: "rng_persian_composite_bow",
  name: "Persian composite bow",
  recycleTime_s: to.s(2.1),
  dispersionQ: q(1.15),
});

export const LONG_SPEAR = cloneWeapon(DORY, {
  id: "wpn_long_spear",
  name: "Long spear",
  readyTime_s: to.s(0.4),
  damage: {
    surfaceFrac: q(0.16),
    internalFrac: q(0.7),
    structuralFrac: q(0.14),
    bleedFactor: q(0.72),
    penetrationBias: q(0.7),
  },
});

export const FRENCH_POLEAXE = cloneWeapon(ARBALD, {
  id: "wpn_french_poleaxe",
  name: "French poleaxe",
  readyTime_s: to.s(0.55),
});

export const NORMAN_LANCE_SUBSTITUTE = cloneWeapon(ARMING_SWORD, {
  id: "wpn_norman_lance_substitute",
  name: "Norman lance substitute",
  reach_m: to.m(1.6),
  strikeSpeedMul: q(1.1),
});

export const HUSCARL_AXE = cloneWeapon(DANE_AXE, {
  id: "wpn_huscarl_axe",
  name: "Housecarl dane axe",
  readyTime_s: to.s(0.6),
});

export const SPATHA = cloneWeapon(requireItem(CLASSICAL_MELEE, "wpn_spatha"), {
  id: "wpn_libyan_spatha",
  name: "Libyan spatha",
});

export const CARTHAGINIAN_SPEAR = cloneWeapon(DORY, {
  id: "wpn_carthaginian_spear",
  name: "Carthaginian spear",
  readyTime_s: to.s(0.48),
});

export const ROMAN_PILUM_SIDEARM = cloneRanged(requireItem(CLASSICAL_RANGED, "rng_pilum_throw"), {
  id: "rng_roman_pilum",
  name: "Roman pilum",
  recycleTime_s: to.s(6),
  shotInterval_s: to.s(6),
  magCapacity: 1,
});

export const KNIGHTLY_PLATE = cloneArmour(PLATE, {
  id: "arm_knightly_plate",
  name: "Knightly plate harness",
  fatigueMul: q(1.32),
});

export const MUD_SOAKED_PLATE = cloneArmour(KNIGHTLY_PLATE, {
  id: "arm_mud_soaked_plate",
  name: "Mud-soaked plate harness",
  resist_J: to.J(340),
  protectedDamageMul: q(0.78),
  mobilityMul: q(0.68),
  fatigueMul: q(1.5),
});

export const MAIL_HAUBERK = cloneArmour(MAIL, {
  id: "arm_mail_hauberk",
  name: "Mail hauberk",
  fatigueMul: q(1.12),
});

export const HOPLITE_PANOPLY = cloneArmour(MAIL, {
  id: "arm_hoplite_panoply",
  name: "Bronze hoplite panoply",
  resist_J: to.J(420),
  protectedDamageMul: q(0.7),
  mobilityMul: q(0.9),
});

export const LINOTHORAX = cloneArmour(LEATHER, {
  id: "arm_linothorax",
  name: "Linothorax substitute",
  resist_J: to.J(210),
  protectedDamageMul: q(0.88),
  mobilityMul: q(0.96),
});

export const LARGE_ASPIS = cloneShield(SMALL_SHIELD, {
  id: "shd_large_aspis",
  name: "Aspis shield",
  coverageQ: q(0.82),
  blockResist_J: 220,
  arcDeg: 120,
  mobilityMul: q(0.94),
});

export const KITE_SHIELD = cloneShield(SMALL_SHIELD, {
  id: "shd_kite",
  name: "Kite shield",
  coverageQ: q(0.76),
  blockResist_J: 180,
  arcDeg: 105,
});

export const ROMAN_SCUTUM = cloneShield(SMALL_SHIELD, {
  id: "shd_scutum",
  name: "Scutum substitute",
  coverageQ: q(0.8),
  blockResist_J: 200,
  arcDeg: 115,
  mobilityMul: q(0.95),
});

export const FALCATA = cloneWeapon(MACE, {
  id: "wpn_falcata_substitute",
  name: "Iberian falcata substitute",
  damage: {
    surfaceFrac: q(0.52),
    internalFrac: q(0.32),
    structuralFrac: q(0.16),
    bleedFactor: q(0.78),
    penetrationBias: q(0.12),
  },
});

export const NUMIDIAN_JAVELIN = cloneRanged(requireItem(CLASSICAL_RANGED, "rng_javelin_light"), {
  id: "rng_numidian_javelin",
  name: "Numidian light javelin",
  recycleTime_s: to.s(3.2),
  shotInterval_s: to.s(3.2),
  magCapacity: 2,
});

export const ENGLISH_LONGBOW_KIT = (sidearm: Weapon = ARMING_SWORD): Loadout => ({
  items: [ENGLISH_WARBOW, sidearm, LEATHER],
});

export const FRENCH_MAN_AT_ARMS_KIT: Loadout = {
  items: [FRENCH_POLEAXE, MUD_SOAKED_PLATE],
};

export const ENGLISH_MAN_AT_ARMS_KIT: Loadout = {
  items: [ARMING_SWORD, KNIGHTLY_PLATE],
};

export const GENOESE_CROSSBOW_KIT: Loadout = {
  items: [GENOESE_CROSSBOW, ARMING_SWORD, LEATHER],
};

export const SPARTAN_HOPLITE_KIT: Loadout = {
  items: [LONG_SPEAR, XIPHOS, HOPLITE_PANOPLY, LARGE_ASPIS],
};

export const GREEK_ALLY_HOPLITE_KIT: Loadout = {
  items: [LONG_SPEAR, XIPHOS, MAIL_HAUBERK, LARGE_ASPIS],
};

export const PERSIAN_INFANTRY_KIT: Loadout = {
  items: [LONG_SPEAR, ARMING_SWORD, LINOTHORAX],
};

export const PERSIAN_ARCHER_KIT: Loadout = {
  items: [PERSIAN_COMPOSITE_BOW, ARMING_SWORD, LEATHER],
};

export const NORMAN_KNIGHT_KIT: Loadout = {
  items: [NORMAN_LANCE_SUBSTITUTE, MAIL_HAUBERK, KITE_SHIELD],
};

export const NORMAN_INFANTRY_KIT: Loadout = {
  items: [ARMING_SWORD, MAIL_HAUBERK, KITE_SHIELD],
};

export const NORMAN_ARCHER_KIT: Loadout = {
  items: [ENGLISH_WARBOW, ARMING_SWORD, LEATHER],
};

export const SAXON_HUSCARL_KIT: Loadout = {
  items: [HUSCARL_AXE, MAIL_HAUBERK, KITE_SHIELD],
};

export const SAXON_FYRD_KIT: Loadout = {
  items: [ARMING_SWORD, LEATHER, KITE_SHIELD],
};

export const ROMAN_LEGIONARY_KIT: Loadout = {
  items: [ROMAN_PILUM_SIDEARM, GLADIUS, MAIL_HAUBERK, ROMAN_SCUTUM],
};

export const ROMAN_ALLIED_INFANTRY_KIT: Loadout = {
  items: [PILUM, GLADIUS, LEATHER, ROMAN_SCUTUM],
};

export const LIBYAN_INFANTRY_KIT: Loadout = {
  items: [CARTHAGINIAN_SPEAR, SPATHA, MAIL_HAUBERK, ROMAN_SCUTUM],
};

export const IBERIAN_INFANTRY_KIT: Loadout = {
  items: [FALCATA, LEATHER, KITE_SHIELD],
};

export const NUMIDIAN_SKIRMISHER_KIT: Loadout = {
  items: [NUMIDIAN_JAVELIN, ARMING_SWORD, LEATHER],
};
