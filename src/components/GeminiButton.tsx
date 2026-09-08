import { GEMINI_URL } from "../lib/promptTemplates";

export default function GeminiButton({ label = "🚀 開啟 Gemini 進行深度分析" }: { label?: string }) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <a
        href={GEMINI_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-eagle-blue to-star-gold px-5 py-3 text-sm font-semibold text-space-black shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {label}
      </a>
      <p className="text-xs text-ink-500">需要 Google 帳號登入 Gemini 才能使用</p>
    </div>
  );
}
