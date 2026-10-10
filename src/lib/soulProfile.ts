import { computeLifePathNumber, getCard, type MajorArcanaCard } from "./tarotMajorArcana";

const PROFILE_CACHE_KEY = "soul-profile-birthdate";
const UNLOCK_STORAGE_KEY = "soul-report-unlocked";
const INTRO_SEEN_KEY = "soul-intro-seen";

export interface SoulProfile {
  y: number;
  m: number;
  d: number;
  birthdateLabel: string;
  primaryCard: MajorArcanaCard;
  dualCard: MajorArcanaCard | null;
  supplementCards: MajorArcanaCard[];
}

function formatBirthdateLabel(y: number, m: number, d: number): string {
  return `西元 ${y} 年 ${m} 月 ${d} 日`;
}

export function buildProfile(y: number, m: number, d: number): SoulProfile {
  const lifePath = computeLifePathNumber(y, m, d);
  return {
    y,
    m,
    d,
    birthdateLabel: formatBirthdateLabel(y, m, d),
    primaryCard: getCard(lifePath.primary),
    dualCard: lifePath.dualNumber != null ? getCard(lifePath.dualNumber) : null,
    supplementCards: lifePath.supplementChain.slice(1).map(getCard),
  };
}

export function readCachedProfile(): SoulProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return null;
    const parts = raw.split("-").map(Number);
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
    const [y, m, d] = parts;
    return buildProfile(y, m, d);
  } catch {
    return null;
  }
}

export function writeCachedProfile(y: number, m: number, d: number) {
  try {
    localStorage.setItem(PROFILE_CACHE_KEY, `${y}-${m}-${d}`);
  } catch {
    // best-effort persistence only
  }
}

export function clearCachedProfile() {
  try {
    localStorage.removeItem(PROFILE_CACHE_KEY);
  } catch {
    // best-effort persistence only
  }
}

export function readUnlockedFlag(): boolean {
  try {
    return localStorage.getItem(UNLOCK_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function writeUnlockedFlag() {
  try {
    localStorage.setItem(UNLOCK_STORAGE_KEY, "true");
  } catch {
    // best-effort persistence only
  }
}

export function readIntroSeen(): boolean {
  try {
    return localStorage.getItem(INTRO_SEEN_KEY) === "true";
  } catch {
    return false;
  }
}

export function markIntroSeen() {
  try {
    localStorage.setItem(INTRO_SEEN_KEY, "true");
  } catch {
    // best-effort persistence only
  }
}
