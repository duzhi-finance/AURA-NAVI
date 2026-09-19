import { Download, Lock, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import TotemEmblem from "../components/TotemEmblem";
import { LINE_URL } from "../lib/links";
import { computeKinFromBirthdate } from "../lib/dreamspellKin";
import { drawSoulCard, downloadCanvasAsPng, SOUL_CARD_WIDTH, SOUL_CARD_HEIGHT } from "../lib/soulCard";
import { MAYA_TOTEMS } from "../lib/mayaOptions";
import { computeLifePathNumber, getCard, type MajorArcanaCard } from "../lib/tarotMajorArcana";

type Phase = "landing" | "loading" | "report";

const LOADING_MS = 1500;
const UNLOCK_PRICE = "NT$199";

interface SoulReport {
  kin: number;
  tone: string;
  totem: string;
  totemSeed: number;
  wavespell: string;
  primaryCard: MajorArcanaCard;
  dualCard: MajorArcanaCard | null;
  supplementCards: MajorArcanaCard[];
}

function excerpt(text: string, maxLen: number): string {
  const firstClause = text.split(/[、。]/)[0] ?? text;
  if (firstClause.length <= maxLen) return firstClause;
  return `${firstClause.slice(0, maxLen)}…`;
}

function wavespellName(kin: number): string {
  const kinIndex0 = kin - 1;
  const wavespellStart0 = kinIndex0 - (kinIndex0 % 13);
  return `${MAYA_TOTEMS[wavespellStart0 % 20]}波符`;
}

function buildRelationshipManual(card: MajorArcanaCard): string {
  return `你在親密關係中最容易感到「躁」的原因，來自${card.name}特質中的：${excerpt(card.disadvantage, 40)}。

地雷區：當你不自覺地陷入這個模式時，最容易讓親密的人感到不解或受傷，也是最常被誤會的時刻。

白話相處指南：對方需要明白，你的優勢其實是「${excerpt(card.advantage, 32)}」——只要給你多一點空間去發揮這個特質，你反而會展現出最好的一面。`;
}

function buildLandingPlans(card: MajorArcanaCard): string[] {
  return [
    `辨認出你的核心天賦：「${excerpt(card.advantage, 36)}」，刻意在工作中創造能發揮它的場景，而不是等機會自己出現。`,
    `留意你的內耗盲點：「${excerpt(card.disadvantage, 36)}」，建立一個提醒自己踩煞車的機制，例如固定時間覆盤。`,
    `本週先做一件事：找一個能讓你發揮${card.name}特質、又不會踩到盲點的小任務，練習「優雅發揮天賦」而不是「用蠻力硬撐」。`,
  ];
}

function buildWavespellGuide(wavespell: string, kin: number, totem: string): string {
  return `你的年度能量轉化鑰匙，來自「${wavespell}」的底色——這股力量與你 KIN ${kin}．${totem} 的本命特質彼此呼應，是你這一年最該留意的隱藏節奏。

當你感覺卡關、內耗時，回到「${totem}」最純粹的樣子，就是你重新校準高維頻率的方式。`;
}

export default function SoulManual() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [birthdate, setBirthdate] = useState("");
  const [report, setReport] = useState<SoulReport | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleDecode() {
    const parts = birthdate.split("-").map(Number);
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return;
    const [y, m, d] = parts;

    setPhase("loading");
    setTimeout(() => {
      const kinResult = computeKinFromBirthdate(y, m, d);
      const lifePath = computeLifePathNumber(y, m, d);
      const totemSeed = MAYA_TOTEMS.indexOf(kinResult.totem);

      setReport({
        kin: kinResult.kin,
        tone: kinResult.tone,
        totem: kinResult.totem,
        totemSeed: totemSeed >= 0 ? totemSeed : 0,
        wavespell: wavespellName(kinResult.kin),
        primaryCard: getCard(lifePath.primary),
        dualCard: lifePath.dualNumber != null ? getCard(lifePath.dualNumber) : null,
        supplementCards: lifePath.supplementChain.slice(1).map(getCard),
      });
      setPhase("report");
    }, LOADING_MS);
  }

  useEffect(() => {
    if (phase !== "report" || !report || !canvasRef.current) return;
    let cancelled = false;
    (async () => {
      if (document.fonts?.ready) await document.fonts.ready;
      if (cancelled || !canvasRef.current) return;
      drawSoulCard(canvasRef.current, {
        cardNumber: report.primaryCard.number,
        cardName: report.primaryCard.name,
        totem: report.totem,
        totemSeed: report.totemSeed,
        kin: report.kin,
        quote: excerpt(report.primaryCard.advantage, 40),
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [phase, report]);

  async function handleDownload() {
    if (!canvasRef.current) return;
    await downloadCanvasAsPng(canvasRef.current, "aura-navi-soul-card");
  }

  return (
    <div className="soul-manual">
      <div className="mx-auto w-full max-w-xl px-5 py-14">
        {phase === "landing" && <LandingScreen birthdate={birthdate} setBirthdate={setBirthdate} onDecode={handleDecode} />}
        {phase === "loading" && <LoadingScreen />}
        {phase === "report" && report && (
          <ReportScreen report={report} canvasRef={canvasRef} onDownload={handleDownload} onRestart={() => setPhase("landing")} />
        )}
      </div>
    </div>
  );
}

function LandingScreen({
  birthdate,
  setBirthdate,
  onDecode,
}: {
  birthdate: string;
  setBirthdate: (v: string) => void;
  onDecode: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-8 min-h-[80vh] justify-center">
      <div className="flex items-center gap-2 text-[var(--sm-text-tertiary)] text-xs uppercase tracking-[0.3em]">
        <Sparkles size={14} strokeWidth={1.5} className="text-luxe-gold" />
        AURA · NAVI
      </div>
      <h1 className="font-serif text-3xl md:text-4xl font-medium leading-snug">
        全方位個人
        <br />
        靈魂使用說明書
      </h1>
      <p className="desc-text text-sm text-[var(--sm-text-secondary)] leading-relaxed max-w-sm">
        只需要你的西元出生年月日，結合塔羅大牌命數與瑪雅曆 KIN 碼雙系統，為你解碼專屬的天賦與內耗盲點。
      </p>

      <div className="soul-panel p-6 w-full max-w-xs flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-left">
          <span className="text-xs text-[var(--sm-text-tertiary)]">西元出生年月日</span>
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="soul-input"
          />
        </label>
        <button onClick={onDecode} disabled={!birthdate} className="soul-btn-primary">
          開啟靈魂解碼
        </button>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 min-h-[80vh]">
      <div className="flex gap-2">
        <span className="soul-pulse-dot h-2.5 w-2.5 rounded-full bg-luxe-gold" style={{ animationDelay: "0s" }} />
        <span className="soul-pulse-dot h-2.5 w-2.5 rounded-full bg-luxe-gold" style={{ animationDelay: "0.2s" }} />
        <span className="soul-pulse-dot h-2.5 w-2.5 rounded-full bg-luxe-gold" style={{ animationDelay: "0.4s" }} />
      </div>
      <p className="desc-text text-sm text-[var(--sm-text-secondary)] tracking-[0.1em]">
        正在校準你的高維頻率...
      </p>
    </div>
  );
}

function ReportScreen({
  report,
  canvasRef,
  onDownload,
  onRestart,
}: {
  report: SoulReport;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onDownload: () => void;
  onRestart: () => void;
}) {
  const { primaryCard, dualCard, supplementCards } = report;

  return (
    <div className="flex flex-col gap-10">
      {/* Region A: soul card */}
      <section className="flex flex-col items-center gap-4">
        <div className="w-full max-w-[300px] rounded-2xl overflow-hidden border border-[var(--sm-border)] shadow-2xl">
          <canvas
            ref={canvasRef}
            width={SOUL_CARD_WIDTH}
            height={SOUL_CARD_HEIGHT}
            className="w-full h-auto block"
          />
        </div>
        <button onClick={onDownload} className="soul-btn-secondary !text-xs">
          <Download size={14} strokeWidth={1.75} />
          一鍵保存專屬圖卡
        </button>
      </section>

      {/* Region B: free */}
      <section className="soul-panel p-6 flex flex-col gap-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-luxe-gold mb-2">靈魂特質與能量解碼</p>
          <h2 className="font-serif text-xl font-medium">
            命數 {primaryCard.number}．{primaryCard.name}
          </h2>
          {(dualCard || supplementCards.length > 0) && (
            <p className="desc-text text-xs text-[var(--sm-text-tertiary)] mt-1.5">
              {dualCard && `同時帶有「${dualCard.number} ${dualCard.name}」的雙重特質`}
              {supplementCards.length > 0 &&
                `延伸參考牌卡：${supplementCards.map((c) => `${c.number} ${c.name}`).join("、")}`}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-serif font-semibold text-luxe-gold mb-1.5">核心天賦優勢</h3>
          <p className="desc-text text-sm text-[var(--sm-text-secondary)] leading-relaxed">{primaryCard.advantage}</p>
        </div>

        <div>
          <h3 className="text-sm font-serif font-semibold text-luxe-gold mb-1.5">隱藏內耗盲點</h3>
          <p className="desc-text text-sm text-[var(--sm-text-secondary)] leading-relaxed">{primaryCard.disadvantage}</p>
        </div>
      </section>

      {/* Region C: locked */}
      <section className="flex flex-col gap-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-luxe-gold text-center">情境診斷與高維破局</p>

        <LockedSection title="親密關係使用說明書" body={buildRelationshipManual(primaryCard)} />
        <LockedSection
          title="天賦開掛落地方案"
          body={buildLandingPlans(primaryCard)
            .map((line, i) => `${i + 1}. ${line}`)
            .join("\n\n")}
        />
        <LockedSection
          title="瑪雅高維波符指引"
          body={buildWavespellGuide(report.wavespell, report.kin, report.totem)}
        />

        <div className="soul-panel p-6 flex flex-col items-center text-center gap-3 mt-2">
          <TotemEmblem seed={report.totemSeed} size={40} className="text-luxe-gold" />
          <p className="desc-text text-sm text-[var(--sm-text-secondary)] leading-relaxed max-w-sm">
            解鎖完整報告，取得你的親密關係地雷、3 個天賦落地方案，與瑪雅波符年度指引。
          </p>
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="soul-btn-primary w-full max-w-xs">
            立即解鎖專屬完整報告（{UNLOCK_PRICE}）
          </a>
          <p className="text-[11px] text-[var(--sm-text-tertiary)]">點擊後將導向 LINE 洽詢解鎖方式</p>
        </div>
      </section>

      <button onClick={onRestart} className="soul-btn-secondary self-center !text-xs mt-2">
        重新解碼另一組生日
      </button>

      <p className="desc-text text-[10px] text-[var(--sm-text-tertiary)] text-center leading-relaxed mt-4">
        本報告結合星際瑪雅曆與生命靈數，僅供自我探索與策略參考，不能取代專業心理諮商、醫療或法律建議。資料僅於本機瀏覽器暫存，不會上傳伺服器。
      </p>
    </div>
  );
}

function LockedSection({ title, body }: { title: string; body: string }) {
  return (
    <div className="soul-panel p-6 relative overflow-hidden min-h-[180px]">
      <div className="soul-locked-content">
        <h3 className="text-sm font-serif font-semibold text-luxe-gold mb-2">{title}</h3>
        <p className="desc-text text-sm text-[var(--sm-text-secondary)] leading-relaxed whitespace-pre-line">{body}</p>
      </div>
      <div className="soul-locked-overlay">
        <Lock size={20} strokeWidth={1.5} className="text-luxe-gold" />
        <p className="text-xs text-[var(--sm-text-secondary)]">{title}｜解鎖後可見</p>
      </div>
    </div>
  );
}
