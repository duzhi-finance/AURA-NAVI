import { FolderOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import ProfileFormModal from "../components/ProfileFormModal";
import { PROFILE_TYPE_LABEL } from "../lib/mayaOptions";
import { deleteProfile, listProfiles, saveProfile } from "../lib/store";
import type { TalentProfile } from "../types/talent";

export default function Archive() {
  const [profiles, setProfiles] = useState<TalentProfile[]>([]);
  const [editing, setEditing] = useState<TalentProfile | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setProfiles(listProfiles());
  }, []);

  function refresh() {
    setProfiles(listProfiles());
  }

  function handleSave(profile: TalentProfile) {
    saveProfile(profile);
    refresh();
    setShowForm(false);
    setEditing(null);
  }

  function handleDelete(id: string) {
    if (!confirm("確定要刪除這個天賦檔案嗎？")) return;
    deleteProfile(id);
    refresh();
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader
          eyebrow="Talent DNA Archive"
          title="天賦檔案典藏庫"
          description="典藏你與所有重要關係人的天賦設定檔，隨時檢視瑪雅圖騰與個性說明書。"
        />
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="btn-primary whitespace-nowrap"
        >
          <Plus size={16} strokeWidth={1.75} />
          新增檔案
        </button>
      </div>

      {profiles.length === 0 ? (
        <div className="panel p-12 text-center text-text-secondary">
          <FolderOpen size={40} strokeWidth={1.25} className="mx-auto mb-4 text-text-tertiary" />
          <p>還沒有任何天賦檔案</p>
          <p className="text-sm text-text-tertiary mt-1.5">
            先建立「自己」的檔案，再逐步新增伴侶、家人、主管等重要關係人。
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p) => (
            <ProfileCard
              key={p.profile_id}
              profile={p}
              onEdit={() => {
                setEditing(p);
                setShowForm(true);
              }}
              onDelete={() => handleDelete(p.profile_id)}
            />
          ))}
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
    </div>
  );
}

function ProfileCard({
  profile,
  onEdit,
  onDelete,
}: {
  profile: TalentProfile;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="panel p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-bg border border-border px-2.5 py-1 text-[11px] text-text-secondary">
          {PROFILE_TYPE_LABEL[profile.profile_type]}
        </span>
        <div className="flex gap-3 text-text-tertiary">
          <button onClick={onEdit} className="hover:text-text-primary" aria-label="編輯">
            <Pencil size={15} strokeWidth={1.5} />
          </button>
          <button onClick={onDelete} className="hover:text-text-primary" aria-label="刪除">
            <Trash2 size={15} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-serif font-semibold text-text-primary">{profile.name_alias}</h3>
        <p className="text-xs text-text-tertiary mt-1">
          {profile.maya_totem ? `圖騰：${profile.maya_totem}` : "尚未填寫圖騰"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary">
        <div className="rounded-lg bg-bg border border-border px-2.5 py-1.5">
          KIN：{profile.maya_kin ?? "—"}
        </div>
        <div className="rounded-lg bg-bg border border-border px-2.5 py-1.5">
          音調：{profile.maya_tone || "—"}
        </div>
        <div className="rounded-lg bg-bg border border-border px-2.5 py-1.5 col-span-2">
          生命靈數：{profile.life_path_num ?? "—"}
        </div>
      </div>

      {profile.core_traits_tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
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
    </div>
  );
}
