import { Check, Copy, RotateCcw, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import TotemEmblem from "../components/TotemEmblem";
import { buildChakraCard } from "../lib/chakraMap";
import { computeKinFromBirthdate } from "../lib/dreamspellKin";
import { MAYA_TOTEMS } from "../lib/mayaOptions";
import {
  buildAdHocGuardPrompt,
  buildYearTransitionPrompt,
  DAILY_SCENARIO_TABS,
} from "../lib/promptTemplates";
import { getSelfProfile } from "../lib/store";
import {
  classifyRelationshipRole,
  computeCompositeKin,
  RELATIONSHIP_ROLE_GUIDE,
  RELATIONSHIP_ROLE_LABEL,
} from "../lib/synastry";
import {
  computeCurrentCycleYear,
  computeWavespellYears,
  cycleYearForCalendarYear,
  wavespellName,
} from "../lib/wavespellCycle";
import type { TalentProfile } from "../types/talent";

const COPY_FEEDBACK_MS = 1500;

export default function DeepDivePage() {
  const [selfProfile, setSelfProfile] = useState<TalentProfile | undefined>(undefined);

  useEffect(() => {
    setSelfProfile(getSelfProfile());
  }, []);

  const years = useMemo(
    () => (selfProfile?.maya_kin ? computeWavespellYears(selfProfile.maya_kin) : []),
    [selfProfile]
  );
  const chakraRows = useMemo(
    () => (selfProfile?.maya_kin ? buildChakraCard(selfProfile.maya_kin) : []),
    [selfProfile]
  );

  if (!selfProfile?.maya_kin) {
    return (
      <div>
        <PageHeader
          eyebrow="13-Year Cycle & Chakra Atlas"
          title="深度星軌模組"
          description="雙人合盤對焦、13 年生命大運時間軸，與身心靈三維脈輪卡。"
        />
        <div className="panel p-12 text-center text-text-secondary">
          <p>尚未建立你的靈魂印記。</p>
          <Link to="/app/archive" className="text-text-primary underline mt-2 inline-block">
            前往建立
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="13-Year Cycle & Chakra Atlas"
        title="深度星軌模組"
        description="雙人合盤對焦、13 年生命大運時間軸，與身心靈三維脈輪卡。"
      />

      <SynastryCard selfProfile={selfProfile} />

      <DailyScenarioCard selfProfile={selfProfile} />

      <section className="mb-10">
        <h2 className="text-sm font-medium text-text-secondary mb-1">
          13 年生命大運波符｜{wavespellName(selfProfile.maya_kin)}
        </h2>
        <WavespellTimeline selfProfile={selfProfile} years={years} />
      </section>

      <section>
        <h2 className="text-sm font-medium text-text-secondary mb-1">身心靈三維脈輪卡</h2>
        <p className="desc-text text-xs text-text-tertiary mb-4">
          本命 KIN、PSI 隱藏推動與內在女神力，各自對應的脈輪與地球家族。
        </p>

        <div className="flex flex-col gap-4">
          {chakraRows.map((row) => {
            const seed = MAYA_TOTEMS.indexOf(row.totem);
            return (
              <div key={row.role} className="card-glass p-6 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <TotemEmblem seed={seed >= 0 ? seed : 0} size={32} className="text-luxe-gold shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-sm font-semibold text-text-primary">
                      {row.role}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      KIN {row.kin}．{row.totem}｜{row.chakra}｜{row.earthFamily}
                    </div>
                  </div>
                </div>
                <p className="desc-text text-xs text-text-secondary leading-relaxed mt-1">
                  {row.trait}
                </p>
                <p className="desc-text text-xs text-text-tertiary leading-relaxed border-t border-border pt-2 mt-1">
                  {row.roleContext}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SynastryCard({ selfProfile }: { selfProfile: TalentProfile }) {
  const [partnerName, setPartnerName] = useState("");
  const [partnerBirthdate, setPartnerBirthdate] = useState("");
  const [result, setResult] = useState<{
    kin: number;
    totem: string;
    tone: string;
    compositeKin: number;
    compositeTotem: string;
    compositeTone: string;
    role: ReturnType<typeof classifyRelationshipRole>;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  function handleStart() {
    const parts = partnerBirthdate.split("-").map(Number);
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n)) || !selfProfile.maya_kin) return;
    const [y, m, d] = parts;
    const partner = computeKinFromBirthdate(y, m, d);
    const composite = computeCompositeKin(selfProfile.maya_kin, partner.kin);
    const role = classifyRelationshipRole(selfProfile.maya_kin, partner.kin);
    setResult({
      kin: partner.kin,
      totem: partner.totem,
      tone: partner.tone,
      compositeKin: composite.kin,
      compositeTotem: composite.totem,
      compositeTone: composite.tone,
      role,
    });
    setCopied(false);
  }

  async function handleCopy() {
    if (!result || !selfProfile.maya_kin || !selfProfile.maya_totem) return;
    const text = buildAdHocGuardPrompt({
      selfKin: selfProfile.maya_kin,
      selfTotem: selfProfile.maya_totem,
      partnerName,
      partnerKin: result.kin,
      partnerTotem: result.totem,
      roleLabel: RELATIONSHIP_ROLE_LABEL[result.role],
      roleGuide: RELATIONSHIP_ROLE_GUIDE[result.role],
      compositeKin: result.compositeKin,
      compositeTotem: result.compositeTotem,
    });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
    } catch {
      setCopied(false);
    }
  }

  const partnerSeed = result ? MAYA_TOTEMS.indexOf(result.totem) : -1;
  const compositeSeed = result ? MAYA_TOTEMS.indexOf(result.compositeTotem) : -1;

  return (
    <section className="card-glass p-6 mb-6 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Users size={16} strokeWidth={1.5} className="text-luxe-gold shrink-0" />
        <h2 className="font-serif text-sm font-semibold text-text-primary">
          雙人／職場關係合盤對焦
        </h2>
      </div>
      <p className="desc-text text-xs text-text-tertiary -mt-2">
        輸入主管、客戶或任何重要關係人的生日，不需先存入典藏館，即可快速合盤。
      </p>

      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <input
          value={partnerName}
          onChange={(e) => setPartnerName(e.target.value)}
          placeholder="對象名稱（如：主管）"
          className="input-base"
        />
        <input
          type="date"
          value={partnerBirthdate}
          onChange={(e) => setPartnerBirthdate(e.target.value)}
          className="input-base"
        />
        <button onClick={handleStart} disabled={!partnerBirthdate} className="btn-primary justify-center disabled:opacity-40">
          開始合盤
        </button>
      </div>

      {result && (
        <div className="rounded-xl border border-border-gold bg-bg-subtle/40 p-5 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <TotemEmblem seed={partnerSeed >= 0 ? partnerSeed : 0} size={28} className="text-luxe-gold shrink-0" />
            <div className="text-xs text-text-secondary">
              <span className="text-text-tertiary">{partnerName.trim() || "對方"}的本命：</span>
              <span className="font-serif font-semibold text-text-primary">KIN {result.kin}</span> {result.totem}．{result.tone}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
            <TotemEmblem seed={compositeSeed >= 0 ? compositeSeed : 0} size={18} className="text-luxe-gold shrink-0" />
            <span className="rounded-lg bg-bg border border-border px-2.5 py-1.5 font-serif font-semibold">
              合相印記 KIN {result.compositeKin}
            </span>
            <span className="rounded-lg bg-bg border border-border px-2.5 py-1.5">
              {result.compositeTotem}．{result.compositeTone}
            </span>
            <span className="rounded-full bg-luxe-gold/15 border border-border-gold px-3 py-1.5 font-serif font-semibold text-text-primary">
              {RELATIONSHIP_ROLE_LABEL[result.role]}
            </span>
          </div>

          <p className="desc-text text-sm text-text-secondary leading-relaxed">
            {RELATIONSHIP_ROLE_GUIDE[result.role]}
          </p>

          <button onClick={handleCopy} className="btn-secondary self-start border border-border !text-xs">
            {copied ? <Check size={13} strokeWidth={1.75} /> : <Copy size={13} strokeWidth={1.75} />}
            {copied ? "已複製" : "一鍵複製：職場溝通防雷與攻心 Prompt"}
          </button>
        </div>
      )}
    </section>
  );
}

function DailyScenarioCard({ selfProfile }: { selfProfile: TalentProfile }) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const now = new Date();
  const todayKin = computeKinFromBirthdate(now.getFullYear(), now.getMonth() + 1, now.getDate());

  const activeTab = DAILY_SCENARIO_TABS.find((t) => t.key === activeKey) ?? null;
  const text =
    activeTab && selfProfile.maya_kin && selfProfile.maya_totem
      ? activeTab.buildText({
          selfKin: selfProfile.maya_kin,
          selfTotem: selfProfile.maya_totem,
          todayKin: todayKin.kin,
          todayTotem: todayKin.totem,
        })
      : "";

  async function handleCopy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="card-glass p-6 mb-10 flex flex-col gap-4">
      <h2 className="font-serif text-sm font-semibold text-text-primary">今日情境與流日對焦</h2>
      <div className="flex flex-wrap gap-2">
        {DAILY_SCENARIO_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveKey(tab.key);
              setCopied(false);
            }}
            className={`rounded-full px-3.5 py-1.5 text-xs border transition-colors ${
              activeKey === tab.key
                ? "border-text-primary bg-bg text-text-primary font-medium"
                : "border-border text-text-secondary hover:border-text-tertiary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab && (
        <div className="rounded-xl border border-border bg-bg-subtle/40 p-4 flex flex-col gap-3">
          <p className="desc-text text-sm text-text-secondary leading-relaxed">{text}</p>
          <button onClick={handleCopy} className="btn-secondary self-start border border-border !text-xs">
            {copied ? <Check size={13} strokeWidth={1.75} /> : <Copy size={13} strokeWidth={1.75} />}
            {copied ? "已複製" : "複製 Gemini 導航指令"}
          </button>
        </div>
      )}
    </section>
  );
}

function WavespellTimeline({
  selfProfile,
  years,
}: {
  selfProfile: TalentProfile;
  years: ReturnType<typeof computeWavespellYears>;
}) {
  const defaultYear = useMemo(
    () => (selfProfile.birth_date ? computeCurrentCycleYear(selfProfile.birth_date) : null),
    [selfProfile.birth_date]
  );
  const currentCalendarYear = new Date().getFullYear();
  const [calendarYear, setCalendarYear] = useState(currentCalendarYear);
  const [copiedYear, setCopiedYear] = useState<number | null>(null);

  const selectedCycleYear = selfProfile.birth_date
    ? cycleYearForCalendarYear(selfProfile.birth_date, calendarYear)
    : defaultYear;

  async function handleCopyYearPrompt(y: (typeof years)[number]) {
    if (!selfProfile.maya_kin || !selfProfile.maya_totem) return;
    const text = buildYearTransitionPrompt({
      selfKin: selfProfile.maya_kin,
      selfTotem: selfProfile.maya_totem,
      cycleYear: y.year,
      yearTone: y.tone,
      yearTotem: y.totem,
      yearKin: y.kin,
      coreLesson: y.coreLesson,
      breakthrough: y.breakthrough,
    });
    try {
      await navigator.clipboard.writeText(text);
      setCopiedYear(y.year);
      setTimeout(() => setCopiedYear((v) => (v === y.year ? null : v)), COPY_FEEDBACK_MS);
    } catch {
      setCopiedYear(null);
    }
  }

  return (
    <>
      {selfProfile.birth_date ? (
        <div className="flex items-center gap-2 mb-4">
          <label className="desc-text text-xs text-text-tertiary" htmlFor="cycle-year-input">
            選擇西元年份
          </label>
          <input
            id="cycle-year-input"
            type="number"
            value={calendarYear}
            onChange={(e) => setCalendarYear(Number(e.target.value) || currentCalendarYear)}
            className="input-base !w-28 !py-1.5"
          />
          <button
            onClick={() => setCalendarYear(currentCalendarYear)}
            className="btn-secondary border border-border !text-xs"
          >
            <RotateCcw size={12} strokeWidth={1.75} />
            回到目前個人流年
          </button>
        </div>
      ) : (
        <p className="desc-text text-xs text-text-tertiary mb-4">
          補上完整出生年月日即可選擇年份查看你所在的位置。
          <Link to="/app/archive" className="text-text-primary underline ml-1">
            前往補填
          </Link>
        </p>
      )}

      <div className="flex flex-col gap-2.5">
        {years.map((y) => {
          const seed = MAYA_TOTEMS.indexOf(y.totem);
          const isSelected = selectedCycleYear === y.year;
          return (
            <details
              key={y.year}
              open={isSelected}
              className={`rounded-xl border px-4 py-3 ${
                isSelected ? "border-luxe-gold bg-bg-subtle/50" : "border-border"
              }`}
            >
              <summary className="cursor-pointer select-none flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-serif font-semibold shrink-0 ${
                    isSelected ? "bg-luxe-gold text-white" : "bg-bg border border-border text-text-secondary"
                  }`}
                >
                  {y.year}
                </span>
                <TotemEmblem seed={seed >= 0 ? seed : 0} size={20} className="text-luxe-gold shrink-0" />
                <span className="text-sm text-text-primary font-medium flex-1">
                  第 {y.year} 年｜{y.tone}．{y.totem}
                </span>
                <span className="text-[11px] text-text-tertiary font-serif">KIN {y.kin}</span>
              </summary>
              <div className="mt-3 pl-11 flex flex-col gap-2.5">
                <div className="text-xs">
                  <span className="text-text-tertiary">核心學習課題：</span>
                  <span className="desc-text text-text-secondary">{y.coreLesson}</span>
                </div>
                <div className="text-xs">
                  <span className="text-text-tertiary">突破亮點：</span>
                  <span className="desc-text text-text-secondary">{y.breakthrough}</span>
                </div>
                <button
                  onClick={() => handleCopyYearPrompt(y)}
                  className="btn-secondary self-start border border-border !text-xs mt-1"
                >
                  {copiedYear === y.year ? (
                    <Check size={13} strokeWidth={1.75} />
                  ) : (
                    <Copy size={13} strokeWidth={1.75} />
                  )}
                  {copiedYear === y.year ? "已複製" : "生成該年度轉型關鍵策略 Prompt"}
                </button>
              </div>
            </details>
          );
        })}
      </div>
    </>
  );
}
