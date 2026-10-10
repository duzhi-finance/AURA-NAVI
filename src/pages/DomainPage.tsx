import { ArrowLeft, Lock } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import CopyPromptButton from "../components/CopyPromptButton";
import QuickFollowUps from "../components/QuickFollowUps";
import TotemEmblem from "../components/TotemEmblem";
import { buildCopyPrompt, getDomain } from "../lib/domains";
import { LINE_URL, UNLOCK_CODE } from "../lib/links";
import { readCachedProfile, readUnlockedFlag, writeUnlockedFlag } from "../lib/soulProfile";
import { useState } from "react";

const UNLOCK_PRICE = "NT$199";

export default function DomainPage() {
  const { domainId } = useParams<{ domainId: string }>();
  const domain = domainId ? getDomain(domainId) : undefined;
  const profile = readCachedProfile();
  const [unlocked, setUnlocked] = useState(readUnlockedFlag);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState(false);

  if (!profile) return <Navigate to="/app" replace />;
  if (!domain) return <Navigate to="/app" replace />;

  function handleCodeSubmit() {
    if (codeInput.trim().toUpperCase() === UNLOCK_CODE) {
      setCodeError(false);
      setUnlocked(true);
      writeUnlockedFlag();
    } else {
      setCodeError(true);
    }
  }

  const body = domain.buildBody(profile.primaryCard, profile);

  return (
    <div className="soul-manual">
      <div className="mx-auto w-full max-w-xl px-5 py-14 flex flex-col gap-8">
        <Link to="/app" className="inline-flex items-center gap-1.5 text-xs text-[var(--sm-text-tertiary)] self-start">
          <ArrowLeft size={14} strokeWidth={1.75} />
          回到我的命盤
        </Link>

        <div className="flex flex-col items-center text-center gap-2">
          <TotemEmblem seed={profile.primaryCard.number} size={36} className="text-luxe-gold" />
          <p className="text-[11px] uppercase tracking-[0.2em] text-luxe-gold">{domain.label}</p>
          <h1 className="font-serif text-xl font-medium">
            命數 {profile.primaryCard.number}．{profile.primaryCard.name}
          </h1>
        </div>

        {unlocked ? (
          <>
            <section className="soul-panel p-6">
              <p className="desc-text text-sm text-[var(--sm-text-secondary)] leading-relaxed whitespace-pre-line">
                {body}
              </p>
            </section>

            <section className="flex flex-col items-center gap-3">
              <CopyPromptButton text={buildCopyPrompt(domain, profile)} />
            </section>

            <QuickFollowUps domain={domain} profile={profile} />
          </>
        ) : (
          <section className="soul-panel p-6 relative overflow-hidden min-h-[220px]">
            <div className="soul-locked-content">
              <p className="desc-text text-sm text-[var(--sm-text-secondary)] leading-relaxed whitespace-pre-line">
                {body}
              </p>
            </div>
            <div className="soul-locked-overlay">
              <Lock size={20} strokeWidth={1.5} className="text-luxe-gold" />
              <p className="text-xs text-[var(--sm-text-secondary)]">{domain.label}｜解鎖後可見</p>
              <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="soul-btn-primary !text-xs mt-2">
                立即解鎖完整報告（{UNLOCK_PRICE}）
              </a>
              <div className="w-full max-w-xs flex flex-col gap-2 mt-2">
                <input
                  value={codeInput}
                  onChange={(e) => {
                    setCodeInput(e.target.value);
                    setCodeError(false);
                  }}
                  placeholder="輸入解鎖碼"
                  className="soul-input !py-2 !text-xs"
                />
                <button onClick={handleCodeSubmit} disabled={!codeInput.trim()} className="soul-btn-secondary !text-xs">
                  送出解鎖碼
                </button>
                {codeError && <p className="text-[11px] text-[#d98a8a]">解鎖碼不正確</p>}
              </div>
            </div>
          </section>
        )}

        <p className="desc-text text-[10px] text-[var(--sm-text-tertiary)] text-center leading-relaxed mt-2">
          本報告結合生命靈數與塔羅大牌，僅供自我探索與策略參考，不能取代專業心理諮商、醫療或法律建議。
        </p>
      </div>
    </div>
  );
}
