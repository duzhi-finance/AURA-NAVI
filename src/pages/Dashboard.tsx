import { ArrowRight, BookHeart, ChevronRight, ExternalLink, FolderOpen, SendHorizonal, Sparkles, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DailyCardDraw from "../components/DailyCardDraw";
import { PullQuote, VerticalMicrocopy } from "../components/Editorial";
import PageHeader from "../components/PageHeader";
import TotemEmblem from "../components/TotemEmblem";
import { formatBilingualDateLabel, getTodayFrequency } from "../lib/dailyFrequency";
import { GLOWING_URL } from "../lib/promptTemplates";
import { getSelfProfile } from "../lib/store";
import type { TalentProfile } from "../types/talent";

export default function Dashboard() {
  const navigate = useNavigate();
  const [selfProfile, setSelfProfile] = useState<TalentProfile | undefined>(undefined);
  const frequency = getTodayFrequency();

  function handleBringTodayEnergy() {
    navigate("/app/prompt-station", {
      state: { presetContext: `今日流年：${frequency.label}` },
    });
  }

  useEffect(() => {
    setSelfProfile(getSelfProfile());
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Celestial Synastry Chronograph"
        title="星軌共時儀表板"
        description="每天的第一站，掌握今日頻率，快速前往你需要的下一步。"
        titleGradient
      />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="panel p-7 flex flex-col gap-4 relative overflow-hidden">
          <VerticalMicrocopy text="THE SOUL FREQUENCY" className="top-7 right-3" />
          <div className="text-xs text-text-tertiary">{formatBilingualDateLabel()}</div>
          <div className="flex items-center gap-4">
            <frequency.Icon size={36} strokeWidth={1.25} className={frequency.colorClass} />
            <div>
              <div className={`text-2xl font-serif font-normal ${frequency.colorClass}`}>
                {frequency.label}
              </div>
              <p className="desc-text text-sm text-text-secondary mt-1.5 max-w-xs leading-relaxed">
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
              <div className="text-lg font-serif font-normal text-text-primary">
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
              <Link to="/app/archive" className="text-text-primary underline ml-1">
                前往建立
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5">
        <DailyCardDraw />
      </div>

      <div className="mt-8 px-2 text-center">
        <PullQuote>從老鷹飛翔切換成孔雀展示：收回掌控手把，將自己活成優雅閃耀的示範者。</PullQuote>
      </div>

      <Link
        to="/app/journal"
        className="card-luxe card-halo card-hover mt-8 flex items-center gap-5 p-7 relative overflow-hidden transition-all hover:opacity-90"
      >
        <VerticalMicrocopy text="MANIFESTATION DAY" className="top-7 right-3" />
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg border border-border shrink-0">
          <BookHeart size={24} strokeWidth={1.25} className="text-luxe-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-lg font-serif text-text-primary">前往靈魂共振日記</div>
          <p className="desc-text text-sm text-text-secondary mt-0.5">查看你的歷程觀照</p>
        </div>
        <ChevronRight size={20} strokeWidth={1.5} className="text-text-tertiary shrink-0" />
      </Link>

      <div className="mt-10">
        <h2 className="text-sm font-medium text-text-secondary mb-4">快捷引導</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <QuickLink
            href={GLOWING_URL}
            external
            Icon={ExternalLink}
            title="取得我的瑪雅印記"
            description="前往 glowing.cc 輸入生日生成圖卡"
          />
          <QuickLink
            to="/app/prompt-station"
            Icon={SendHorizonal}
            title="一鍵生成 Gemini 導航指令"
            description="合成高維對焦 Prompt"
          />
          <QuickLink
            to="/app/archive"
            Icon={FolderOpen}
            title="開啟靈魂印記典藏館"
            description="管理你與關係人的靈魂印記"
          />
        </div>

        <GlowingGuideCard />
      </div>
    </div>
  );
}

function GlowingGuideCard() {
  return (
    <details className="group mt-4 rounded-xl border border-border bg-[#F5F5F3] px-5 py-4">
      <summary className="desc-text cursor-pointer text-[12px] text-[#7A7571] select-none flex items-center gap-2">
        <Sparkles size={13} strokeWidth={1.5} className="shrink-0" />
        glowing.cc 生日密碼計算機操作指南
      </summary>

      <div className="mt-4 flex flex-col gap-6">
        <GuideStepBlock
          n={1}
          title="進入計算機 & 獲取雙曆紀元"
          instructions={[
            "點擊上方連結進入 glowing.cc 生日密碼計算機。",
            "輸入你的出生年月日並點擊測算。",
            "系統會顯示雙曆紀元畫面，請截圖保存。",
          ]}
          mockLabel="雙曆紀元"
          mockValue="NS 1.16.3.6"
          mockSub="光譜白巫師年．電力鹿月"
          seed={2}
          color="#8FA9C9"
        />
        <GuideStepBlock
          n={2}
          title="找到共鳴主印記"
          instructions={[
            "在同一頁面往下滑動。",
            "找到你的「共鳴主印記」區塊。",
            "畫面會顯示 KIN 碼與主印記資訊，請截圖保存。",
          ]}
          mockLabel="共鳴主印記"
          mockValue="KIN.215"
          mockSub="共鳴．藍鷹"
          seed={5}
          color="#D98FA0"
        />
        <GuideStepBlock
          n={3}
          title="探索隱藏推動力（PSI）"
          instructions={[
            "在同一頁面繼續往下滑動。",
            "點擊「隱藏推動（PSI）」選項。",
            "畫面會跳轉至 PSI 資訊頁面，請截圖保存。",
          ]}
          mockLabel="隱藏推動 PSI"
          mockValue="KIN.58"
          mockSub="韻律．白鏡"
          seed={8}
          color="#8FA9C9"
        />
        <GuideStepBlock
          n={4}
          title="連結內在女神力"
          instructions={[
            "返回剛剛的共鳴主印記頁面。",
            "點擊「內在女神力」選項。",
            "畫面會跳轉至內在女神力資訊頁面，請截圖保存。",
          ]}
          mockLabel="內在女神力"
          mockValue="KIN.217"
          mockSub="太陽．紅地球"
          seed={11}
          color="#D6B15A"
        />

        <p className="desc-text text-[10px] text-text-tertiary border-t border-border pt-4">
          畫面為示意重製，非官方實際介面｜資料計算來源：glowing.cc，正式測算請以官網顯示結果為準。
        </p>
      </div>
    </details>
  );
}

function GuideStepBlock({
  n,
  title,
  instructions,
  mockLabel,
  mockValue,
  mockSub,
  seed,
  color,
}: {
  n: number;
  title: string;
  instructions: string[];
  mockLabel: string;
  mockValue: string;
  mockSub: string;
  seed: number;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="desc-text text-[12px] text-[#7A7571]">
        <span className="text-luxe-gold">Step {n}</span>{" "}
        <span className="text-text-primary font-medium">{title}</span>
      </div>
      <ol className="flex flex-col gap-1.5">
        {instructions.map((t, i) => (
          <li key={i} className="desc-text text-[11.5px] text-[#8A857C] leading-relaxed flex gap-2">
            <span className="text-[#C9C2B8] shrink-0">—</span>
            <span>{t}</span>
          </li>
        ))}
      </ol>
      <div className="rounded-lg bg-[#3A3936] p-4 flex flex-col gap-1.5">
        <div className="text-[10px] tracking-wide text-[#B9B3A9]">{mockLabel}</div>
        <div className="font-serif text-lg font-semibold tracking-wide text-[#F2EFE9]">
          {mockValue}
        </div>
        <div className="text-[11px] text-[#D9D3C8] font-light">{mockSub}</div>
        <div className="mt-1 flex items-center gap-2">
          <span style={{ color }}>
            <TotemEmblem seed={seed} size={28} />
          </span>
          <span className="text-[10px] text-[#8F887E]">示意畫面</span>
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
    <div className="panel card-hover p-6 h-full flex flex-col gap-3 transition-all hover:bg-surface-hover">
      <Icon size={22} strokeWidth={1.25} className="text-text-primary" />
      <div className="text-sm font-serif font-medium text-text-primary tracking-[0.05em]">
        {title}
      </div>
      {external && (
        <span className="inline-flex self-start rounded-full border border-border px-2.5 py-0.5 text-[10px] text-text-tertiary">
          [↗ 將跳轉至外部網站 glowing.cc]
        </span>
      )}
      <p className="desc-text text-xs text-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  );

  if (external && href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return <Link to={to ?? "/app"}>{content}</Link>;
}
