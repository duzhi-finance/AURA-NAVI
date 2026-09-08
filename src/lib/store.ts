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
