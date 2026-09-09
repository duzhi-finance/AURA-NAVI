import { Briefcase, Check, Copy, Handshake, Heart, Home, Sparkles, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import TotemEmblem from "../components/TotemEmblem";
import { buildChakraCard } from "../lib/chakraMap";
import { computeKinFromBirthdate } from "../lib/dreamspellKin";
import { MAYA_TOTEMS } from "../lib/mayaOptions";
import { buildChakraGuidancePrompt, buildSynastryQuestionPrompt, SYNASTRY_TOPIC_GROUPS } from "../lib/promptTemplates";
import { getSelfProfile } from "../lib/store";
import {
  classifyRelationshipRole,
  computeCompositeKin,
  RELATIONSHIP_ROLE_GUIDE,
  RELATIONSHIP_ROLE_LABEL,
} from "../lib/synastry";
import { computeCurrentCycleYear, computeWavespellYears, cycleYearReminder, wavespellName } from "../lib/wavespellCycle";
import type { TalentProfile } from "../types/talent";

const COPY_FEEDBACK_MS = 1500;

const SYNASTRY_TOPIC_ICONS = [Briefcase, Heart, Home, Handshake];

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
  const currentCycleYear = useMemo(
    () => (selfProfile?.birth_date ? computeCurrentCycleYear(selfProfile.birth_date) : null),
    [selfProfile]
  );

  if (!selfProfile?.maya_kin) {
    return (
      <div>
        <PageHeader
          eyebrow="13-Year Cycle & Chakra Atlas"
          title="深度星軌模組"
          description="雙人合盤對焦、13 年生命大運提醒，與身心靈三維脈輪卡。"
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
        description="雙人合盤對焦、13 年生命大運提醒，與身心靈三維脈輪卡。"
      />

      <SynastryCard selfProfile={selfProfile} />

      <section className="mb-10">
        <h2 className="text-sm font-medium text-text-secondary mb-4">
          13 年生命大運波符｜{wavespellName(selfProfile.maya_kin)}
        </h2>
        <CycleYearReminder years={years} currentCycleYear={currentCycleYear} hasBirthDate={Boolean(selfProfile.birth_date)} />
      </section>

      <section>
        <h2 className="text-sm font-medium text-text-secondary mb-1">身心靈三維脈輪卡</h2>
        <p className="desc-text text-xs text-text-tertiary mb-4">
          本命 KIN、PSI 隱藏推動與內在女神力，各自對應的脈輪、日常調頻建議，與能量堵塞排解引導。
        </p>

        <div className="flex flex-col gap-4">
          {chakraRows.map((row) => {
            const seed = MAYA_TOTEMS.indexOf(row.totem);
            return <ChakraRowCard key={row.role} seed={seed >= 0 ? seed : 0} row={row} />;
          })}
        </div>
      </section>
    </div>
  );
}

function ChakraRowCard({ seed, row }: { seed: number; row: ReturnType<typeof buildChakraCard>[number] }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = buildChakraGuidancePrompt({
      role: row.role,
      kin: row.kin,
      totem: row.totem,
      chakra: row.chakra,
      trait: row.trait,
    });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="card-glass p-6 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <TotemEmblem seed={seed} size={32} className="text-luxe-gold shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-serif text-sm font-semibold text-text-primary">{row.role}</div>
          <div className="text-[11px] text-text-tertiary mt-0.5">
            KIN {row.kin}．{row.totem}｜{row.chakra}｜{row.earthFamily}
          </div>
        </div>
      </div>
      <p className="desc-text text-xs text-text-secondary leading-relaxed">{row.trait}</p>
      <p className="desc-text text-xs text-text-tertiary leading-relaxed border-t border-border pt-2">
        {row.roleContext}
      </p>

      <div className="rounded-xl border border-border-gold bg-bg-subtle/40 p-4 flex flex-col gap-2 mt-1">
        <p className="text-[11px] uppercase tracking-[0.15em] text-text-tertiary">脈輪能量調頻</p>
        <div className="flex flex-wrap gap-2 text-xs text-text-secondary">
          <span className="rounded-lg bg-bg border border-border px-2.5 py-1.5">香氛｜{row.attunement.scent}</span>
          <span className="rounded-lg bg-bg border border-border px-2.5 py-1.5">水晶｜{row.attunement.crystal}</span>
        </div>
        <p className="desc-text text-xs text-text-secondary leading-relaxed italic">
          肯定句：「{row.attunement.affirmation}」
        </p>
        <button onClick={handleCopy} className="btn-secondary self-start border border-border !text-xs mt-1">
          {copied ? <Check size={13} strokeWidth={1.75} /> : <Sparkles size={13} strokeWidth={1.75} />}
          {copied ? "已複製" : `請 Gemini 為我進行「${row.chakra}能量堵塞排解與自我對話」引導`}
        </button>
      </div>
    </div>
  );
}

