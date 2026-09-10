import { Check } from "lucide-react";

const STEPS = [
  { n: 1, label: "取得你的瑪雅印記" },
  { n: 2, label: "查看天賦與精準合盤" },
  { n: 3, label: "複製指令，開啟 Gemini 導航" },
] as const;

export default function OnboardingStepper({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <div className="mb-8 flex items-center">
      {STEPS.map((step, idx) => {
        const isDone = step.n < currentStep;
        const isActive = step.n === currentStep;
        return (
          <div key={step.n} className={`flex items-center ${idx < STEPS.length - 1 ? "flex-1" : ""}`}>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-serif font-semibold shrink-0 transition-colors ${
                  isDone
                    ? "bg-luxe-gold text-white"
                    : isActive
                      ? "bg-luxe-gold text-white ring-4 ring-luxe-gold/20"
                      : "bg-bg border border-border text-text-tertiary"
                }`}
              >
                {isDone ? <Check size={12} strokeWidth={2.5} /> : step.n}
              </span>
              <span
                className={`hidden sm:inline text-xs whitespace-nowrap transition-colors ${
                  isActive ? "text-text-primary font-medium" : isDone ? "text-text-secondary" : "text-text-tertiary"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 sm:mx-3 transition-colors ${isDone ? "bg-luxe-gold" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
