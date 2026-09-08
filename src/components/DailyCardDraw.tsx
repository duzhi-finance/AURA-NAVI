import { Sparkles } from "lucide-react";
import { useState } from "react";
import { drawTodayCard, getTodayCard, type DailyCard } from "../lib/dailyCard";

export default function DailyCardDraw() {
  const [card, setCard] = useState<DailyCard | null>(() => getTodayCard());
  const [isFlipped, setIsFlipped] = useState<boolean>(() => card !== null);

  function handleDraw() {
    const drawn = drawTodayCard();
    setCard(drawn);
    setIsFlipped(true);
  }

  return (
    <div className="panel p-7">
      <div className="text-xs text-text-tertiary mb-4">今日靈魂對焦抽牌</div>

      <div className="card-flip-scene w-full max-w-[320px] h-[180px]">
        <div className={`card-flip-inner ${isFlipped ? "is-flipped" : ""}`}>
          <div className="card-flip-face card-flip-back rounded-2xl border border-border bg-bg-subtle flex items-center justify-center p-6">
            {!card && (
              <button onClick={handleDraw} className="btn-primary">
                <Sparkles size={16} strokeWidth={1.75} />
                點擊抽取今日能量指引卡
              </button>
            )}
          </div>
          <div className="card-flip-face card-flip-front rounded-2xl border border-border bg-bg flex flex-col items-center justify-center gap-2 p-6 text-center">
            {card && (
              <>
                <div className="text-xl font-serif font-semibold text-text-primary">{card.name}</div>
                <p className="text-sm text-text-secondary leading-relaxed max-w-[240px]">
                  {card.insight}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-text-tertiary mt-4">
        {card
          ? "今日已完成抽牌，明天將重新開啟新的一輪。"
          : "每天限抽一張，抽出後將維持顯示一整天。"}
      </p>
    </div>
  );
}
