import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { formatDateLabel, getTodayFrequency } from "../lib/dailyFrequency";
import { GLOWING_URL } from "../lib/promptTemplates";
import { getSelfProfile } from "../lib/store";
import type { TalentProfile } from "../types/talent";

export default function Dashboard() {
  const [selfProfile, setSelfProfile] = useState<TalentProfile | undefined>(undefined);
  const frequency = getTodayFrequency();

  useEffect(() => {
    setSelfProfile(getSelfProfile());
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Dashboard"
        title="星際心靈地圖"
        description="每天的第一站，掌握今日頻率，快速前往你需要的下一步。"
      />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="glass-card glow-eagle rounded-2xl p-6 flex flex-col gap-4">
          <div className="text-xs text-ink-500">{formatDateLabel()}</div>
          <div className="flex items-center gap-4">
            <span className="text-5xl animate-pulse-slow">{frequency.emoji}</span>
            <div>
              <div className={`text-2xl font-semibold ${frequency.colorClass}`}>{frequency.label}</div>
              <p className="text-sm text-ink-300 mt-1 max-w-xs">{frequency.description}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col gap-3">
          <div className="text-xs text-ink-500">今日瑪雅印記小卡</div>
          {selfProfile ? (
            <div>
              <div className="text-lg font-semibold text-ink-100">{selfProfile.name_alias}</div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-ink-300">
                <div className="rounded-lg bg-white/5 px-2 py-1.5 text-center">
                  KIN {selfProfile.maya_kin ?? "—"}
                </div>
                <div className="rounded-lg bg-white/5 px-2 py-1.5 text-center">
                  {selfProfile.maya_tone || "音調未填"}
                </div>
                <div className="rounded-lg bg-white/5 px-2 py-1.5 text-center">
                  {selfProfile.maya_totem || "圖騰未填"}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-ink-300">
              尚未建立你的天賦檔案。
              <Link to="/archive" className="text-eagle-blue underline ml-1">
                前往建立
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-medium text-ink-300 mb-3">快捷引導</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <QuickLink
            href={GLOWING_URL}
            external
            icon="🪞"
            title="取得我的瑪雅印記"
            description="前往 glowing.cc 輸入生日生成圖卡"
            accent="glow-gold"
          />
          <QuickLink
            to="/prompt-station"
            icon="⚡"
            title="一鍵生成 Gemini 導航指令"
            description="合成高維對焦 Prompt"
            accent="glow-eagle"
          />
          <QuickLink
            to="/archive"
            icon="📂"
            title="開啟 Talent DNA Archive"
            description="管理你與關係人的天賦檔案"
            accent="glow-pink"
          />
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  to,
  href,
  external,
  icon,
  title,
  description,
  accent,
}: {
  to?: string;
  href?: string;
  external?: boolean;
  icon: string;
  title: string;
  description: string;
  accent: string;
}) {
  const content = (
    <div className={`glass-card ${accent} rounded-2xl p-5 h-full flex flex-col gap-2 transition-transform hover:-translate-y-0.5`}>
      <span className="text-2xl">{icon}</span>
      <div className="text-sm font-semibold text-ink-100">{title}</div>
      <p className="text-xs text-ink-300">{description}</p>
    </div>
  );

  if (external && href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return <Link to={to ?? "/"}>{content}</Link>;
}
