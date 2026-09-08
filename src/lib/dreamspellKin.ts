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
  return {
    kin: kinIndex + 1,
    tone: MAYA_TONES[kinIndex % 13],
    totem: MAYA_TOTEMS[kinIndex % 20],
  };
}
