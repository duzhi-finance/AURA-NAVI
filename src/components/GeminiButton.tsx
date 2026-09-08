import { ArrowUpRight } from "lucide-react";
import { GEMINI_URL } from "../lib/promptTemplates";

export default function GeminiButton({ label = "開啟 Gemini 進行深度分析" }: { label?: string }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <a href={GEMINI_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
        {label}
        <ArrowUpRight size={16} strokeWidth={1.75} />
      </a>
      <p className="desc-text text-xs text-text-tertiary">需要 Google 帳號登入 Gemini 才能使用</p>
    </div>
  );
}
