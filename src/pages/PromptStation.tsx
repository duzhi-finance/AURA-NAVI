import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import CopyPromptBlock from "../components/CopyPromptBlock";
import GeminiButton from "../components/GeminiButton";
import PageHeader from "../components/PageHeader";
import { CONTEXT_PRESETS, LIFE_DOMAIN_OPTIONS, generateNavigationPrompt } from "../lib/promptTemplates";
import { getSelfProfile } from "../lib/store";
import type { LifeDomain } from "../types/talent";

interface PromptStationNavState {
  presetContext?: string;
}

export default function PromptStation() {
  const location = useLocation();
  const [domain, setDomain] = useState<LifeDomain | null>(null);
  const [context, setContext] = useState("");
  const selfProfile = useMemo(() => getSelfProfile(), []);

  useEffect(() => {
    const state = location.state as PromptStationNavState | null;
    if (state?.presetContext) {
      setContext(state.presetContext);
    }
    // only consume the incoming nav state once, on arrival
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prompt = useMemo(() => {
    if (!domain) return "";
    return generateNavigationPrompt(domain, context, selfProfile);
  }, [domain, context, selfProfile]);

  const step = !domain ? 1 : !context.trim() ? 2 : 3;

  return (
    <div>
      <PageHeader
        eyebrow="Quantum Prompt Station"
        title="高維對焦傳輸站"
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
                  onClick={() => setDomain(opt.value)}
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
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="請描述你目前的困境或想達成的目標，例如：主管不理解我"
              className="input-base mt-4 min-h-24 resize-y"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {CONTEXT_PRESETS.map((s) => (
                <button
                  key={s}
                  onClick={() => setContext(s)}
                  className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary hover:border-text-primary hover:text-text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section>
            <StepLabel n={3} title="複製導航指令並前往 Gemini" />
            <div className="mt-4 flex flex-col gap-4">
              {domain ? (
                <CopyPromptBlock text={prompt} />
              ) : (
                <div className="panel p-8 text-center text-sm text-text-tertiary">
                  完成步驟 1、2 後，將於此處生成完整指令
                </div>
              )}

              <div className="panel p-6">
                <p className="text-xs text-text-tertiary mb-4">
                  請將複製好的指令與你在 glowing.cc 下載的瑪雅圖卡，一併貼給 Gemini。
                </p>
                <GeminiButton />
              </div>
            </div>
          </section>
        </div>
      </div>
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
