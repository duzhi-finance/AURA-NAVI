export interface DailyFrequency {
  key: "attack" | "rest" | "sync";
  label: string;
  emoji: string;
  description: string;
  colorClass: string;
}

const FREQUENCIES: DailyFrequency[] = [
  {
    key: "attack",
    label: "進攻日",
    emoji: "⚡",
    description: "能量高漲，適合主動出擊、表達自我、推進重要決策。",
    colorClass: "text-earth-pink",
  },
  {
    key: "rest",
    label: "沉澱日",
    emoji: "🌙",
    description: "頻率內收，適合休息、覆盤與整理內在，避免衝動決定。",
    colorClass: "text-eagle-blue",
  },
  {
    key: "sync",
    label: "共時日",
    emoji: "✨",
    description: "同步性強，容易遇見巧合與關鍵訊息，適合連結與溝通。",
    colorClass: "text-star-gold",
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
