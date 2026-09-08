import { useMemo, useState } from "react";
import CopyPromptBlock from "../components/CopyPromptBlock";
import GeminiButton from "../components/GeminiButton";
import PageHeader from "../components/PageHeader";
import {
  LIFE_DOMAIN_OPTIONS,
  PAIN_POINT_SUGGESTIONS,
  generateNavigationPrompt,
} from "../lib/promptTemplates";
import { getSelfProfile } from "../lib/store";
import type { LifeDomain } from "../types/talent";

export default function PromptStation() {
  const [domain, setDomain] = useState<LifeDomain | null>(null);
  const [context, setContext] = useState("");
  const selfProfile = useMemo(() => getSelfProfile(), []);

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
          <section className="glass-card rounded-2xl p-5">
            <StepLabel n={1} title="選擇生命領域" />
            <div className="grid grid-cols-2 gap-3 mt-3">
              {LIFE_DOMAIN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDomain(opt.value)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium border transition-colors ${
                    domain === opt.value
                      ? "border-eagle-blue bg-eagle-blue/15 text-eagle-blue"
                      : "border-white/10 text-ink-300 hover:border-white/20"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          <section className={`glass-card rounded-2xl p-5 ${!domain ? "opacity-50 pointer-events-none" : ""}`}>
            <StepLabel n={2} title="選擇目前痛點與目標" />
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="請描述你目前的困境或想達成的目標，例如：主管不理解我"
              className="input-base mt-3 min-h-24 resize-y"
            />
            {domain && (
              <div className="flex flex-wrap gap-2 mt-3">
                {PAIN_POINT_SUGGESTIONS[domain].map((s) => (
                  <button
                    key={s}
                    onClick={() => setContext(s)}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-ink-300 hover:border-star-gold/50 hover:text-star-gold"
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
            <StepLabel n={3} title="複製導航指令" />
            <div className="mt-3">
              {domain ? (
                <CopyPromptBlock text={prompt} />
              ) : (
                <div className="glass-card rounded-2xl p-8 text-center text-sm text-ink-500">
                  完成步驟 1、2 後，將於此處生成完整指令
                </div>
              )}
            </div>
          </section>

          <section className="glass-card rounded-2xl p-5">
            <StepLabel n={4} title="快捷導向" />
            <p className="text-xs text-ink-500 mt-2 mb-3">
              請將複製好的指令與你在 glowing.cc 下載的瑪雅圖卡，一併貼給 Gemini。
            </p>
            <GeminiButton />
          </section>
        </div>
      </div>
    </div>
  );
}

function StepLabel({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-star-gold/20 text-xs font-semibold text-star-gold">
        {n}
      </span>
      <h3 className="text-sm font-semibold text-ink-100">{title}</h3>
    </div>
  );
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 text-xs text-ink-500">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${n <= current ? "bg-eagle-blue" : "bg-white/15"}`}
          />
          {n < 3 && <span className="w-6 h-px bg-white/15" />}
        </div>
      ))}
    </div>
  );
}