function SynastryCard({ selfProfile }: { selfProfile: TalentProfile }) {
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
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [customQuestion, setCustomQuestion] = useState("");
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
    setSelectedQuestions([]);
    setCustomQuestion("");
    setCopied(false);
  }

  function toggleQuestion(q: string) {
    setSelectedQuestions((prev) => (prev.includes(q) ? prev.filter((item) => item !== q) : [...prev, q]));
    setCopied(false);
  }

  async function handleCopy() {
    if (!result || !selfProfile.maya_kin || !selfProfile.maya_totem) return;
    const text = buildSynastryQuestionPrompt({
      selfKin: selfProfile.maya_kin,
      selfTotem: selfProfile.maya_totem,
      partnerName: "",
      partnerKin: result.kin,
      partnerTotem: result.totem,
      roleLabel: RELATIONSHIP_ROLE_LABEL[result.role],
      roleGuide: RELATIONSHIP_ROLE_GUIDE[result.role],
      compositeKin: result.compositeKin,
      compositeTotem: result.compositeTotem,
      questions: selectedQuestions,
      customQuestion,
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
    <section className="card-glass p-4 mb-6 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Users size={16} strokeWidth={1.5} className="text-luxe-gold shrink-0" />
        <h2 className="font-serif text-sm font-semibold text-text-primary">
          雙人／職場關係合盤對焦
        </h2>
      </div>
      <p className="text-xs text-[#555555] tracking-[0.05em] -mt-1.5">
        輸入主管、客戶或任何重要關係人的生日，不需先存入典藏館，即可快速合盤。
      </p>

      <div className="flex flex-col gap-2 max-w-xs">
        <input
          type="date"
          value={partnerBirthdate}
          onChange={(e) => setPartnerBirthdate(e.target.value)}
          className="dive-input"
        />
        <button onClick={handleStart} disabled={!partnerBirthdate} className="btn-primary justify-center !py-2 disabled:opacity-40">
          開始合盤
        </button>
      </div>

      {result && (
        <div className="rounded-xl border border-border-gold bg-bg-subtle/40 p-4 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
            <TotemEmblem seed={partnerSeed >= 0 ? partnerSeed : 0} size={22} className="text-luxe-gold shrink-0" />
            <span className="rounded-lg bg-bg border border-border px-2.5 py-1.5 font-serif font-semibold">
              對方｜KIN {result.kin}
            </span>
            <TotemEmblem seed={compositeSeed >= 0 ? compositeSeed : 0} size={18} className="text-luxe-gold shrink-0 ml-1" />
            <span className="rounded-lg bg-bg border border-border px-2.5 py-1.5 font-serif font-semibold">
              合相 KIN {result.compositeKin}
            </span>
            <span className="rounded-full bg-luxe-gold/15 border border-border-gold px-3 py-1.5 font-serif font-semibold text-text-primary">
              {RELATIONSHIP_ROLE_LABEL[result.role]}
            </span>
          </div>

          <div className="flex flex-col gap-2.5 border-t border-border pt-3">
            <p className="text-[11px] uppercase tracking-[0.15em] text-text-tertiary">想深入了解哪個面向？</p>
            {SYNASTRY_TOPIC_GROUPS.map((group, idx) => {
              const Icon = SYNASTRY_TOPIC_ICONS[idx];
              return (
                <div key={group.key} className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-[#555555] shrink-0 whitespace-nowrap">
                    <Icon size={13} strokeWidth={1.5} className="text-luxe-gold" />
                    {group.label}
                  </span>
                  {group.questions.map((q) => (
                    <button
                      key={q}
                      onClick={() => toggleQuestion(q)}
                      className={`dive-chip ${selectedQuestions.includes(q) ? "is-active" : ""}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              );
            })}
            <input
              value={customQuestion}
              onChange={(e) => {
                setCustomQuestion(e.target.value);
                setCopied(false);
              }}
              placeholder="自訂想要詢問的問題"
              className="dive-input"
            />
            <button onClick={handleCopy} className="btn-secondary self-start border border-border !text-xs !py-1.5">
              {copied ? <Check size={13} strokeWidth={1.75} /> : <Copy size={13} strokeWidth={1.75} />}
              {copied ? "已複製" : "生成專屬合盤 Gemini 深度解讀 Prompt"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function CycleYearReminder({
  years,
  currentCycleYear,
  hasBirthDate,
}: {
  years: ReturnType<typeof computeWavespellYears>;
  currentCycleYear: number | null;
  hasBirthDate: boolean;
}) {
  if (!hasBirthDate || currentCycleYear === null) {
    return (
      <p className="desc-text text-xs text-text-tertiary">
        補上完整出生年月日即可看見你目前所在的生命大運年份。
        <Link to="/app/archive" className="text-text-primary underline ml-1">
          前往補填
        </Link>
      </p>
    );
  }

  const current = years.find((y) => y.year === currentCycleYear) ?? years[0];

  return (
    <div className="card-glass p-6 flex flex-col items-center text-center gap-3">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-luxe-gold text-white font-serif text-lg font-semibold shrink-0">
        {current.year}
      </span>
      <p className="text-sm text-text-primary font-medium">
        你正處於 13 年生命大運中的第 {current.year} 年｜{current.tone}．{current.totem}
      </p>
      <p className="desc-text text-sm text-text-secondary leading-relaxed max-w-md">
        {cycleYearReminder(current.year)}
      </p>

      <div className="flex items-center gap-1.5 mt-2">
        {years.map((y) => (
          <span
            key={y.year}
            title={`第 ${y.year} 年｜${y.tone}．${y.totem}`}
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-serif shrink-0 ${
              y.year === current.year
                ? "bg-luxe-gold text-white font-semibold"
                : "border border-border text-text-tertiary"
            }`}
          >
            {y.year}
          </span>
        ))}
      </div>
    </div>
  );
}
