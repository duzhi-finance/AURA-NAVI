import { ArrowRight, Check, ClipboardList, Download, Pencil, Plus, Sparkles, Trash2, Upload, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ProfileFormModal from "../components/ProfileFormModal";
import TotemEmblem from "../components/TotemEmblem";
import Toast from "../components/Toast";
import { MAYA_TOTEMS } from "../lib/mayaOptions";
import {
  deleteProfile,
  exportProfilesAsJson,
  importProfilesFromJson,
  listProfiles,
  saveProfile,
} from "../lib/store";
import type { TalentProfile } from "../types/talent";

export default function Archive() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<TalentProfile[]>([]);
  const [editing, setEditing] = useState<TalentProfile | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [teamQuizUrl] = useState(
    () => `${window.location.origin}${window.location.pathname}#/team-dna`
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfiles(listProfiles());
  }, []);

  function refresh() {
    setProfiles(listProfiles());
  }

  function showToast(message: string) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 2500);
  }

  function handleSave(profile: TalentProfile) {
    saveProfile(profile);
    refresh();
    setShowForm(false);
    setEditing(null);
  }

  function handleDelete(id: string) {
    if (!confirm("確定要刪除這個靈魂印記嗎？")) return;
    deleteProfile(id);
    setSelectedIds((ids) => ids.filter((i) => i !== id));
    refresh();
  }

  function handleExport() {
    exportProfilesAsJson();
    showToast("已匯出 JSON 備份檔案。");
  }

  async function handleCopyTeamQuizLink() {
    try {
      await navigator.clipboard.writeText(teamQuizUrl);
      showToast("已複製邀請連結，可直接傳送給團隊夥伴");
    } catch {
      showToast("複製失敗，請手動複製網址列連結。");
    }
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === "string" ? reader.result : "";
      const result = importProfilesFromJson(content);
      if (result.success) {
        refresh();
        showToast(`已匯入 ${result.count} 筆靈魂印記。`);
      } else {
        showToast(result.error ?? "匯入失敗，請確認檔案格式。");
      }
    };
    reader.readAsText(file);
  }

  function toggleSelect(id: string) {
    setSelectedIds((ids) => {
      if (ids.includes(id)) return ids.filter((i) => i !== id);
      if (ids.length >= 2) return [ids[1], id];
      return [...ids, id];
    });
  }

  function handleCompare() {
    if (selectedIds.length !== 2) return;
    navigate("/app/relations", { state: { selfId: selectedIds[0], targetId: selectedIds[1] } });
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader
          eyebrow="The Soul DNA Vault"
          title="靈魂印記典藏館"
          description="典藏你與所有重要關係人的靈魂印記，隨時檢視瑪雅圖騰與個性說明書。選取兩張印記，即可前往頻率共振藝廊比對。"
        />
      </div>

      <div className="rounded-2xl bg-[#FAF9F6] border border-[#E2D8D8] p-6 mb-10">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bg border border-border shrink-0">
            <Users size={15} strokeWidth={1.5} className="text-luxe-gold" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-text-primary text-[15px] tracking-[0.08em]" style={{ fontWeight: 400 }}>
              ✦ 團隊天賦原貌｜職場頻率與充電模式對焦
            </div>
            <p
              className="font-serif leading-[1.6] mt-2"
              style={{ color: "#7A7571", fontSize: "12px" }}
            >
              無痛邀請夥伴或主管測算 KIN 碼，建立高共振的職場溝通生態。點擊下方按鈕即可複製專屬邀請連結。
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2.5 flex-wrap">
          <div
            className="flex-1 min-w-[200px] rounded-lg px-3.5 py-2.5 text-xs truncate"
            style={{ background: "#F2EFE9", color: "#9A9186" }}
          >
            {teamQuizUrl}
          </div>
          <button onClick={handleCopyTeamQuizLink} className="btn-invite-dark shrink-0">
            <ClipboardList size={14} strokeWidth={1.75} />
            複製測驗邀請連結
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleImportFile}
        className="hidden"
      />

      <button
        onClick={() => {
          setEditing(null);
          setShowForm(true);
        }}
        className="card-luxe card-hover w-full flex items-center justify-center gap-2.5 py-6 mb-10 text-sm font-medium text-text-primary transition-all hover:opacity-80"
      >
        <Plus size={18} strokeWidth={1.75} />
        新增靈魂印記
      </button>

      {profiles.length === 0 ? (
        <div className="panel p-12 text-center text-text-secondary">
          <Sparkles size={40} strokeWidth={1.25} className="mx-auto mb-4 text-text-tertiary" />
          <p>還沒有任何靈魂印記</p>
          <p className="desc-text text-sm text-text-tertiary mt-1.5">
            先建立「自己」的印記，再逐步新增伴侶、家人、主管等重要關係人。
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p) => (
            <ProfileCard
              key={p.profile_id}
              profile={p}
              selected={selectedIds.includes(p.profile_id)}
              onSelect={() => toggleSelect(p.profile_id)}
              onEdit={() => {
                setEditing(p);
                setShowForm(true);
              }}
              onDelete={() => handleDelete(p.profile_id)}
            />
          ))}
        </div>
      )}

      <div className="notice-pink px-[14px] py-[11px] mt-10 flex items-center justify-between gap-3 flex-wrap">
        <p className="desc-text text-[11px] leading-[1.5] max-w-2xl">
          貼心提醒：資料僅儲存於此裝置與瀏覽器，更換裝置或清除快取會導致資料遺失，請定期匯出備份。
        </p>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary !px-2.5 !py-1.5 border border-notice-border !text-notice-text">
            <Download size={13} strokeWidth={1.75} />
            匯出 JSON 備份
          </button>
          <button onClick={handleImportClick} className="btn-secondary !px-2.5 !py-1.5 border border-notice-border !text-notice-text">
            <Upload size={13} strokeWidth={1.75} />
            匯入備份檔案
          </button>
        </div>
      </div>

      {selectedIds.length === 2 && (
        <div className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20">
          <button onClick={handleCompare} className="btn-primary shadow-lg">
            前往頻率共振藝廊比對
            <ArrowRight size={16} strokeWidth={1.75} />
          </button>
        </div>
      )}

      {showForm && (
        <ProfileFormModal
          initial={editing ?? undefined}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      <Toast message={toastMessage} show={Boolean(toastMessage)} />
    </div>
  );
}

