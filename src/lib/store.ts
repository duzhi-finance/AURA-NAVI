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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
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
