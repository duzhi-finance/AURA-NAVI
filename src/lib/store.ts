import type { TalentProfile } from "../types/talent";

const STORAGE_KEY = "aura-navi:talent_profiles";

function readAll(): TalentProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(profiles: TalentProfile[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch {
    // storage unavailable (private browsing, blocked site data, etc.) — silently no-op
  }
}

export function listProfiles(): TalentProfile[] {
  return readAll().sort((a, b) => {
    if (a.profile_type === "Self" && b.profile_type !== "Self") return -1;
    if (b.profile_type === "Self" && a.profile_type !== "Self") return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export function getProfile(id: string): TalentProfile | undefined {
  return readAll().find((p) => p.profile_id === id);
}

export function getSelfProfile(): TalentProfile | undefined {
  return readAll().find((p) => p.profile_type === "Self");
}

export function saveProfile(profile: TalentProfile) {
  const all = readAll();
  const idx = all.findIndex((p) => p.profile_id === profile.profile_id);
  if (idx >= 0) {
    all[idx] = profile;
  } else {
    all.push(profile);
  }
  writeAll(all);
}

export function deleteProfile(id: string) {
  writeAll(readAll().filter((p) => p.profile_id !== id));
}

export function createProfileId(): string {
  return `profile_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const SEEDED_FLAG_KEY = "aura-navi:seeded_v1";

const DEMO_PROFILES: TalentProfile[] = [
  {
    profile_id: "demo_self_215",
    profile_type: "Self",
    name_alias: "自己",
    maya_kin: 215,
    maya_tone: "",
    maya_totem: "藍鷹",
    life_path_num: null,
    core_traits_tags: [],
    relationship_notes: "",
    created_at: new Date(2026, 0, 1).toISOString(),
  },
  {
    profile_id: "demo_manager_75",
    profile_type: "Manager",
    name_alias: "主管",
    maya_kin: 75,
    maya_tone: "行星",
    maya_totem: "藍鷹",
    life_path_num: null,
    core_traits_tags: [],
    relationship_notes: "",
    created_at: new Date(2026, 0, 2).toISOString(),
  },
];

export function ensureSeedProfiles() {
  try {
    if (localStorage.getItem(SEEDED_FLAG_KEY)) return;
    if (readAll().length === 0) {
      writeAll(DEMO_PROFILES);
    }
    localStorage.setItem(SEEDED_FLAG_KEY, "1");
  } catch {
    // storage unavailable — skip seeding silently
  }
}

interface BackupFile {
  app: "aura-navi";
  version: 1;
  exported_at: string;
  profiles: TalentProfile[];
}

function todayFileStamp(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export function exportProfilesAsJson(): void {
  const backup: BackupFile = {
    app: "aura-navi",
    version: 1,
    exported_at: new Date().toISOString(),
    profiles: readAll(),
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `aura-navi-backup-${todayFileStamp()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function normalizeImportedProfile(raw: unknown): TalentProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Partial<TalentProfile>;
  if (typeof p.profile_id !== "string" || typeof p.name_alias !== "string") return null;
  if (typeof p.profile_type !== "string") return null;

  return {
    profile_id: p.profile_id,
    profile_type: p.profile_type,
    name_alias: p.name_alias,
    maya_kin: typeof p.maya_kin === "number" ? p.maya_kin : null,
    maya_tone: typeof p.maya_tone === "string" ? p.maya_tone : "",
    maya_totem: typeof p.maya_totem === "string" ? p.maya_totem : "",
    life_path_num: typeof p.life_path_num === "number" ? p.life_path_num : null,
    core_traits_tags: Array.isArray(p.core_traits_tags) ? p.core_traits_tags : [],
    relationship_notes: typeof p.relationship_notes === "string" ? p.relationship_notes : "",
    created_at: typeof p.created_at === "string" ? p.created_at : new Date().toISOString(),
  };
}

export interface ImportResult {
  success: boolean;
  count: number;
  error?: string;
}

export function importProfilesFromJson(fileContent: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(fileContent);
  } catch {
    return { success: false, count: 0, error: "檔案格式錯誤，無法解析 JSON。" };
  }

  const rawProfiles = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as Partial<BackupFile> | null)?.profiles)
      ? (parsed as BackupFile).profiles
      : null;

  if (!rawProfiles) {
    return { success: false, count: 0, error: "檔案內容不是有效的備份格式。" };
  }

  const valid = rawProfiles
    .map(normalizeImportedProfile)
    .filter((p): p is TalentProfile => p !== null);

  if (valid.length === 0) {
    return { success: false, count: 0, error: "備份檔案中沒有可匯入的天賦檔案。" };
  }

  const merged = readAll();
  for (const p of valid) {
    const idx = merged.findIndex((e) => e.profile_id === p.profile_id);
    if (idx >= 0) {
      merged[idx] = p;
    } else {
      merged.push(p);
    }
  }
  writeAll(merged);

  return { success: true, count: valid.length };
}