function ProfileCard({
  profile,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: {
  profile: TalentProfile;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const seed = MAYA_TOTEMS.indexOf(profile.maya_totem);

  return (
    <div
      onClick={onSelect}
      className={`relative p-6 flex flex-col gap-4 cursor-pointer card-hover transition-all rounded-[20px] ${
        profile.is_self ? "card-luxe card-halo" : "panel"
      } ${selected ? "ring-2 ring-luxe-gold" : ""}`}
    >
      {profile.is_self && (
        <TotemEmblem
          seed={seed >= 0 ? seed : 0}
          size={120}
          className="absolute -right-4 -top-4 text-luxe-gold opacity-25 pointer-events-none"
        />
      )}

      {selected && (
        <span className="absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full bg-luxe-gold text-white">
          <Check size={12} strokeWidth={2.5} />
        </span>
      )}

      <div className="flex items-center justify-between relative">
        <span className="rounded-full bg-bg border border-border px-2.5 py-1 text-[11px] text-text-secondary">
          {profile.is_self ? "自己" : profile.profile_type || "未分類"}
        </span>
        <div className="flex gap-3 text-text-tertiary">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="hover:text-text-primary"
            aria-label="編輯"
          >
            <Pencil size={15} strokeWidth={1.5} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="hover:text-text-primary"
            aria-label="刪除"
          >
            <Trash2 size={15} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="relative">
        <h3 className="text-lg font-serif font-semibold text-text-primary">{profile.name_alias}</h3>
        <p className="desc-text text-xs text-text-tertiary mt-1">
          {profile.maya_totem ? `圖騰：${profile.maya_totem}` : "尚未填寫圖騰"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary relative">
        <div className="rounded-lg bg-bg border border-border px-2.5 py-1.5">
          <span className="font-serif">KIN：{profile.maya_kin ?? "—"}</span>
        </div>
        <div className="rounded-lg bg-bg border border-border px-2.5 py-1.5">
          音調：{profile.maya_tone || "—"}
        </div>
        <div className="rounded-lg bg-bg border border-border px-2.5 py-1.5 col-span-2">
          生命靈數：{profile.life_path_num ?? "—"}
        </div>
      </div>

      {profile.core_traits_tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1 relative">
          {profile.core_traits_tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {profile.relationship_notes && (
        <p className="desc-text text-xs text-text-tertiary leading-relaxed border-t border-border pt-3 line-clamp-3 relative">
          {profile.relationship_notes}
        </p>
      )}

      <DeepTalentFields profile={profile} />
    </div>
  );
}

const DEEP_TALENT_FIELDS: { key: keyof TalentProfile; label: string }[] = [
  { key: "totem_animal", label: "力量動物" },
  { key: "wavespell", label: "波符" },
  { key: "hidden_push_psi", label: "隱藏推動（PSI）" },
  { key: "core_resonance_nuance", label: "核心共鳴與細微差異" },
  { key: "hidden_personality", label: "隱藏性格" },
  { key: "support_challenge_energy", label: "支持能量與挑戰擴展" },
];

function DeepTalentFields({ profile }: { profile: TalentProfile }) {
  const populated = DEEP_TALENT_FIELDS.filter((f) => String(profile[f.key] ?? "").trim());
  if (populated.length === 0) return null;

  return (
    <details
      className="border-t border-border pt-3 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <summary className="desc-text cursor-pointer text-[11px] text-luxe-gold select-none">
        瑪雅深度天賦模組
      </summary>
      <div className="flex flex-col gap-2 mt-3">
        {populated.map((f) => (
          <div key={f.key} className="text-xs text-text-tertiary">
            <span className="text-text-secondary">{f.label}：</span>
            <span className="desc-text">{String(profile[f.key])}</span>
          </div>
        ))}
      </div>
    </details>
  );
}
