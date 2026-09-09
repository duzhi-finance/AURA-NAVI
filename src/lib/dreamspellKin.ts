import { MAYA_TONES, MAYA_TOTEMS } from "./mayaOptions";

/**
 * Gregorian calendar date -> Julian Day Number (Fliegel & Van Flandern algorithm).
 * Standard, widely-verified integer formula -- see the Julian day article on JDN calculation.
 */
function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * GMT (Goodman-Martinez-Thompson) correlation: JDN 584283 is the Long Count creation
 * date 0.0.0.0.0, whose Tzolkin day is the well-documented "4 Ahau" (also why Dec 21,
 * 2012 -- 13.0.0.0.0, exactly 1,872,000 = 260*7200 days later -- was reported as "4 Ahau"
 * again). "4 Ahau" is kin index 159 (0-based) in the 1-Imix-first numbering this app
 * already uses for MAYA_TOTEMS/MAYA_TONES, so the epoch for kin index 0 ("1 Imix",
 * Kin 1, Magnetic Dragon) sits 159 days earlier.
 */
const KIN_INDEX_ZERO_JDN = 584283 - 159;

export interface DreamspellResult {
  kin: number;
  tone: string;
  totem: string;
}

export function computeKinFromBirthdate(year: number, month: number, day: number): DreamspellResult {
  const jdn = gregorianToJDN(year, month, day);
  const kinIndex = (((jdn - KIN_INDEX_ZERO_JDN) % 260) + 260) % 260;
  return kinToResult(kinIndex + 1);
}

export function kinToResult(kin: number): DreamspellResult {
  const kinIndex = ((kin - 1) % 260 + 260) % 260;
  return {
    kin: kinIndex + 1,
    tone: MAYA_TONES[kinIndex % 13],
    totem: MAYA_TOTEMS[kinIndex % 20],
  };
}

/** Find the (1-260) kin whose tone index and totem index (both 0-based) match. Always
 * solvable since gcd(13, 20) = 1, so every (tone, totem) pair maps to exactly one kin. */
function findKinByToneAndTotem(toneIdx0: number, totemIdx0: number): number {
  for (let i = 0; i < 260; i++) {
    if (i % 13 === toneIdx0 && i % 20 === totemIdx0) return i + 1;
  }
  return 1; // unreachable
}

/**
 * PSI / 隱藏推動（Occult Kin）：the standard Dreamspell "hidden power" partner of a kin,
 * defined as 261 - kin. Always yields a valid 1-260 kin.
 */
export function computePsiKin(birthKin: number): number {
  return 261 - birthKin;
}

/**
 * 內在女神力（Goddess Kin）：not a standard Dreamspell term (glowing.cc's own addition), so
 * defined here as this app's own consistent convention -- same tone as the birth kin, but the
 * opposite totem on the 20-count wheel (totem index + 10), matching the "support" totem offset
 * already used by computeDeepTalent's support_challenge_energy.
 */
export function computeGoddessKin(birthKin: number): number {
  const kinIndex0 = birthKin - 1;
  const toneIdx0 = kinIndex0 % 13;
  const totemIdx0 = (kinIndex0 % 20 + 10) % 20;
  return findKinByToneAndTotem(toneIdx0, totemIdx0);
}
