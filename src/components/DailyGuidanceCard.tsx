import { useState } from "react";
import { Sparkles } from "lucide-react";
import { getDailyGuidance, getTodayLabel } from "../lib/dailyGuidance";

export default function DailyGuidanceCard({ cardNumber }: { cardNumber: number }) {
  const [flipped, setFlipped] = useState(false);
  const guidance = getDailyGuidance(cardNumber);
  const today = getTodayLabel();

  return (
    <section className="soul-panel p-6 flex flex-col items-center gap-3 text-center">
      <p className="text-[11px] uppercase tracking-[0.2em] text-luxe-gold">今日靈魂指引．{today}</p>
      <div
        className="card-flip-scene w-full max-w-[240px] h-[130px] cursor-pointer"
        onClick={() => setFlipped(true)}
        role="button"
        aria-label="翻開今日指引"
      >
        <div className={`card-flip-inner ${flipped ? "is-flipped" : ""}`}>
          <div className="card-flip-face card-luxe w-full h-full flex flex-col items-center justify-center gap-2">
            <Sparkles size={18} strokeWidth={1.5} className="text-luxe-gold" />
            <span className="desc-text text-sm text-text-secondary">點一下，翻開今天的指引</span>
          </div>
          <div className="card-flip-face card-flip-front card-luxe card-shimmer w-full h-full flex items-center justify-center p-5">
            <p className="desc-text text-sm text-text-primary leading-relaxed">{guidance}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
