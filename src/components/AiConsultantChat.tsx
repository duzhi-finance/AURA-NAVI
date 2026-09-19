import { useEffect, useRef, useState } from "react";
import TotemEmblem from "./TotemEmblem";
import { INITIAL_CHIPS, getNode, type ChatChip } from "../lib/aiConsultant";
import type { SoulReport } from "../pages/SoulManual";

interface ChatMessage {
  role: "ai" | "user";
  text: string;
}

export default function AiConsultantChat({ report }: { report: SoulReport }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: `嗨，我是你的專屬 AI 售後導航員，已經看過你的命盤了——命數 ${report.primaryCard.number}．${report.primaryCard.name}，KIN ${report.kin}．${report.totem}。想先聊聊哪一個部分？`,
    },
  ]);
  const [chips, setChips] = useState<ChatChip[]>(INITIAL_CHIPS);
  const [typing, setTyping] = useState(false);
  const turnRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, typing]);

  function handleChipClick(chip: ChatChip) {
    if (typing) return;
    setMessages((prev) => [...prev, { role: "user", text: chip.label }]);
    setChips([]);
    setTyping(true);
    const delay = 550 + Math.random() * 500;
    window.setTimeout(() => {
      const node = getNode(chip.id);
      const reply = node.reply(report, turnRef.current);
      turnRef.current += 1;
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
      setChips(node.followups);
      setTyping(false);
    }, delay);
  }

  return (
    <section className="soul-panel p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <TotemEmblem seed={report.totemSeed} size={22} className="text-luxe-gold" />
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-luxe-gold">AI 售後導航員</p>
          <p className="text-[10px] text-[var(--sm-text-tertiary)]">根據你的命盤即時解答</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "ai" ? "soul-chat-bubble-ai" : "soul-chat-bubble-user"}>
            <p className="whitespace-pre-line">{m.text}</p>
          </div>
        ))}
        {typing && (
          <div className="soul-chat-bubble-ai flex gap-1.5 items-center">
            <span className="soul-pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--sm-text-tertiary)]" style={{ animationDelay: "0s" }} />
            <span className="soul-pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--sm-text-tertiary)]" style={{ animationDelay: "0.2s" }} />
            <span className="soul-pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--sm-text-tertiary)]" style={{ animationDelay: "0.4s" }} />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {chips.length > 0 && !typing && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--sm-border)]">
          {chips.map((c) => (
            <button key={c.id} onClick={() => handleChipClick(c)} className="soul-chat-chip">
              {c.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
