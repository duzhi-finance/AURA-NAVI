import { Copy } from "lucide-react";
import { useState } from "react";
import Toast from "./Toast";
import { buildCopyPrompt, FOLLOWUP_QUESTIONS, type Domain } from "../lib/domains";
import type { SoulProfile } from "../lib/soulProfile";

export default function QuickFollowUps({
  domain,
  profile,
  context,
}: {
  domain: Domain;
  profile: SoulProfile;
  context?: string;
}) {
  const [showToast, setShowToast] = useState(false);

  async function handleCopy(question: string) {
    const text = buildCopyPrompt(domain, profile, { context, followUpQuestion: question });
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard API unavailable; silently ignore, toast still confirms intent
    }
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 1800);
  }

  return (
    <section className="soul-panel p-6 flex flex-col gap-3">
      <p className="text-[11px] uppercase tracking-[0.2em] text-luxe-gold">不知道問什麼？點一下快速追問</p>
      <div className="flex flex-col gap-2">
        {FOLLOWUP_QUESTIONS.map((q) => (
          <button key={q} onClick={() => handleCopy(q)} className="soul-prompt-chip gap-2">
            <Copy size={13} strokeWidth={1.75} className="shrink-0 text-luxe-gold" />
            {q}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-[var(--sm-text-tertiary)]">
        點擊會複製一段帶有你命盤資料的提問，貼到同一個 AI 對話串，就能延續上下文繼續追問。
      </p>
      <Toast message="已複製！貼到同一個對話串繼續問" show={showToast} />
    </section>
  );
}
