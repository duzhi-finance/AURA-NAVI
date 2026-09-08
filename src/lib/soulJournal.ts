import type { LifeDomain, RelationshipStatus } from "../types/talent";

export interface SoulJournalEntry {
  id: string;
  created_at: string;
  domain: LifeDomain;
  domainLabel: string;
  context: string;
  relationshipStatus?: RelationshipStatus | null;
}

const JOURNAL_KEY = "aura-navi:soul_journal";
const JOURNAL_LIMIT = 100;

function readAll(): SoulJournalEntry[] {
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getSoulJournal(): SoulJournalEntry[] {
  return readAll().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function addSoulJournalEntry(
  entry: Omit<SoulJournalEntry, "id" | "created_at">
): SoulJournalEntry {
  const full: SoulJournalEntry = {
    ...entry,
    id: `journal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    created_at: new Date().toISOString(),
  };
  try {
    const all = readAll();
    all.unshift(full);
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(all.slice(0, JOURNAL_LIMIT)));
  } catch {
    // storage unavailable — entry still returned for this session, just won't persist
  }
  return full;
}

export function formatJournalDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
