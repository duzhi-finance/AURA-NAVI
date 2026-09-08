import { useState } from "react";
import type { ProfileType, TalentProfile } from "../types/talent";
import { MAYA_TONES, MAYA_TOTEMS, PROFILE_TYPE_OPTIONS } from "../lib/mayaOptions";
import { createProfileId } from "../lib/store";

interface Props {
  initial?: TalentProfile;
  onSave: (profile: TalentProfile) => void;
  onClose: () => void;
}

export default function ProfileFormModal({ initial, onSave, onClose }: Props) {
  const [profileType, setProfileType] = useState<ProfileType>(initial?.profile_type ?? "Partner");
  const [nameAlias, setNameAlias] = useState(initial?.name_alias ?? "");
  const [kin, setKin] = useState(initial?.maya_kin != null ? String(initial.maya_kin) : "");
  const [tone, setTone] = useState(initial?.maya_tone ?? "");
  const [totem, setTotem] = useState(initial?.maya_totem ?? "");
  const [lifePath, setLifePath] = useState(
    initial?.life_path_num != null ? String(initial.life_path_num) : ""
  );
  const [tags, setTags] = useState(initial?.core_traits_tags.join("、") ?? "");

  const isEditing = Boolean(initial);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nameAlias.trim()) return;

    const profile: TalentProfile = {
      profile_id: initial?.profile_id ?? createProfileId(),
      profile_type: profileType,
      name_alias: nameAlias.trim(),
      maya_kin: kin.trim() ? Number(kin) : null,
      maya_tone: tone,
      maya_totem: totem,
      life_path_num: lifePath.trim() ? Number(lifePath) : null,
      core_traits_tags: tags
        .split(/[、,，]/)
        .map((t) => t.trim())
        .filter(Boolean),
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
        <h2 className="font-serif text-xl font-semibold text-text-primary mb-6">
          {isEditing ? "編輯天賦檔案" : "新增天賦檔案"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="關係類型">
            <select
              value={profileType}
              onChange={(e) => setProfileType(e.target.value as ProfileType)}
              className="select-base"
            >
              {PROFILE_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="暱稱 *">
            <input
              value={nameAlias}
              onChange={(e) => setNameAlias(e.target.value)}
              placeholder="例如：我自己 / 阿明 / 王主管"
              className="input-base"
              required
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

          <Field label="個人標籤／地雷（用頓號或逗號分隔）">
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="例如：討厭被催促、需要獨處充電"
              className="input-base"
            />
          </Field>

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
