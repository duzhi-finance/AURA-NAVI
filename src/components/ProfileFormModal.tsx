import { useMemo, useState } from "react";
import type { TalentProfile } from "../types/talent";
import { MAYA_TONES, MAYA_TOTEMS } from "../lib/mayaOptions";
import { computeDeepTalent, type DeepTalentData } from "../lib/deepTalent";
import { computeKinFromBirthdate } from "../lib/dreamspellKin";
import { createProfileId } from "../lib/store";

interface Props {
  initial?: TalentProfile;
  onSave: (profile: TalentProfile) => void;
  onClose: () => void;
}

const EMPTY_DEEP_TALENT: DeepTalentData = {
  core_resonance_nuance: "",
  hidden_personality: "",
  totem_animal: "",
  hidden_push_psi: "",
  wavespell: "",
  support_challenge_energy: "",
};

const DEEP_TALENT_LABELS: { key: keyof DeepTalentData; label: string }[] = [
  { key: "totem_animal", label: "力量動物" },
  { key: "wavespell", label: "波符" },
  { key: "hidden_push_psi", label: "隱藏推動（PSI，潛意識爆發力）" },
  { key: "core_resonance_nuance", label: "核心共鳴與細微差異" },
  { key: "hidden_personality", label: "隱藏性格" },
  { key: "support_challenge_energy", label: "支持能量與挑戰擴展" },
];

export default function ProfileFormModal({ initial, onSave, onClose }: Props) {
  const [profileType, setProfileType] = useState(initial?.profile_type ?? "");
  const [isSelf, setIsSelf] = useState(initial?.is_self ?? false);
  const [nameAlias, setNameAlias] = useState(initial?.name_alias ?? "");
  const [birthdate, setBirthdate] = useState(initial?.birth_date ?? "");
  const [kin, setKin] = useState(initial?.maya_kin != null ? String(initial.maya_kin) : "");
  const [tone, setTone] = useState(initial?.maya_tone ?? "");
  const [totem, setTotem] = useState(initial?.maya_totem ?? "");
  const [lifePath, setLifePath] = useState(
    initial?.life_path_num != null ? String(initial.life_path_num) : ""
  );
  const [tags, setTags] = useState(initial?.core_traits_tags.join("、") ?? "");
  const [notes, setNotes] = useState(initial?.relationship_notes ?? "");

  const isEditing = Boolean(initial);

  const deepTalent = useMemo<DeepTalentData>(() => {
    if (!kin.trim()) return EMPTY_DEEP_TALENT;
    return computeDeepTalent(Number(kin) - 1);
  }, [kin]);

  function handleBirthdateChange(value: string) {
    setBirthdate(value);
    if (!value) return;
    const [y, m, d] = value.split("-").map(Number);
    const result = computeKinFromBirthdate(y, m, d);
    setKin(String(result.kin));
    setTone(result.tone);
    setTotem(result.totem);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nameAlias.trim()) return;

    const profile: TalentProfile = {
      profile_id: initial?.profile_id ?? createProfileId(),
      profile_type: profileType.trim(),
      is_self: isSelf,
      name_alias: nameAlias.trim(),
      birth_date: birthdate,
      maya_kin: kin.trim() ? Number(kin) : null,
      maya_tone: tone,
      maya_totem: totem,
      life_path_num: lifePath.trim() ? Number(lifePath) : null,
      core_traits_tags: tags
        .split(/[、,，]/)
        .map((t) => t.trim())
        .filter(Boolean),
      relationship_notes: notes.trim(),
      ...deepTalent,
      created_at: initial?.created_at ?? new Date().toISOString(),
    };
    onSave(profile);
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-text-primary/40 p-4" onClick={onClose}>
      <div
        className="bg-bg border border-border w-full max-w-lg rounded-2xl p-7 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-serif text-xl font-normal text-text-primary mb-6">
          {isEditing ? "編輯靈魂印記" : "新增靈魂印記"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="類型">
            <input
              value={profileType}
              onChange={(e) => setProfileType(e.target.value)}
              className="input-base"
            />
          </Field>

          <label className="flex items-center gap-2.5 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={isSelf}
              onChange={(e) => setIsSelf(e.target.checked)}
              className="h-4 w-4 accent-text-primary"
            />
            這是我自己的靈魂印記
          </label>

          <Field label="暱稱 *">
            <input
              value={nameAlias}
              onChange={(e) => setNameAlias(e.target.value)}
              className="input-base"
              required
            />
          </Field>

          <Field label="出生年月日（選填，自動算定天賦資料）">
            <input
              type="date"
              value={birthdate}
              onChange={(e) => handleBirthdateChange(e.target.value)}
              className="input-base"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="KIN 碼">
              <input
                value={kin}
                onChange={(e) => setKin(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="215"
                className="input-base"
                inputMode="numeric"
              />
            </Field>
            <Field label="生命靈數">
              <input
                value={lifePath}
                onChange={(e) => setLifePath(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="7"
                className="input-base"
                inputMode="numeric"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="音調">
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="select-base">
                <option value="">未選擇</option>
                {MAYA_TONES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="圖騰">
              <select value={totem} onChange={(e) => setTotem(e.target.value)} className="select-base">
                <option value="">未選擇</option>
                {MAYA_TOTEMS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="個人標籤／地雷">
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="input-base"
            />
          </Field>

          <Field label="關係地雷與互動備註">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-base min-h-20 resize-y"
            />
          </Field>

          <details className="group rounded-xl border border-border px-4 py-3" open={Boolean(kin.trim())}>
            <summary className="cursor-pointer text-sm text-luxe-gold select-none">
              ✦ 系統已自動對焦星軌數據（自動生成）
            </summary>
            <div className="flex flex-col gap-3 mt-4">
              {kin.trim() ? (
                DEEP_TALENT_LABELS.map(({ key, label }) => (
                  <div
                    key={key}
                    className="rounded-lg bg-bg border border-border px-3 py-2.5 text-xs"
                  >
                    <span className="text-text-tertiary">{label}：</span>
                    <span className="text-text-secondary">{deepTalent[key]}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-tertiary leading-relaxed">
                  請先填寫出生年月日或 KIN 碼，系統將自動算出力量動物、波符、PSI 等深度天賦資料。
                </p>
              )}
            </div>
          </details>

          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              取消
            </button>
            <button type="submit" className="btn-primary">
              儲存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-text-secondary">{label}</span>
      {children}
    </label>
  );
}
