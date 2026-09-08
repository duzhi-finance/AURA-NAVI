import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CopyPromptBlock from "../components/CopyPromptBlock";
import FrequencyRadar from "../components/FrequencyRadar";
import GeminiButton from "../components/GeminiButton";
import PageHeader from "../components/PageHeader";
import TotemEmblem from "../components/TotemEmblem";
import { computeCompatibility } from "../lib/compatibility";
import { MAYA_TOTEMS } from "../lib/mayaOptions";
import { generateRelationPrompt } from "../lib/promptTemplates";
import { getProfile, listProfiles } from "../lib/store";
import type { TalentProfile } from "../types/talent";

interface GalleryNavState {
  selfId?: string;
  targetId?: string;
}

export default function RelationHub() {
  const location = useLocation();
  const [profileCount, setProfileCount] = useState(0);
  const [selfProfile, setSelfProfile] = useState<TalentProfile | undefined>(undefined);
  const [targetProfile, setTargetProfile] = useState<TalentProfile | undefined>(undefined);

  useEffect(() => {
    const all = listProfiles();
    setProfileCount(all.length);

    const state = location.state as GalleryNavState | null;
    if (state?.selfId && state?.targetId) {
      setSelfProfile(getProfile(state.selfId));
      setTargetProfile(getProfile(state.targetId));
    }
    // only consume the incoming nav state once, on arrival
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prompt = useMemo(() => {
    if (!selfProfile || !targetProfile) return "";
    return generateRelationPrompt(selfProfile, targetProfile);
  }, [selfProfile, targetProfile]);

  const radarAxes = useMemo(() => {
    if (!selfProfile || !targetProfile) return null;
    return computeCompatibility(selfProfile, targetProfile);
  }, [selfProfile, targetProfile]);

  if (!selfProfile || !targetProfile) {
    return (
      <div>
        <PageHeader
          eyebrow="Frequency Resonance Gallery"
          title="頻率共振藝廊"
          description="比對你與重要關係人的天賦頻率，看見磨合點與共鳴亮點。"
        />
        <div className="panel p-12 text-center text-text-secondary">
          <ResonanceRingsIcon size={48} strokeWidth={0.75} className="mx-auto mb-6 text-luxe-gold" />
          <div className="inline-flex items-center gap-3 rounded-full px-5 py-2.5 mb-6 bg-bg-subtle/60 border border-border">
            <span className="desc-text text-sm text-text-secondary">
              {profileCount < 2
                ? "至少需要 2 張靈魂印記才能進行比對"
                : "請至靈魂印記典藏館選取兩張印記進入藝廊"}
            </span>
          </div>
          <div>
            <Link to="/archive" className="btn-primary">
              前往靈魂印記典藏館選取
              <ArrowRight size={16} strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Frequency Resonance Gallery"
        title="頻率共振藝廊"
        description="比對你與重要關係人的天賦頻率，看見磨合點與共鳴亮點。"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <PortraitFrame profile={selfProfile} label="自己" />
        <PortraitFrame profile={targetProfile} label={targetProfile.profile_type || "對象"} />
      </div>

      {radarAxes && (
        <div className="panel p-8 mt-6 flex flex-col items-center">
          <p className="text-[11px] uppercase tracking-[0.15em] text-text-tertiary mb-1">
            Frequency Radar
          </p>
          <p className="desc-text text-sm text-text-secondary mb-4">四維能量相容度</p>
          <FrequencyRadar axes={radarAxes} size={280} />
        </div>
      )}

      <ResonanceJunction self={selfProfile} target={targetProfile} />

      <div className="mt-6">
        <CopyPromptBlock text={prompt} />
      </div>

      <div className="panel p-6 mt-6">
        <p className="desc-text text-xs text-text-tertiary mb-4">
          請將複製好的指令與雙方的瑪雅圖卡截圖，一併貼給 Gemini 進行深度分析。
        </p>
        <GeminiButton />
      </div>
    </div>
  );
}

function ResonanceRingsIcon({
  size = 18,
  strokeWidth = 1,
  className = "",
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="9" cy="12" r="7" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="15" cy="12" r="7" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}

function PortraitFrame({ profile, label }: { profile: TalentProfile; label: string }) {
  const seed = MAYA_TOTEMS.indexOf(profile.maya_totem);

  return (
    <div className="card-luxe card-halo card-hover p-8 flex flex-col items-center text-center gap-3">
      <span className="text-[11px] uppercase tracking-[0.15em] text-text-tertiary">{label}</span>
      <TotemEmblem seed={seed >= 0 ? seed : 0} size={84} className="text-luxe-gold my-1" />
      <div className="text-xl font-serif font-normal text-text-primary">{profile.name_alias}</div>
      <div className="flex flex-wrap justify-center gap-2 text-xs text-text-secondary mt-1">
        <span className="rounded-lg bg-bg border border-border px-2 py-1 font-serif">KIN {profile.maya_kin ?? "—"}</span>
        <span className="rounded-lg bg-bg border border-border px-2 py-1">{profile.maya_totem || "圖騰未填"}</span>
        <span className="rounded-lg bg-bg border border-border px-2 py-1">{profile.maya_tone || "音調未填"}</span>
      </div>
    </div>
  );
}

function ResonanceJunction({ self, target }: { self: TalentProfile; target: TalentProfile }) {
  const hasBoth = self.maya_totem && target.maya_totem;
  return (
    <div className="my-8">
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-luxe-gold shrink-0" />
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="text-center mt-4">
        <p className="text-[11px] uppercase tracking-[0.15em] text-text-tertiary mb-2">
          Resonance Junction
        </p>
        <p className="desc-text text-sm text-text-secondary leading-relaxed max-w-md mx-auto">
          {hasBoth ? (
            <>
              <span className="text-text-primary">{self.maya_totem}</span> ×{" "}
              <span className="text-text-primary">{target.maya_totem}</span>
              　的能量場交會點，將由下方生成的指令交由 Gemini 深度解析。
            </>
          ) : (
            "建議先在靈魂印記典藏館補齊雙方圖騰資訊，讓解析更精準。"
          )}
        </p>
      </div>
    </div>
  );
}
