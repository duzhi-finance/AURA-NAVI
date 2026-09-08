import { BookHeart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import CopyPromptBlock from "../components/CopyPromptBlock";
import GeminiButton from "../components/GeminiButton";
import PageHeader from "../components/PageHeader";
import Toast from "../components/Toast";
import { getTodayCard } from "../lib/dailyCard";
import {
  LIFE_DOMAIN_LABEL,
  LIFE_DOMAIN_OPTIONS,
  RELATIONSHIP_STATUS_DOMAINS,
  RELATIONSHIP_STATUS_OPTIONS,
  ROMANCE_SINGLE_PRESETS,
  generateNavigationPrompt,
} from "../lib/promptTemplates";
import { addSoulJournalEntry } from "../lib/soulJournal";
import { getSelfProfile } from "../lib/store";
import type { LifeDomain, RelationshipStatus } from "../types/talent";

interface PromptStationNavState {
  presetContext?: string;
}

export default function PromptStation() {
  const location = useLocation();
  const [domain, setDomain] = useState<LifeDomain | null>(null);
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus | null>(null);
  const [isManagementFocus, setIsManagementFocus] = useState(false);
  const [context, setContext] = useState("");
  const [journalToast, setJournalToast] = useState("");
  const selfProfile = useMemo(() => getSelfProfile(), []);
  const dailyCard = useMemo(() => getTodayCard(), []);

  useEffect(() => {
    const state = location.state as PromptStationNavState | null;
    if (state?.presetContext) {
      setContext(state.presetContext);
    }
    // only consume the incoming nav state once, on arrival
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showRelationshipStatus = domain !== null && RELATIONSHIP_STATUS_DOMAINS.includes(domain);
  const showManagementFocus = domain === "Career";

  function handleSelectDomain(next: LifeDomain) {
    setDomain(next);
    if (!RELATIONSHIP_STATUS_DOMAINS.includes(next)) {
      setRelationshipStatus(null);
    }
    if (next !== "Career") {
      setIsManagementFocus(false);
    }
  }

  const prompt = useMemo(() => {
    if (!domain) return "";
    return generateNavigationPrompt(
      domain,
      context,
      selfProfile,
      dailyCard,
      showRelationshipStatus ? relationshipStatus : null,
      showManagementFocus ? isManagementFocus : false
    );
  }, [
    domain,
    context,
    selfProfile,
    dailyCard,
    showRelationshipStatus,
    relationshipStatus,
    showManagementFocus,
    isManagementFocus,
  ]);

  const step = !domain ? 1 : !context.trim() ? 2 : 3;

  const presets = domain === "Romance" && relationshipStatus === "Single" ? ROMANCE_SINGLE_PRESETS : [];

  function handleSaveToJournal() {
    if (!domain) return;
    addSoulJournalEntry({
      domain,
      domainLabel: LIFE_DOMAIN_LABEL[domain],
      context: context.trim(),
      relationshipStatus: showRelationshipStatus ? relationshipStatus : null,
    });
    setJournalToast("已存入靈魂日誌。");
    setTimeout(() => setJournalToast(""), 2000);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Strategic Dimension Hub"
        title="高維策略樞紐"
        description="三步驟生成專屬你的高維解析指令，複製後帶著瑪雅圖卡前往 Gemini 深度對話。"
      />

      <StepIndicator current={step} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-6">
          <section className="panel p-6">
            <StepLabel n={1} title="選擇生命領域" />
            <div className="grid grid-cols-2 gap-3 mt-4">
              {LIFE_DOMAIN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelectDomain(opt.value)}
                  className={`rounded-xl px-4 py-3 text-sm border transition-colors ${
                    domain === opt.value
                      ? "border-text-primary bg-bg text-text-primary font-medium"
                      : "border-border text-text-secondary hover:border-text-tertiary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          <section className={`panel p-6 ${!domain ? "opacity-50 pointer-events-none" : ""}`}>
            <StepLabel n={2} title="選擇目前痛點與目標" />

            {showRelationshipStatus && (
              <div className="mb-4">
                <div className="text-xs text-text-tertiary mb-2">目前的關係狀態</div>
                <div className="flex flex-wrap gap-2">
                  {RELATIONSHIP_STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setRelationshipStatus(opt.value)}
                      className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${
                        relationshipStatus === opt.value
                          ? "border-text-primary bg-bg text-text-primary font-medium"
                          : "border-border text-text-secondary hover:border-text-tertiary"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showManagementFocus && (
              <div className="mb-4">
                <div className="text-xs text-text-tertiary mb-2">視角設定</div>
                <button
                  onClick={() => setIsManagementFocus((v) => !v)}
                  className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${
                    isManagementFocus
                      ? "border-text-primary bg-bg text-text-primary font-medium"
                      : "border-border text-text-secondary hover:border-text-tertiary"
                  }`}
                >
                  我是領導/管理（管理對焦）
                </button>
              </div>
            )}

            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="input-base mt-1 min-h-24 resize-y"
            />
            {presets.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {presets.map((s) => (
                  <button
                    key={s}
                    onClick={() => setContext(s)}
                    className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary hover:border-text-primary hover:text-text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section>
            <StepLabel n={3} title="複製導航指令並前往 Gemini" />
            <div className="mt-4 flex flex-col gap-4">
              {domain ? (
                <>
                  <CopyPromptBlock text={prompt} />
                  <div className="desc-text text-[11px] text-text-tertiary leading-relaxed -mt-2">
                    <p>使用說明：複製指令後請貼入 Gemini（需登入 Google 帳號）。</p>
                    <p>免責提醒：AI 生成之解讀內容僅供策略思考參考，具體人生與職場決策請自行判斷。</p>
                  </div>
                  <button
                    onClick={handleSaveToJournal}
                    className="btn-secondary border border-border self-start"
                  >
                    <BookHeart size={14} strokeWidth={1.75} />
                    存入今日個人觀照
                  </button>
                </>
              ) : (
                <div className="panel p-8 text-center text-sm text-text-tertiary">
                  完成步驟 1、2 後，將於此處生成完整指令
                </div>
              )}

              <div className="panel p-6">
                <p className="desc-text text-xs text-text-tertiary mb-4">
                  請將複製好的指令與你在 glowing.cc 下載的瑪雅圖卡，一併貼給 Gemini。
                </p>
                <GeminiButton />
              </div>
            </div>
          </section>
        </div>
      </div>

      <Toast message={journalToast} show={Boolean(journalToast)} />
    </div>
  );
}

function StepLabel({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-xs text-text-secondary">
        {n}
      </span>
      <h3 className="text-sm font-medium text-text-primary">{title}</h3>
    </div>
  );
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 text-xs text-text-tertiary">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${n <= current ? "bg-text-primary" : "bg-border"}`}
          />
          {n < 3 && <span className="w-6 h-px bg-border" />}
        </div>
      ))}
    </div>
  );
}
