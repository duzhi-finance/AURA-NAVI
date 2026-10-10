import { Copy } from "lucide-react";
import { useState } from "react";
import Toast from "./Toast";

export default function CopyPromptButton({
  text,
  label = "複製專屬指令，貼到你的 AI 繼續深聊",
  className = "soul-btn-primary w-full max-w-xs",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [showToast, setShowToast] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard API unavailable; silently ignore, toast still confirms intent
    }
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 1800);
  }

  return (
    <>
      <button onClick={handleCopy} className={className}>
        <Copy size={15} strokeWidth={1.75} />
        {label}
      </button>
      <Toast message="已複製！貼到 ChatGPT、Gemini 等你慣用的 AI 就能繼續追問" show={showToast} />
    </>
  );
}
