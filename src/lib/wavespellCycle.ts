import { TONE_NUANCE, TONE_PSI } from "./deepTalent";
import { kinToResult } from "./dreamspellKin";
import { MAYA_TOTEMS } from "./mayaOptions";

export interface WavespellYear {
  /** 1-13, position within the 13-year life cycle (== wavespell tone number). */
  year: number;
  tone: string;
  totem: string;
  kin: number;
  /** 核心學習課題 */
  coreLesson: string;
  /** 突破亮點 */
  breakthrough: string;
}

/** 本命 KIN 所屬的 13 天波符（生命大運波符）在 13 年生命週期中的 13 個年度。 */
export function computeWavespellYears(birthKin: number): WavespellYear[] {
  const birthKinIndex0 = birthKin - 1;
  const wavespellStart0 = birthKinIndex0 - (birthKinIndex0 % 13);

  return Array.from({ length: 13 }, (_, i) => {
    const kinIndex0 = wavespellStart0 + i;
    const result = kinToResult(kinIndex0 + 1);
    const toneIdx0 = kinIndex0 % 13;
    return {
      year: i + 1,
      tone: result.tone,
      totem: result.totem,
      kin: result.kin,
      coreLesson: TONE_NUANCE[toneIdx0],
      breakthrough: TONE_PSI[toneIdx0],
    };
  });
}

/** 波符名稱：起點印記的圖騰 + 「波符」。 */
export function wavespellName(birthKin: number): string {
  const birthKinIndex0 = birthKin - 1;
  const wavespellStart0 = birthKinIndex0 - (birthKinIndex0 % 13);
  return `${MAYA_TOTEMS[wavespellStart0 % 20]}波符`;
}

/** 目前處於 13 年生命大運週期的第幾年（1-13），依滿週歲計算，出生當年為第 1 年。 */
export function computeCurrentCycleYear(birthDate: string, today: Date = new Date()): number | null {
  const parts = birthDate.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [birthYear, birthMonth, birthDay] = parts;

  let age = today.getFullYear() - birthYear;
  const hasHadBirthdayThisYear =
    today.getMonth() + 1 > birthMonth ||
    (today.getMonth() + 1 === birthMonth && today.getDate() >= birthDay);
  if (!hasHadBirthdayThisYear) age -= 1;
  if (age < 0) age = 0;

  return (age % 13) + 1;
}

/** 指定西元年份時，使用者處於 13 年生命週期的第幾年（1-13）。以年齡概算，不考慮月日。 */
export function cycleYearForCalendarYear(birthDate: string, targetYear: number): number | null {
  const parts = birthDate.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [birthYear] = parts;
  let age = targetYear - birthYear;
  if (age < 0) age = 0;
  return (age % 13) + 1;
}
