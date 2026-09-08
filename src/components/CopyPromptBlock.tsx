import { Check, Copy } from "lucide-react";
import { useState } from "react";
import Toast from "./Toast";

const COPY_FEEDBACK_MS = 1500;

export default function CopyPromptBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="panel p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase tracking-[0.15em] text-text-tertiary">
          Navigation Prompt
        </span>
        <button onClick={handleCopy} className="btn-secondary !px-3 !py-1.5 border border-border">
          {copied ? <Check size={14} strokeWidth={1.75} /> : <Copy size={14} strokeWidth={1.75} />}
          {copied ? "已複製" : "複製指令"}
        </button>
      </div>
      <pre className="whitespace-pre-wrap break-words text-sm leading-loose text-text-primary max-h-[420px] overflow-y-auto font-sans">
        {text}
      </pre>

      <Toast message="指令已複製！請開啟 Gemini 並附上你的瑪雅圖卡截圖。" show={copied} />
    </div>
  );
}
