import { computeKinFromBirthdate, kinToResult, type DreamspellResult } from "./dreamspellKin";

export interface DailyStrategy {
  label: "進攻日" | "談判日" | "沉澱日" | "合約日";
  description: string;
}

const DAILY_STRATEGIES: DailyStrategy[] = [
  { label: "進攻日", description: "能量向外擴張，適合主動出擊、提案與表達自我。" },
  { label: "談判日", description: "溝通頻率清晰，適合協商、締結共識與化解歧見。" },
  { label: "沉澱日", description: "頻率內收，適合覆盤、蒐集資訊，避免倉促決定。" },
  { label: "合約日", description: "結構穩定，適合簽署合約、拍板定案與長期承諾。" },
];

/** 年度流年 KIN：用出生月日換算「今年」的瑪雅印記，代表這一整年的主旋律。 */
export function computeYearlyKin(
  birthMonth: number,
  birthDay: number,
  year: number = new Date().getFullYear()
): DreamspellResult {
  return computeKinFromBirthdate(year, birthMonth, birthDay);
}

/** 每日流日：換算今天的 KIN。 */
export function computeTodayKin(date: Date = new Date()): DreamspellResult {
  return computeKinFromBirthdate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

/**
 * 結合流年 KIN 與今日 KIN，推導今日商業策略屬性。用兩者在 260 循環上的相對距離
 * （mod 4）決定落在四種策略之一，確定性且可重現。
 */
export function computeDailyStrategy(yearlyKin: number, todayKin: number): DailyStrategy {
  const diff = (((todayKin - yearlyKin) % 4) + 4) % 4;
  return DAILY_STRATEGIES[diff];
}

export function parseBirthMonthDay(birthDate: string): { month: number; day: number } | null {
  const parts = birthDate.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [, month, day] = parts;
  return { month, day };
}

export function kinLabel(result: DreamspellResult): string {
  return `KIN ${result.kin}．${result.totem}．${result.tone}`;
}

export { kinToResult };
