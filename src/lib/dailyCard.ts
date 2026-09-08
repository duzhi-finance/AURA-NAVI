export interface DailyCard {
  name: string;
  insight: string;
}

export const CARD_DECK: DailyCard[] = [
  { name: "紅龍", insight: "回到最初的自己，允許被好好照顧。" },
  { name: "白風", insight: "說出真心話，讓思緒自由流動。" },
  { name: "藍夜", insight: "放下焦慮，讓豐盛在夢裡先發生。" },
  { name: "黃種子", insight: "專注一件事，讓它扎根發芽。" },
  { name: "紅蛇", insight: "傾聽身體的訊號，活出本能的力量。" },
  { name: "白世界橋", insight: "放手是為了讓新的可能進來。" },
  { name: "藍手", insight: "動手去做，療癒就在行動裡發生。" },
  { name: "黃星星", insight: "用美感重新整理你的生活。" },
  { name: "紅月", insight: "順流而行，情緒也需要被淨化。" },
  { name: "白狗", insight: "先愛自己，才能無條件地愛人。" },
  { name: "藍猴", insight: "別把一切看得太重，玩心能解開僵局。" },
  { name: "黃人", insight: "相信自己的判斷，做出自由的選擇。" },
  { name: "紅天行者", insight: "跳脫舊框架，去看更大的風景。" },
  { name: "白巫師", insight: "保持開放，答案會在安靜中出現。" },
  { name: "藍鷹", insight: "站在高處俯瞰全局，看見更遠的可能。" },
  { name: "黃戰士", insight: "帶著提問的勇氣，突破眼前的障礙。" },
  { name: "紅地球", insight: "留意生活中的巧合，它們正在指路。" },
  { name: "白鏡", insight: "誠實地照見自己，答案早已存在心中。" },
  { name: "藍風暴", insight: "允許改變發生，你比想像中更有力量。" },
  { name: "黃太陽", insight: "活出自己的光，溫暖也會回到你身上。" },
];

export function cardSeedIndex(card: DailyCard): number {
  const idx = CARD_DECK.findIndex((c) => c.name === card.name);
  return idx >= 0 ? idx : 0;
}

const DAILY_CARD_KEY = "aura-navi:daily_card";
const DAILY_CARD_LOG_KEY = "aura-navi:daily_card_log";
const LOG_LIMIT = 60;

function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

interface StoredDailyCard {
  date: string;
  card: DailyCard;
}

export interface DailyCardLogEntry {
  date: string;
  card: DailyCard;
}

export function getTodayCard(): DailyCard | null {
  try {
    const raw = localStorage.getItem(DAILY_CARD_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredDailyCard;
    if (parsed.date !== todayKey()) return null;
    return parsed.card;
  } catch {
    return null;
  }
}

export function getCardLog(): DailyCardLogEntry[] {
  try {
    const raw = localStorage.getItem(DAILY_CARD_LOG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a: DailyCardLogEntry, b: DailyCardLogEntry) =>
      b.date.localeCompare(a.date)
    );
  } catch {
    return [];
  }
}

function appendToLog(entry: StoredDailyCard) {
  try {
    const log = getCardLog().filter((e) => e.date !== entry.date);
    log.unshift(entry);
    const trimmed = log.slice(0, LOG_LIMIT);
    localStorage.setItem(DAILY_CARD_LOG_KEY, JSON.stringify(trimmed));
  } catch {
    // storage unavailable — skip logging silently
  }
}

export function drawTodayCard(): DailyCard {
  const existing = getTodayCard();
  if (existing) return existing;

  const card = CARD_DECK[Math.floor(Math.random() * CARD_DECK.length)];
  const entry: StoredDailyCard = { date: todayKey(), card };
  try {
    localStorage.setItem(DAILY_CARD_KEY, JSON.stringify(entry));
  } catch {
    // storage unavailable — the draw still renders for this session, just won't persist
  }
  appendToLog(entry);
  return card;
}
