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

/** 13 年生命大運週期中，每一年的簡短提醒警語（索引 0 = 第 1 年）。 */
export const CYCLE_YEAR_REMINDER: string[] = [
  "發起 —— 新循環的起點，適合播種與嘗試新方向，別怕從零開始。",
  "挑戰 —— 考驗接踵而來，這是鍛鍊耐力與決心的一年。",
  "覺察 —— 開始看清模式與盲點，適合調整策略、修正方向。",
  "穩定 —— 打好根基的一年，扎實累積比衝刺更重要。",
  "覺醒 —— 靈感與機會湧現，適合大膽表達自己。",
  "責任 —— 承擔更多角色與責任，也是被信任、被託付的一年。",
  "反思 —— 適合沉澱盤點，重新校準你真正想要的方向。",
  "收穫 —— 努力開始有回報，適合展現成果、爭取應得的。",
  "完成 —— 一個階段收尾，適合放下不再適合的人事物。",
  "顯化 —— 力量具體成形，適合落地執行大型計畫。",
  "釋放 —— 打破舊有框架，允許自己蛻變成新的樣子。",
  "合作 —— 人際與團隊能量旺盛，適合結盟與共創。",
  "圓滿 —— 整個週期的高峰與收成，為下一輪循環鋪路。",
];

export function cycleYearReminder(year: number): string {
  return CYCLE_YEAR_REMINDER[((year - 1) % 13 + 13) % 13];
}
