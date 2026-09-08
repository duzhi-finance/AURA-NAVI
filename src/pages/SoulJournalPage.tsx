import { BookHeart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { RELATIONSHIP_STATUS_LABEL } from "../lib/promptTemplates";
import {
  deleteSoulJournalEntry,
  formatJournalDiaryDate,
  getSoulJournal,
  type SoulJournalEntry,
} from "../lib/soulJournal";

export default function SoulJournalPage() {
  const [entries, setEntries] = useState<SoulJournalEntry[]>([]);

  useEffect(() => {
    setEntries(getSoulJournal());
  }, []);

  function handleDelete(id: string) {
    if (!confirm("確定要刪除這則觀照紀錄嗎？")) return;
    deleteSoulJournalEntry(id);
    setEntries(getSoulJournal());
  }

  return (
    <div>
      <PageHeader
        eyebrow="Synastry Journal"
        title="靈魂共振日誌"
        description="每一次的對焦與觀照，都會留下足跡。回顧一週前、一個月前的心理軌跡，看見自己的轉變。"
      />

      {entries.length === 0 ? (
        <div className="panel p-12 text-center text-text-secondary">
          <BookHeart size={40} strokeWidth={1.25} className="mx-auto mb-4 text-text-tertiary" />
          <p className="mb-1.5">日誌還是空的</p>
          <p className="desc-text text-sm text-text-tertiary">
            前往
            <Link to="/prompt-station" className="text-text-primary underline mx-1">
              高維策略樞紐
            </Link>
            生成一次對焦指令後，點擊「存入今日個人觀照」即可開始紀錄。
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {entries.map((entry) => (
            <JournalEntryRow key={entry.id} entry={entry} onDelete={() => handleDelete(entry.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function JournalEntryRow({
  entry,
  onDelete,
}: {
  entry: SoulJournalEntry;
  onDelete: () => void;
}) {
  const { month, day, weekday, year } = formatJournalDiaryDate(entry.created_at);

  return (
    <div className="grid grid-cols-[64px_1fr] sm:grid-cols-[88px_1fr] gap-4 sm:gap-6 pb-8">
      <div className="text-right pt-2">
        <div className="font-serif text-3xl sm:text-4xl text-text-primary leading-none">{day}</div>
        <div className="text-[10px] text-text-tertiary mt-1.5 uppercase tracking-wide">{month} 月</div>
      </div>

      <div className="relative border-l border-border pl-6 sm:pl-8">
        <span className="absolute -left-[5px] top-3 h-2.5 w-2.5 rounded-full bg-luxe-gold ring-4 ring-bg" />

        <div className="panel p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-bg border border-border px-2.5 py-1 text-[11px] text-text-secondary">
                {entry.domainLabel}
              </span>
              {entry.relationshipStatus && (
                <span className="rounded-full bg-bg border border-border px-2.5 py-1 text-[11px] text-text-secondary">
                  {RELATIONSHIP_STATUS_LABEL[entry.relationshipStatus]}
                </span>
              )}
            </div>
            <button
              onClick={onDelete}
              className="text-text-tertiary hover:text-text-primary shrink-0"
              aria-label="刪除"
            >
              <Trash2 size={15} strokeWidth={1.5} />
            </button>
          </div>

          <p className="font-serif text-lg text-text-primary leading-relaxed italic">
            「{entry.context || "（未填寫具體內容）"}」
          </p>

          <p className="text-[11px] text-text-tertiary mt-4">
            {year} 年 · 星期{weekday}
          </p>
        </div>
      </div>
    </div>
  );
}
