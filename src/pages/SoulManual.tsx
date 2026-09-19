import { Download, Lock, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import TotemEmblem from "../components/TotemEmblem";
import AiConsultantChat from "../components/AiConsultantChat";
import { LINE_URL, UNLOCK_CODE } from "../lib/links";
import { computeKinFromBirthdate } from "../lib/dreamspellKin";
import { drawSoulCard, downloadCanvasAsPng, SOUL_CARD_WIDTH, SOUL_CARD_HEIGHT } from "../lib/soulCard";
import { MAYA_TOTEMS } from "../lib/mayaOptions";
import { computeLifePathNumber, getCard, type MajorArcanaCard } from "../lib/tarotMajorArcana";
import { excerpt, wavespellName, buildRelationshipManual, buildLandingPlans, buildWavespellGuide } from "../lib/reportText";

type Phase = "landing" | "loading" | "report";

const LOADING_MS = 1500;
const UNLOCK_PRICE = "NT$199";
const UNLOCK_STORAGE_KEY = "soul-report-unlocked";

export interface SoulReport {
  kin: number;
  tone: string;
  totem: string;
  totemSeed: number;
  wavespell: string;
  primaryCard: MajorArcanaCard;
  dualCard: MajorArcanaCard | null;
  supplementCards: MajorArcanaCard[];
}

function readUnlockedFlag(): boolean {
  try {
    return localStorage.getItem(UNLOCK_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export default function SoulManual() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [birthdate, setBirthdate] = useState("");
  const [report, setReport] = useState<SoulReport | null>(null);
  const [unlocked, setUnlocked] = useState(readUnlockedFlag);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleUnlock() {
    setUnlocked(true);
    try {
      localStorage.setItem(UNLOCK_STORAGE_KEY, "true");
    } catch {
      // best-effort persistence only
    }
  }

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
          <ReportScreen
            report={report}
            canvasRef={canvasRef}
            unlocked={unlocked}
            onUnlock={handleUnlock}
            onDownload={handleDownload}
            onRestart={() => setPhase("landing")}
          />
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
  unlocked,
  onUnlock,
  onDownload,
  onRestart,
}: {
  report: SoulReport;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  unlocked: boolean;
  onUnlock: () => void;
  onDownload: () => void;
  onRestart: () => void;
}) {
  const { primaryCard, dualCard, supplementCards } = report;
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState(false);

  function handleCodeSubmit() {
    if (codeInput.trim().toUpperCase() === UNLOCK_CODE) {
      setCodeError(false);
      onUnlock();
    } else {
      setCodeError(true);
    }
  }

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

      {/* Region C: unlocked content + locked preview */}
      <section className="flex flex-col gap-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-luxe-gold text-center">情境診斷與高維破局</p>

        {unlocked ? (
          <>
            <UnlockedSection title="親密關係使用說明書" body={buildRelationshipManual(primaryCard)} />
            <UnlockedSection
              title="天賦開掛落地方案"
              body={buildLandingPlans(primaryCard)
                .map((line, i) => `${i + 1}. ${line}`)
                .join("\n\n")}
            />
            <UnlockedSection
              title="瑪雅高維波符指引"
              body={buildWavespellGuide(report.wavespell, report.kin, report.totem)}
            />
          </>
        ) : (
          <>
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
                解鎖完整報告，取得你的親密關係地雷、3 個天賦落地方案、瑪雅波符年度指引，以及專屬 AI
                售後導航員即時問答。
              </p>
              <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="soul-btn-primary w-full max-w-xs">
                立即解鎖專屬完整報告（{UNLOCK_PRICE}）
              </a>
              <p className="text-[11px] text-[var(--sm-text-tertiary)]">點擊後將導向 LINE 洽詢解鎖方式</p>

              <div className="w-full max-w-xs flex flex-col gap-2 mt-3 pt-3 border-t border-[var(--sm-border)]">
                <label className="flex flex-col gap-1.5 text-left">
                  <span className="text-[11px] text-[var(--sm-text-tertiary)]">已付款？輸入客服提供的解鎖碼</span>
                  <input
                    value={codeInput}
                    onChange={(e) => {
                      setCodeInput(e.target.value);
                      setCodeError(false);
                    }}
                    placeholder="請輸入解鎖碼"
                    className="soul-input !py-2 !text-sm"
                  />
                </label>
                <button onClick={handleCodeSubmit} disabled={!codeInput.trim()} className="soul-btn-secondary !text-xs">
                  送出解鎖碼
                </button>
                {codeError && <p className="text-[11px] text-[#d98a8a]">解鎖碼不正確，請確認後再輸入一次。</p>}
              </div>
            </div>
          </>
        )}
      </section>

      {/* Region D: AI 售後導航員 chat, only for unlocked users */}
      {unlocked && <AiConsultantChat report={report} />}

      <button onClick={onRestart} className="soul-btn-secondary self-center !text-xs mt-2">
        重新解碼另一組生日
      </button>

      <p className="desc-text text-[10px] text-[var(--sm-text-tertiary)] text-center leading-relaxed mt-4">
        本報告結合星際瑪雅曆與生命靈數，僅供自我探索與策略參考，不能取代專業心理諮商、醫療或法律建議。資料僅於本機瀏覽器暫存，不會上傳伺服器。
      </p>
    </div>
  );
}

function UnlockedSection({ title, body }: { title: string; body: string }) {
  return (
    <div className="soul-panel p-6">
      <h3 className="text-sm font-serif font-semibold text-luxe-gold mb-2">{title}</h3>
      <p className="desc-text text-sm text-[var(--sm-text-secondary)] leading-relaxed whitespace-pre-line">{body}</p>
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
