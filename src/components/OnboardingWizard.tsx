import { ArrowRight, Compass } from "lucide-react";
import { useState } from "react";
import { GLOWING_URL } from "../lib/promptTemplates";
import type { TalentProfile } from "../types/talent";
import ProfileFormModal from "./ProfileFormModal";

/**
 * First-run gate: shown instead of the whole app shell (no nav) whenever the
 * Talent DNA Archive has zero profiles. Two screens -- get the imprint from
 * glowing.cc, then build the profile from it -- neither can be skipped.
 */
export default function OnboardingWizard({ onProfileSaved }: { onProfileSaved: (profile: TalentProfile) => void }) {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return (
      <ProfileFormModal onboarding defaultIsSelf onSave={onProfileSaved} onClose={() => {}} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-5 py-10">
      <div className="flex items-center gap-2.5 mb-8">
        <Compass size={22} strokeWidth={1.5} className="text-text-primary" />
        <span className="font-serif text-lg text-text-primary">AURA-Navi</span>
      </div>

      <div className="card-glass p-8 flex flex-col items-center text-center gap-4 w-full max-w-md">
        <span className="text-luxe-gold text-2xl">✦</span>
        <h1 className="font-serif text-xl font-semibold text-text-primary">先取得你的瑪雅印記</h1>
        <p className="desc-text text-sm text-text-secondary leading-relaxed">
          瑪雅印記（也就是你的 KIN 碼與主印記）是這套系統分析你天賦的起點。請先前往
          glowing.cc，用你的出生年月日換算出專屬印記，再回來這裡建立檔案。
        </p>
        <a
          href={GLOWING_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setShowForm(true)}
          className="btn-primary justify-center w-full max-w-xs"
        >
          前往 glowing.cc 取得瑪雅印記
          <ArrowRight size={16} strokeWidth={1.75} />
        </a>
        <button
          onClick={() => setShowForm(true)}
          className="text-xs text-text-tertiary underline hover:text-text-secondary"
        >
          已經知道自己的 KIN 碼，直接填寫
        </button>
      </div>
    </div>
  );
}
