import { ArrowRight, BookHeart, Check, ChevronRight, Copy, ExternalLink, FolderOpen, Layers, Lock, SendHorizonal, Sparkles, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DailyCardDraw from "../components/DailyCardDraw";
import { PullQuote, VerticalMicrocopy } from "../components/Editorial";
import OnboardingStepper from "../components/OnboardingStepper";
import PageHeader from "../components/PageHeader";
import TotemEmblem from "../components/TotemEmblem";
import { formatBilingualDateLabel, getTodayFrequency } from "../lib/dailyFrequency";
import { buildTalentOneLiner, computeDeepTalent } from "../lib/deepTalent";
import { computeGoddessKin, computeKinFromBirthdate, computePsiKin, kinToResult } from "../lib/dreamspellKin";
import { buildFullProfileSummary, GLOWING_URL } from "../lib/promptTemplates";
import { createProfileId, getSelfProfile, saveProfile } from "../lib/store";
import { MAYA_TOTEMS } from "../lib/mayaOptions";
import {
  computeDailyStrategy,
  computeYearlyKin,
  parseBirthMonthDay,
} from "../lib/yearlyFlow";
import type { TalentProfile } from "../types/talent";

const COPY_FEEDBACK_MS = 1500;
const SPOTLIGHT_DURATION_MS = 5000;

export default function Dashboard() {
  const navigate = useNavigate();
  const [selfProfile, setSelfProfile] = useState<TalentProfile | undefined>(undefined);
  const [birthdateInput, setBirthdateInput] = useState("");
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedDailyFocus, setCopiedDailyFocus] = useState(false);
  const promptStationRef = useRef<HTMLDivElement>(null);
  const frequency = getTodayFrequency();
  const now = new Date();
  const todayKin = computeKinFromBirthdate(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const todaySeed = MAYA_TOTEMS.indexOf(todayKin.totem);

  const hasBirthDate = Boolean(selfProfile?.birth_date);
  const psiResult = selfProfile?.maya_kin ? kinToResult(computePsiKin(selfProfile.maya_kin)) : null;
  const goddessResult = selfProfile?.maya_kin ? kinToResult(computeGoddessKin(selfProfile.maya_kin)) : null;

  const birthMonthDay = selfProfile?.birth_date ? parseBirthMonthDay(selfProfile.birth_date) : null;
  const yearlyKin = birthMonthDay ? computeYearlyKin(birthMonthDay.month, birthMonthDay.day) : null;
  const dailyStrategy = yearlyKin ? computeDailyStrategy(yearlyKin.kin, todayKin.kin) : null;

  function handleUnlock() {
    const parts = birthdateInput.split("-").map(Number);
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return;
    const [y, m, d] = parts;
    const kinResult = computeKinFromBirthdate(y, m, d);
    const deepTalent = computeDeepTalent(kinResult.kin - 1);
    const updated: TalentProfile = {
      profile_id: selfProfile?.profile_id ?? createProfileId(),
      profile_type: selfProfile?.profile_type ?? "自己",
      is_self: true,
      name_alias: selfProfile?.name_alias ?? "自己",
      birth_date: birthdateInput,
      maya_kin: kinResult.kin,
      maya_tone: kinResult.tone,
      maya_totem: kinResult.totem,
      life_path_num: selfProfile?.life_path_num ?? null,
      core_traits_tags: selfProfile?.core_traits_tags ?? [],
      relationship_notes: selfProfile?.relationship_notes ?? "",
      ...deepTalent,
      created_at: selfProfile?.created_at ?? new Date().toISOString(),
    };
    saveProfile(updated);
    setSelfProfile(updated);
    setJustUnlocked(true);
  }

  useEffect(() => {
    if (!justUnlocked) return;
    const scrollTimer = setTimeout(() => {
      promptStationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 650);
    const dismissTimer = setTimeout(() => setJustUnlocked(false), SPOTLIGHT_DURATION_MS);
    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(dismissTimer);
    };
  }, [justUnlocked]);

  function handleBringTodayEnergy() {
    const presetContext = selfProfile?.maya_totem
      ? `我今天是「${selfProfile.maya_totem}」，面對今天的「${todayKin.totem}」能量（KIN ${todayKin.kin}．${todayKin.tone}），我的提案／溝通策略該如何調頻？`
      : `今日能量：KIN ${todayKin.kin}．${todayKin.totem}（${frequency.label}）`;
    navigate("/app/prompt-station", { state: { presetContext } });
  }

  async function handleCopySummary() {
    if (!selfProfile) return;
    try {
      await navigator.clipboard.writeText(buildFullProfileSummary(selfProfile));
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), COPY_FEEDBACK_MS);
    } catch {
      setCopiedSummary(false);
    }
  }

  async function handleCopyDailyFocus() {
    if (!selfProfile || !yearlyKin || !dailyStrategy) return;
    const text = `我的本命是「${selfProfile.maya_totem}」（KIN ${selfProfile.maya_kin}），今年流年是「${yearlyKin.totem}」（KIN ${yearlyKin.kin}），今天的日流是「${todayKin.totem}」（KIN ${todayKin.kin}）。
今天判定為「${dailyStrategy.label}」：${dailyStrategy.description}
請根據以上疊加的能量屬性，給我今天在職場上最適合採取的具體行動與應對策略。`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedDailyFocus(true);
      setTimeout(() => setCopiedDailyFocus(false), COPY_FEEDBACK_MS);
    } catch {
      setCopiedDailyFocus(false);
    }
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

      <OnboardingStepper currentStep={hasBirthDate ? 2 : 1} />

      {!hasBirthDate ? (
        <div className="card-glass p-8 mb-8 flex flex-col items-center text-center gap-4 max-w-lg mx-auto">
          <span className="text-luxe-gold text-2xl">✦</span>
          <h1 className="font-serif text-xl font-semibold text-text-primary">
            第一步：輸入生日，取得你的瑪雅靈魂印記
          </h1>
          <p className="desc-text text-sm text-text-secondary leading-relaxed max-w-sm">
            只需要 3 秒鐘，鎖定你的本命 KIN 碼、PSI 隱藏天賦與內在女神力。
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
            <input
              type="date"
              value={birthdateInput}
              onChange={(e) => setBirthdateInput(e.target.value)}
              className="dive-input text-center"
            />
            <button
              onClick={handleUnlock}
              disabled={!birthdateInput}
              className="btn-primary justify-center disabled:opacity-40"
            >
              解鎖我的靈魂天賦
              <ArrowRight size={16} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      ) : (
        selfProfile?.maya_kin != null && (
          <div className="card-glass p-6 mb-8 animate-reveal">
            <p className="text-[11px] uppercase tracking-[0.15em] text-text-tertiary mb-3">
              天賦解密總覽
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-bg border border-border px-2 py-3">
                <div className="text-[10px] text-text-tertiary mb-1">本命 KIN</div>
                <div className="font-serif font-semibold text-text-primary text-sm">
                  KIN {selfProfile.maya_kin}
                </div>
                <div className="text-[10px] text-text-tertiary mt-0.5">{selfProfile.maya_totem}</div>
              </div>
              <div className="rounded-xl bg-bg border border-border px-2 py-3">
                <div className="text-[10px] text-text-tertiary mb-1">PSI 隱藏推動</div>
                <div className="font-serif font-semibold text-text-primary text-sm">
                  KIN {psiResult?.kin ?? "—"}
                </div>
                <div className="text-[10px] text-text-tertiary mt-0.5">{psiResult?.totem}</div>
              </div>
              <div className="rounded-xl bg-bg border border-border px-2 py-3">
                <div className="text-[10px] text-text-tertiary mb-1">內在女神力</div>
                <div className="font-serif font-semibold text-text-primary text-sm">
                  KIN {goddessResult?.kin ?? "—"}
                </div>
                <div className="text-[10px] text-text-tertiary mt-0.5">{goddessResult?.totem}</div>
              </div>
            </div>
            <p className="desc-text text-sm text-text-primary leading-relaxed mt-4">
              {buildTalentOneLiner(selfProfile.maya_kin - 1)}
            </p>
          </div>
        )
      )}

      <div className={`relative ${!hasBirthDate ? "pointer-events-none select-none" : ""}`}>
        {!hasBirthDate && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl bg-bg/70 backdrop-blur-[2px]">
            <Lock size={20} strokeWidth={1.5} className="text-text-tertiary" />
            <p className="desc-text text-xs text-text-tertiary">完成第一步即可解鎖</p>
          </div>
        )}
        <div className={!hasBirthDate ? "opacity-30" : ""}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="panel p-7 flex flex-col gap-4 relative overflow-hidden">
          <VerticalMicrocopy text="THE SOUL FREQUENCY" className="top-7 right-3" />
          <div className="text-xs text-text-tertiary">{formatBilingualDateLabel()}</div>
          <div className="flex items-center gap-4">
            <frequency.Icon size={36} strokeWidth={1.25} className={frequency.colorClass} />
            <div>
              <div className={`text-2xl font-serif font-medium ${frequency.colorClass}`}>
                {frequency.label}
              </div>
              <p className="desc-text text-sm text-text-secondary mt-1.5 max-w-xs leading-relaxed">
                {frequency.description}
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-border-gold bg-bg-subtle/60 px-3 py-1.5 text-xs text-text-secondary">
            <TotemEmblem seed={todaySeed >= 0 ? todaySeed : 0} size={16} className="text-luxe-gold shrink-0" />
            <span>
              今日能量：<span className="font-serif font-semibold text-text-primary">KIN {todayKin.kin}</span>{" "}
              {todayKin.totem}．{todayKin.tone}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-serif font-semibold text-text-primary">每日商業與行動黃金曆</h3>
            <p className="desc-text text-xs text-text-secondary mt-1">
              今天適合談判簽約、提案簡報，還是適合靜心思考？
            </p>
          </div>

          {yearlyKin && dailyStrategy ? (
            <div className="rounded-xl border border-border bg-bg-subtle/40 px-4 py-3 flex flex-col gap-1.5">
              <div className="text-[11px] text-text-tertiary">
                今年流年：<span className="font-serif font-semibold text-text-primary">KIN {yearlyKin.kin}</span> {yearlyKin.totem}．{yearlyKin.tone}
              </div>
              <div className="text-[11px] text-text-tertiary">
                今日商業策略：<span className="font-serif font-semibold text-luxe-gold">{dailyStrategy.label}</span>
              </div>
              <p className="desc-text text-xs text-text-secondary leading-relaxed">
                {dailyStrategy.description}
              </p>
              <button
                onClick={handleCopyDailyFocus}
                className="btn-secondary self-start border border-border mt-1 !text-xs"
              >
                {copiedDailyFocus ? <Check size={13} strokeWidth={1.75} /> : <Copy size={13} strokeWidth={1.75} />}
                {copiedDailyFocus ? "已複製" : "一鍵複製今日對焦 Prompt"}
              </button>
            </div>
          ) : selfProfile ? (
            <p className="desc-text text-[11px] text-text-tertiary">
              補上你的出生年月日，即可解鎖流年疊加的每日商業策略對焦。
              <Link to="/app/archive" className="text-text-primary underline ml-1">
                前往補填
              </Link>
            </p>
          ) : null}

          <button
            onClick={handleBringTodayEnergy}
            className="btn-secondary self-start border border-border"
          >
            開啟今日職場策略對話
            <ArrowRight size={14} strokeWidth={1.75} />
          </button>
        </div>

        <div className="panel p-7 flex flex-col gap-3">
          {selfProfile ? (
            <div>
              <div className="text-xs text-text-tertiary">歡迎回來</div>
              <div className="text-lg font-serif font-medium text-text-primary mt-1">
                {selfProfile.name_alias}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-text-secondary">
                <div className="rounded-lg bg-bg border border-border px-2 py-2 text-center font-serif font-semibold">
                  KIN {selfProfile.maya_kin ?? "—"}
                </div>
                <div className="rounded-lg bg-bg border border-border px-2 py-2 text-center">
                  {selfProfile.maya_tone || "音調未填"}
                </div>
                <div className="rounded-lg bg-bg border border-border px-2 py-2 text-center">
                  {selfProfile.maya_totem || "圖騰未填"}
                </div>
              </div>
              <button
                onClick={handleCopySummary}
                className="btn-secondary self-start border border-border mt-3 !text-xs"
              >
                {copiedSummary ? <Check size={13} strokeWidth={1.75} /> : <Copy size={13} strokeWidth={1.75} />}
                {copiedSummary ? "已複製" : "複製完整星軌檔案"}
              </button>
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickLink
            href={GLOWING_URL}
            external
            Icon={ExternalLink}
            title="取得我的瑪雅印記"
            description="前往 glowing.cc 輸入生日生成圖卡"
          />
          <div
            ref={promptStationRef}
            className={`relative rounded-2xl ${justUnlocked ? "animate-spotlight ring-2 ring-luxe-gold" : ""}`}
          >
            {justUnlocked && (
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap rounded-full bg-luxe-gold text-white text-[11px] px-3 py-1.5 shadow-lg">
                接下來請點擊這裡生成你的 AI 指令！
              </div>
            )}
            <QuickLink
              to="/app/prompt-station"
              Icon={SendHorizonal}
              title="一鍵生成 Gemini 導航指令"
              description="合成高維對焦 Prompt"
            />
          </div>
          <QuickLink
            to="/app/archive"
            Icon={FolderOpen}
            title="開啟靈魂印記典藏館"
            description="管理你與關係人的靈魂印記"
          />
          <QuickLink
            to="/app/deep-dive"
            Icon={Layers}
            title="天賦與人生大運圖譜"
            description="看清人生階段，找回職場優勢"
          />
        </div>

        <GlowingGuideCard />
      </div>
        </div>
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
          title="找到共鳴主印記（職場核心天賦）"
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
          title="探索隱藏推動力（PSI，潛意識爆發力）"
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
          title="連結內在女神力（情緒修復電池）"
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
