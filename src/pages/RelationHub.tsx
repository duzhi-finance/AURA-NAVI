import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CopyPromptBlock from "../components/CopyPromptBlock";
import GeminiButton from "../components/GeminiButton";
import PageHeader from "../components/PageHeader";
import { PROFILE_TYPE_LABEL } from "../lib/mayaOptions";
import { generateRelationPrompt } from "../lib/promptTemplates";
import { listProfiles } from "../lib/store";
import type { TalentProfile } from "../types/talent";

export default function RelationHub() {
  const [profiles, setProfiles] = useState<TalentProfile[]>([]);
  const [selfId, setSelfId] = useState("");
  const [targetId, setTargetId] = useState("");

  useEffect(() => {
    const all = listProfiles();
    setProfiles(all);
    const self = all.find((p) => p.profile_type === "Self");
    if (self) setSelfId(self.profile_id);
  }, []);

  const selfProfile = profiles.find((p) => p.profile_id === selfId);
  const targetProfile = profiles.find((p) => p.profile_id === targetId);
  const targetOptions = profiles.filter((p) => p.profile_id !== selfId);

  const prompt = useMemo(() => {
    if (!selfProfile || !targetProfile) return "";
    return generateRelationPrompt(selfProfile, targetProfile);
  }, [selfProfile, targetProfile]);

  if (profiles.length < 2) {
    return (
      <div>
        <PageHeader
          eyebrow="Relation Alignment Hub"
          title="關係解碼與翻譯館"
          description="比對你與重要關係人的天賦頻率，看見磨合點與共鳴亮點。"
        />
        <div className="glass-card rounded-2xl p-10 text-center text-ink-300">
          <p className="text-4xl mb-3">🧩</p>
          <p>至少需要 2 個天賦檔案才能進行比對</p>
          <Link to="/archive" className="text-eagle-blue underline text-sm mt-2 inline-block">
            前往 Talent DNA Archive 新增檔案
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Relation Alignment Hub"
        title="關係解碼與翻譯館"
        description="比對你與重要關係人的天賦頻率，看見磨合點與共鳴亮點。"
      />

      <div className="glass-card rounded-2xl p-5 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-ink-300">自己</span>
          <select value={selfId} onChange={(e) => setSelfId(e.target.value)} className="select-base">
            <option value="">請選擇</option>
            {profiles.map((p) => (
              <option key={p.profile_id} value={p.profile_id}>
                {p.name_alias}（{PROFILE_TYPE_LABEL[p.profile_type]}）
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-ink-300">對象</span>
          <select value={targetId} onChange={(e) => setTargetId(e.target.value)} className="select-base">
            <option value="">請選擇</option>
            {targetOptions.map((p) => (
              <option key={p.profile_id} value={p.profile_id}>
                {p.name_alias}（{PROFILE_TYPE_LABEL[p.profile_type]}）
              </option>
            ))}
          </select>
        </label>
      </div>

      {selfProfile && targetProfile && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 mt-6">
            <ProfileMiniCard profile={selfProfile} accent="glow-eagle" />
            <ProfileMiniCard profile={targetProfile} accent="glow-pink" />
          </div>

          <FrictionHint self={selfProfile} target={targetProfile} />

          <div className="mt-6">
            <CopyPromptBlock text={prompt} />
          </div>

          <div className="glass-card rounded-2xl p-5 mt-6">
            <p className="text-xs text-ink-500 mb-3">
              請將複製好的指令與雙方的瑪雅圖卡截圖，一併貼給 Gemini 進行深度分析。
            </p>
            <GeminiButton />
          </div>
        </>
      )}
    </div>
  );
}

function ProfileMiniCard({ profile, accent }: { profile: TalentProfile; accent: string }) {
  return (
    <div className={`glass-card ${accent} rounded-2xl p-4`}>
      <div className="text-xs text-ink-500">{PROFILE_TYPE_LABEL[profile.profile_type]}</div>
      <div className="text-lg font-semibold text-ink-100">{profile.name_alias}</div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-ink-300">
        <span className="rounded-lg bg-white/5 px-2 py-1">KIN {profile.maya_kin ?? "—"}</span>
        <span className="rounded-lg bg-white/5 px-2 py-1">{profile.maya_totem || "圖騰未填"}</span>
        <span className="rounded-lg bg-white/5 px-2 py-1">{profile.maya_tone || "音調未填"}</span>
      </div>
    </div>
  );
}

function FrictionHint({ self, target }: { self: TalentProfile; target: TalentProfile }) {
  const hasBoth = self.maya_totem && target.maya_totem;
  return (
    <div className="glass-card rounded-2xl p-4 mt-4 flex items-center gap-3">
      <span className="text-xl">⚡</span>
      <p className="text-sm text-ink-300">
        {hasBoth ? (
          <>
            <span className="text-eagle-blue">{self.maya_totem}</span> ×{" "}
            <span className="text-earth-pink">{target.maya_totem}</span>
            　的頻率磨合點，將由下方生成的指令交由 Gemini 深度解析。
          </>
        ) : (
          "建議先在 Talent DNA Archive 補齊雙方圖騰資訊，讓解析更精準。"
        )}
      </p>
    </div>
  );
}
