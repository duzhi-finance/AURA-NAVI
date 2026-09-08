import { MAYA_TOTEMS } from "./mayaOptions";
import type { TalentProfile } from "../types/talent";

export interface CompatibilityAxis {
  label: string;
  value: number;
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function scoreFrom(seedParts: (string | number)[], offset: number): number {
  const raw = hashString(`${seedParts.join("|")}#${offset}`);
  // 35-95 range: deterministic per pair, but never flat 0 or a perfect 100
  return 35 + (raw % 61);
}

/** Deterministic per-pair scores — same two profiles always render the same radar. */
export function computeCompatibility(self: TalentProfile, target: TalentProfile): CompatibilityAxis[] {
  const seed = [
    self.maya_kin ?? 0,
    target.maya_kin ?? 0,
    MAYA_TOTEMS.indexOf(self.maya_totem),
    MAYA_TOTEMS.indexOf(target.maya_totem),
    self.maya_tone,
    target.maya_tone,
  ];

  return [
    { label: "直覺力", value: scoreFrom(seed, 1) },
    { label: "溝通頻率", value: scoreFrom(seed, 2) },
    { label: "情感安全感", value: scoreFrom(seed, 3) },
    { label: "行動默契", value: scoreFrom(seed, 4) },
  ];
}
