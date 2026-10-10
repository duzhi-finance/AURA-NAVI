import { Download, Lock, Share2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TotemEmblem from "../components/TotemEmblem";
import DailyGuidanceCard from "../components/DailyGuidanceCard";
import Toast from "../components/Toast";
import { LINE_URL, UNLOCK_CODE } from "../lib/links";
import { drawSoulCard, downloadCanvasAsPng, SOUL_CARD_WIDTH, SOUL_CARD_HEIGHT } from "../lib/soulCard";
import { excerpt } from "../lib/reportText";
import { DOMAINS } from "../lib/domains";
import {
  buildProfile,
  clearCachedProfile,
  readCachedProfile,
  readIntroSeen,
  readUnlockedFlag,
  markIntroSeen,
  writeCachedProfile,
  writeUnlockedFlag,
  type SoulProfile,
} from "../lib/soulProfile";

type Phase = "landing" | "loading" | "dashboard";
const LOADING_MS = 1200;
const UNLOCK_PRICE = "NT$199";

export default function AppDashboard() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [birthdate, setBirthdate] = useState("");
  const [profile, setProfile] = useState<SoulProfile | null>(null);
  const [unlocked, setUnlocked] = useState(readUnlockedFlag);
  const [showIntro, setShowIntro] = useState(!readIntroSeen());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cached = readCachedProfile();
    if (!cached) return;
    setProfile(cached);
    setPhase("dashboard");
  }, []);

  function handleDecode() {
    const parts = birthdate.split("-").map(Number);
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return;
    const [y, m, d] = parts;

    setPhase("loading");
    setTimeout(() => {
      setProfile(buildProfile(y, m, d));
      writeCachedProfile(y, m, d);
      markIntroSeen();
      setPhase("dashboard");
    }, LOADING_MS);
  }

  function handleChangeBirthdate() {
    clearCachedProfile();
    setProfile(null);
    setBirthdate("");
    setPhase("landing");
  }

  function handleUnlock() {
    setUnlocked(true);
    writeUnlockedFlag();
  }

  useEffect(() => {
    if (phase !== "dashboard" || !profile || !canvasRef.current) return;
    let cancelled = false;
    (async () => {
      if (document.fonts?.ready) await document.fonts.ready;
      if (cancelled || !canvasRef.current) return;
      drawSoulCard(canvasRef.current, {
        cardNumber: profile.primaryCard.number,
        cardName: profile.primaryCard.name,
        quote: excerpt(profile.primaryCard.advantage, 40),
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [phase, profile]);

  async function handleDownload() {
    if (!canvasRef.current) return;
    await downloadCanvasAsPng(canvasRef.current, "aura-navi-soul-card");
  }

  return (
    <div className="soul-manual">
      <div className="mx-auto w-full max-w-xl px-5 py-14">
        {phase === "landing" && (
          <LandingScreen
            birthdate={birthdate}
            setBirthdate={setBirthdate}
            onDecode={handleDecode}
            showIntro={showIntro}
            onDismissIntro={() => {
              setShowIntro(false);
              markIntroSeen();
            }}
          />
        )}
        {phase === "loading" && <LoadingScreen />}
        {phase === "dashboard" && profile && (
          <DashboardScreen
            profile={profile}
            canvasRef={canvasRef}
            unlocked={unlocked}
            onUnlock={handleUnlock}
            onDownload={handleDownload}
            onChangeBirthdate={handleChangeBirthdate}
          />
        )}
      </div>
    </div>
  );
}

function LandingScreen({
  birthdate,
  setBirthdate,
  onDecode,
  showIntro,
  onDismissIntro,
}: {
  birthdate: string;
  setBirthdate: (v: string) => void;
  onDecode: () => void;
  showIntro: boolean;
  onDismissIntro: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-8 min-h-[80vh] justify-center">
      <div className="flex items-center gap-2 text-[var(--sm-text-tertiary)] text-xs uppercase tracking-[0.3em]">
        <Sparkles size={14} strokeWidth={1.5} className="text-luxe-gold" />
        AURA · NAVI
      </div>
      <h1 className="font-serif text-3xl md:text-4xl font-medium leading-snug">
        全方位個人
        <br />
        靈魂使用說明書
      </h1>
      <p className="desc-text text-sm text-[var(--sm-text-secondary)] leading-relaxed max-w-sm">
        只需要你的西元出生年月日，結合塔羅生命靈數，為你解碼專屬的天賦、個性與感情工作卡關點。
      </p>

      {showIntro && (
        <div className="soul-panel p-5 w-full max-w-xs flex flex-col gap-2 text-left">
          <p className="text-xs text-[var(--sm-text-secondary)] leading-relaxed">
            ✨ 第一次使用嗎？3 步驟就能開始：
            <br />
            1️⃣ 輸入生日　2️⃣ 立即看免費解析　3️⃣ 解鎖完整報告
          </p>
          <button onClick={onDismissIntro} className="text-[11px] text-luxe-gold self-end">
            我知道了
          </button>
        </div>
      )}

      <div className="soul-panel p-6 w-full max-w-xs flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-left">
          <span className="text-xs text-[var(--sm-text-tertiary)]">西元出生年月日</span>
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="soul-input"
          />
        </label>
        <button onClick={onDecode} disabled={!birthdate} className="soul-btn-primary">
          開啟靈魂解碼
        </button>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 min-h-[80vh]">
      <div className="flex gap-2">
        <span className="soul-pulse-dot h-2.5 w-2.5 rounded-full bg-luxe-gold" style={{ animationDelay: "0s" }} />
        <span className="soul-pulse-dot h-2.5 w-2.5 rounded-full bg-luxe-gold" style={{ animationDelay: "0.2s" }} />
        <span className="soul-pulse-dot h-2.5 w-2.5 rounded-full bg-luxe-gold" style={{ animationDelay: "0.4s" }} />
      </div>
      <p className="desc-text text-sm text-[var(--sm-text-secondary)] tracking-[0.1em]">
        正在校準你的高維頻率...
      </p>
    </div>
  );
}

function DashboardScreen({
  profile,
  canvasRef,
  unlocked,
  onUnlock,
  onDownload,
  onChangeBirthdate,
}: {
  profile: SoulProfile;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  unlocked: boolean;
  onUnlock: () => void;
  onDownload: () => void;
  onChangeBirthdate: () => void;
}) {
  const { primaryCard, dualCard, supplementCards } = profile;
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  function handleCodeSubmit() {
    if (codeInput.trim().toUpperCase() === UNLOCK_CODE) {
      setCodeError(false);
      onUnlock();
    } else {
      setCodeError(true);
    }
  }

  async function handleShare() {
    const url = `${window.location.origin}${window.location.pathname}#/app`;
    const text = `我剛剛在「全方位個人靈魂使用說明書」測出我的命數是「${primaryCard.number}．${primaryCard.name}」！你的命數是什麼？來測測看：`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "全方位個人靈魂使用說明書", text, url });
        return;
      } catch {
        // user cancelled the native share sheet, fall through to clipboard copy
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}${url}`);
    } catch {
      // clipboard API unavailable; toast still confirms intent
    }
    setShowShareToast(true);
    window.setTimeout(() => setShowShareToast(false), 2000);
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col items-center gap-4">
        <p className="text-[11px] text-[var(--sm-text-tertiary)]">已解碼日期：{profile.birthdateLabel}</p>
        <div className="w-full max-w-[300px] rounded-2xl overflow-hidden border border-[var(--sm-border)] shadow-2xl">
          <canvas
            ref={canvasRef}
            width={SOUL_CARD_WIDTH}
            height={SOUL_CARD_HEIGHT}
            className="w-full h-auto block"
          />
        </div>
        <button onClick={onDownload} className="soul-btn-secondary !text-xs">
          <Download size={14} strokeWidth={1.75} />
          一鍵保存專屬圖卡
        </button>
      </section>

      <section className="soul-panel p-6 flex flex-col gap-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-luxe-gold mb-2">靈魂特質與能量解碼</p>
          <h2 className="font-serif text-xl font-medium">
            命數 {primaryCard.number}．{primaryCard.name}
          </h2>
          {(dualCard || supplementCards.length > 0) && (
            <p className="desc-text text-xs text-[var(--sm-text-tertiary)] mt-1.5">
              {dualCard && `同時帶有「${dualCard.number} ${dualCard.name}」的雙重特質`}
              {supplementCards.length > 0 &&
                `延伸參考牌卡：${supplementCards.map((c) => `${c.number} ${c.name}`).join("、")}`}
            </p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-serif font-semibold text-luxe-gold mb-1.5">核心天賦優勢</h3>
          <p className="desc-text text-sm text-[var(--sm-text-secondary)] leading-relaxed">{primaryCard.advantage}</p>
        </div>
        <div>
          <h3 className="text-sm font-serif font-semibold text-luxe-gold mb-1.5">隱藏內耗盲點</h3>
          <p className="desc-text text-sm text-[var(--sm-text-secondary)] leading-relaxed">{primaryCard.disadvantage}</p>
        </div>
        <div className="border-t border-[var(--sm-border)] pt-4">
          <h3 className="text-sm font-serif font-semibold text-luxe-gold mb-1.5">
            日數牌：{profile.dayCard.name}（你日常外顯的樣子）
          </h3>
          <p className="desc-text text-sm text-[var(--sm-text-secondary)] leading-relaxed">{profile.dayCard.advantage}</p>
        </div>
      </section>

      <DailyGuidanceCard cardNumber={primaryCard.number} />

      <section className="flex flex-col gap-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-luxe-gold text-center">想深入了解哪一個領域？</p>
        <div className="grid grid-cols-2 gap-3">
          {DOMAINS.map((domain) => (
            <Link
              key={domain.id}
              to={unlocked ? `/app/${domain.id}` : "#unlock"}
              onClick={(e) => {
                if (!unlocked) e.preventDefault();
              }}
              className="soul-panel p-4 flex flex-col gap-1.5 relative overflow-hidden"
            >
              <span className="font-serif text-sm font-medium">{domain.label}</span>
              <span className="desc-text text-[11px] text-[var(--sm-text-tertiary)] leading-snug">
                {domain.teaser}
              </span>
              {!unlocked && (
                <Lock size={14} strokeWidth={1.75} className="absolute top-3 right-3 text-luxe-gold" />
              )}
            </Link>
          ))}
        </div>

        {!unlocked && (
          <div className="soul-panel p-6 flex flex-col items-center text-center gap-3 mt-2">
            <TotemEmblem seed={primaryCard.number} size={40} className="text-luxe-gold" />
            <p className="desc-text text-sm text-[var(--sm-text-secondary)] leading-relaxed max-w-sm">
              解鎖完整報告，取得命數人格、天賦潛能、個性剖析、感情關係、工作事業、內耗排解、流年運勢共 7 大主題的深度解析，每個主題都能一鍵複製指令，帶到你自己的 AI 無限追問。
            </p>
            <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="soul-btn-primary w-full max-w-xs">
              立即解鎖專屬完整報告（{UNLOCK_PRICE}）
            </a>
            <p className="text-[11px] text-[var(--sm-text-tertiary)]">點擊後將導向 LINE 洽詢解鎖方式</p>

            <div className="w-full max-w-xs flex flex-col gap-2 mt-3 pt-3 border-t border-[var(--sm-border)]">
              <label className="flex flex-col gap-1.5 text-left">
                <span className="text-[11px] text-[var(--sm-text-tertiary)]">已付款？輸入客服提供的解鎖碼</span>
                <input
                  value={codeInput}
                  onChange={(e) => {
                    setCodeInput(e.target.value);
                    setCodeError(false);
                  }}
                  placeholder="請輸入解鎖碼"
                  className="soul-input !py-2 !text-sm"
                />
              </label>
              <button onClick={handleCodeSubmit} disabled={!codeInput.trim()} className="soul-btn-secondary !text-xs">
                送出解鎖碼
              </button>
              {codeError && <p className="text-[11px] text-[#d98a8a]">解鎖碼不正確，請確認後再輸入一次。</p>}
            </div>
          </div>
        )}
      </section>

      <section className="soul-panel p-6 flex flex-col items-center text-center gap-3">
        <Share2 size={20} strokeWidth={1.5} className="text-luxe-gold" />
        <p className="desc-text text-sm text-[var(--sm-text-secondary)] leading-relaxed max-w-sm">
          分享你的塔羅命數給朋友，邀請他們也來解碼自己的靈魂使用說明書。
        </p>
        <button onClick={handleShare} className="soul-btn-secondary !text-xs">
          <Share2 size={14} strokeWidth={1.75} />
          分享給朋友
        </button>
        <Toast message="已複製分享文字與連結，貼給朋友吧！" show={showShareToast} />
      </section>

      <button onClick={onChangeBirthdate} className="soul-btn-secondary self-center !text-xs mt-2">
        重新解碼另一組生日
      </button>

      <p className="desc-text text-[10px] text-[var(--sm-text-tertiary)] text-center leading-relaxed mt-4">
        本報告結合生命靈數與塔羅大牌，僅供自我探索與策略參考，不能取代專業心理諮商、醫療或法律建議。資料僅於本機瀏覽器暫存，不會上傳伺服器。
      </p>
    </div>
  );
}
