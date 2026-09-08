import { useState } from "react";

export default function CopyPromptBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="glass-card rounded-2xl p-4 md:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-ink-500">Navigation Prompt</span>
        <button
          onClick={handleCopy}
          className="rounded-lg bg-eagle-blue/15 px-3 py-1.5 text-xs font-medium text-eagle-blue hover:bg-eagle-blue/25 transition-colors"
        >
          {copied ? "✅ 已複製" : "📋 複製指令"}
        </button>
      </div>
      <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-ink-100 max-h-[420px] overflow-y-auto font-sans">
        {text}
      </pre>
    </div>
  );
}
