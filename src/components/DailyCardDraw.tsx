import { Sparkles } from "lucide-react";
import { useState } from "react";
import { cardSeedIndex, drawTodayCard, getCardLog, getTodayCard, type DailyCard } from "../lib/dailyCard";
import TotemEmblem from "./TotemEmblem";

export default function DailyCardDraw() {
  const [card, setCard] = useState<DailyCard | null>(() => getTodayCard());
  const [isFlipped, setIsFlipped] = useState<boolean>(() => card !== null);
  const [log, setLog] = useState(() => getCardLog());

  function handleDraw() {
    const drawn = drawTodayCard();
    setCard(drawn);
    setIsFlipped(true);
    setLog(getCardLog());
  }

  return (
    <div className="panel p-7">
      <div className="text-xs text-text-tertiary mb-4">今日靈魂對焦抽牌</div>

      <div className="card-flip-scene card-halo w-full max-w-[320px] h-[200px]">
        <div className={`card-flip-inner ${isFlipped ? "is-flipped" : ""}`}>
          <div className="card-flip-face card-luxe card-shimmer flex items-center justify-center p-6">
            {!card && (
              <button onClick={handleDraw} className="btn-primary">
                <Sparkles size={16} strokeWidth={1.75} />
                點擊抽取今日能量指引卡
              </button>
            )}
          </div>
          <div className="card-flip-face card-flip-front card-luxe card-shimmer flex flex-col items-center justify-center gap-2 p-6 text-center">
            {card && (
              <>
                <TotemEmblem seed={cardSeedIndex(card)} size={56} className="text-luxe-gold" />
                <div className="text-xl font-serif font-semibold text-text-primary mt-1">{card.name}</div>
                <p className="text-sm text-text-secondary leading-relaxed max-w-[240px] italic">
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

      {log.length > 0 && (
        <div className="mt-6 pt-5 border-t border-border">
          <div className="text-xs text-text-tertiary mb-3">抽牌足跡日誌</div>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
            {log.map((entry) => (
              <div
                key={entry.date}
                className="flex items-center justify-between text-xs text-text-secondary rounded-lg bg-bg border border-border px-3 py-2"
              >
                <span className="text-text-tertiary">{entry.date}</span>
                <span className="text-text-primary font-medium">{entry.card.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
