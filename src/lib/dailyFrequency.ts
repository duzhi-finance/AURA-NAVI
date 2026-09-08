import { Moon, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { Solar } from "lunar-javascript";

export interface DailyFrequency {
  key: "attack" | "rest" | "sync";
  label: string;
  Icon: LucideIcon;
  description: string;
  colorClass: string;
  /** Same value as colorClass's CSS token, for contexts (e.g. canvas) that can't read CSS vars. */
  colorHex: string;
}

const FREQUENCIES: DailyFrequency[] = [
  {
    key: "attack",
    label: "進攻日",
    Icon: Zap,
    description: "能量高漲，適合主動出擊、表達自我、推進重要決策。",
    colorClass: "text-freq-attack",
    colorHex: "#b5533c",
  },
  {
    key: "rest",
    label: "沉澱日",
    Icon: Moon,
    description: "頻率內收，適合休息、覆盤與整理內在，避免衝動決定。",
    colorClass: "text-freq-rest",
    colorHex: "#5b7a99",
  },
  {
    key: "sync",
    label: "共時日",
    Icon: Sparkles,
    description: "同步性強，容易遇見巧合與關鍵訊息，適合連結與溝通。",
    colorClass: "text-freq-sync",
    colorHex: "#a98b4a",
  },
];

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export function getTodayFrequency(date: Date = new Date()): DailyFrequency {
  const seed = dayOfYear(date) + date.getFullYear();
  return FREQUENCIES[seed % FREQUENCIES.length];
}

export function formatDateLabel(date: Date = new Date()): string {
  return date.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export function formatBilingualDateLabel(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });

  let lunarLabel = "";
  try {
    const lunar = Solar.fromDate(date).getLunar();
    lunarLabel = `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
  } catch {
    lunarLabel = "";
  }

  const solarLabel = `${y}.${m}.${d} ${weekday}`;
  return lunarLabel ? `${solarLabel}｜${lunarLabel}` : solarLabel;
}
