import { ArrowRight, BookHeart, ChevronRight, ExternalLink, FolderOpen, SendHorizonal, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DailyCardDraw from "../components/DailyCardDraw";
import PageHeader from "../components/PageHeader";
import { formatBilingualDateLabel, getTodayFrequency } from "../lib/dailyFrequency";
import { GLOWING_URL } from "../lib/promptTemplates";
import { formatJournalDate, getSoulJournal, type SoulJournalEntry } from "../lib/soulJournal";
import { getSelfProfile } from "../lib/store";
import type { TalentProfile } from "../types/talent";

export default function Dashboard() {
  const navigate = useNavigate();
  const [selfProfile, setSelfProfile] = useState<TalentProfile | undefined>(undefined);
  const [journal, setJournal] = useState<SoulJournalEntry[]>([]);
  const frequency = getTodayFrequency();

  function handleBringTodayEnergy() {
    navigate("/prompt-station", {
      state: { presetContext: `今日流年：${frequency.label}` },
    });
  }

  useEffect(() => {
    setSelfProfile(getSelfProfile());
    setJournal(getSoulJournal());
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Celestial Synastry Chronograph"
        title="星軌共時儀表板"
        description="每天的第一站，掌握今日頻率，快速前往你需要的下一步。"
      />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="panel p-7 flex flex-col gap-4">
          <div className="text-xs text-text-tertiary">{formatBilingualDateLabel()}</div>
          <div className="flex items-center gap-4">
            <frequency.Icon size={36} strokeWidth={1.25} className={frequency.colorClass} />
            <div>
              <div className={`text-2xl font-serif font-semibold ${frequency.colorClass}`}>
                {frequency.label}
              </div>
              <p className="text-sm text-text-secondary mt-1.5 max-w-xs leading-relaxed">
                {frequency.description}
              </p>
            </div>
          </div>
          <button
            onClick={handleBringTodayEnergy}
            className="btn-secondary self-start border border-border"
          >
            帶入今日能量生成導航指令
            <ArrowRight size={14} strokeWidth={1.75} />
          </button>
        </div>

        <div className="panel p-7 flex flex-col gap-3">
          <div className="text-xs text-text-tertiary">今日瑪雅印記小卡</div>
          {selfProfile ? (
            <div>
              <div className="text-lg font-serif font-semibold text-text-primary">
                {selfProfile.name_alias}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-text-secondary">
                <div className="rounded-lg bg-bg border border-border px-2 py-2 text-center font-serif">
                  KIN {selfProfile.maya_kin ?? "—"}
                </div>
                <div className="rounded-lg bg-bg border border-border px-2 py-2 text-center">
                  {selfProfile.maya_tone || "音調未填"}
                </div>
                <div className="rounded-lg bg-bg border border-border px-2 py-2 text-center">
                  {selfProfile.maya_totem || "圖騰未填"}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-text-secondary">
              尚未建立你的靈魂印記。
              <Link to="/archive" className="text-text-primary underline ml-1">
                前往建立
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5">
        <DailyCardDraw />
      </div>

      {journal.length > 0 && (
        <div className="panel p-7 mt-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs text-text-tertiary">
              <BookHeart size={14} strokeWidth={1.75} />
              靈魂共振日誌
            </div>
            <Link
              to="/journal"
              className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary"
            >
              查看完整日誌
              <ChevronRight size={13} strokeWidth={1.75} />
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {journal.slice(0, 3).map((entry) => (
              <div
                key={entry.id}
                className="flex items-start justify-between gap-3 text-xs rounded-lg bg-bg border border-border px-3 py-2.5"
              >
                <div className="min-w-0">
                  <span className="text-text-primary font-medium">{entry.domainLabel}</span>
                  {entry.context && (
                    <p className="text-text-secondary mt-0.5 truncate">{entry.context}</p>
                  )}
                </div>
                <span className="text-text-tertiary shrink-0">{formatJournalDate(entry.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-sm font-medium text-text-secondary mb-4">快捷引導</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickLink
            href={GLOWING_URL}
            external
            Icon={ExternalLink}
            title="取得我的瑪雅印記"
            description="前往 glowing.cc 輸入生日生成圖卡"
          />
          <QuickLink
            to="/prompt-station"
            Icon={SendHorizonal}
            title="一鍵生成 Gemini 導航指令"
            description="合成高維對焦 Prompt"
          />
          <QuickLink
            to="/journal"
            Icon={BookHeart}
            title="開啟靈魂共振日誌"
            description="回顧每一次的個人觀照紀錄"
          />
          <QuickLink
            to="/archive"
            Icon={FolderOpen}
            title="開啟靈魂印記典藏館"
            description="管理你與關係人的靈魂印記"
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
  Icon,
  title,
  description,
}: {
  to?: string;
  href?: string;
  external?: boolean;
  Icon: LucideIcon;
  title: string;
  description: string;
}) {
  const content = (
    <div className="panel p-6 h-full flex flex-col gap-3 transition-colors hover:bg-surface-hover">
      <Icon size={22} strokeWidth={1.25} className="text-text-primary" />
      <div className="text-sm font-medium text-text-primary">{title}</div>
      <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
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
