import { Compass, MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { IssueLabel } from "../components/Editorial";
import { AppFooter } from "../components/Footer";
import TotemEmblem from "../components/TotemEmblem";
import { TONE_COMMUNICATION_STYLE, TONE_NUANCE, TONE_RECHARGE_MODE } from "../lib/deepTalent";
import { computeKinFromBirthdate, type DreamspellResult } from "../lib/dreamspellKin";
import { MAYA_TONES, MAYA_TOTEMS } from "../lib/mayaOptions";
import { LINE_URL } from "../lib/promptTemplates";

export default function TeamDnaPage() {
  const [nickname, setNickname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [result, setResult] = useState<DreamspellResult | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!birthdate) return;
    const [y, m, d] = birthdate.split("-").map(Number);
    setResult(computeKinFromBirthdate(y, m, d));
  }

  const totemSeed = result ? MAYA_TOTEMS.indexOf(result.totem) : 0;
  const toneIdx = result ? MAYA_TONES.indexOf(result.tone) : 0;

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16 bg-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-3">
          <IssueLabel text="AURA-Navi Journal ── ISSUE VOL.01 / AUTUMN" className="justify-center inline-flex" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-8">
          <Compass size={20} strokeWidth={1.5} className="text-text-primary" />
          <span className="font-serif text-text-primary">AURA-Navi</span>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-2xl font-light text-text-primary leading-snug">
            ✦ 團隊天賦原貌對焦
            <br />
            <span className="text-lg">｜AURA-Navi</span>
          </h1>
          <p
            className="font-serif leading-relaxed mt-3"
            style={{ color: "#7A7571", fontSize: "13px" }}
          >
            無需熟悉複雜指標，只需 10 秒輸入資訊，為您生成專屬的職場溝通頻率與天賦圖譜。
          </p>
        </div>

        {!result ? (
          <form
            onSubmit={handleSubmit}
            className="rounded-xl flex flex-col gap-5"
            style={{ background: "#FAF9F6", border: "1px solid #E2D8D8", padding: "32px" }}
          >
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-text-secondary">您的稱呼 / 姓名</span>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="請輸入您的稱呼"
                className="input-base"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-text-secondary">出生年月日</span>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="input-base"
                required
              />
            </label>
            <button type="submit" className="btn-luxe-cta">
              <Sparkles size={16} strokeWidth={1.75} />
              生成我的職場天賦卡片
            </button>
          </form>
        ) : (
          <div className="card-luxe card-halo p-8 flex flex-col items-center text-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.15em] text-text-tertiary">
              Team Talent Card
            </span>
            {nickname.trim() && (
              <div className="text-sm text-text-secondary">{nickname.trim()}</div>
            )}
            <TotemEmblem seed={totemSeed >= 0 ? totemSeed : 0} size={96} className="text-luxe-gold my-2" />
            <div className="text-2xl font-serif font-medium text-text-primary">{result.totem}</div>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-text-secondary mt-1">
              <span className="rounded-lg bg-bg border border-border px-2.5 py-1 font-serif font-semibold">
                KIN {result.kin}
              </span>
              <span className="rounded-lg bg-bg border border-border px-2.5 py-1">
                音調：{result.tone}
              </span>
            </div>

            <div className="w-full flex flex-col gap-2.5 mt-4 pt-4 border-t border-border text-left">
              <TalentCardRow label="核心特質" value={TONE_NUANCE[toneIdx] ?? ""} />
              <TalentCardRow label="適合的溝通方式" value={TONE_COMMUNICATION_STYLE[toneIdx] ?? ""} />
              <TalentCardRow label="能量充電模式" value={TONE_RECHARGE_MODE[toneIdx] ?? ""} />
            </div>

            <p className="desc-text text-xs text-text-tertiary leading-relaxed mt-2 pt-4 border-t border-border">
              將此圖卡截圖傳送給你的主管或 HR，即可完成天賦建檔。
            </p>

            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxe-cta mt-1 !text-xs !py-2 !px-4"
            >
              <MessageCircle size={13} strokeWidth={1.75} />
              準不準？到 LINE 跟我分享你的結果
            </a>

            <button
              onClick={() => {
                setResult(null);
                setBirthdate("");
              }}
              className="btn-secondary border border-border"
            >
              重新測驗
            </button>
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/" className="text-xs text-text-tertiary hover:text-text-secondary underline">
            了解更多關於 AURA-Navi
          </Link>
        </div>

        <AppFooter />
      </div>
    </div>
  );
}

function TalentCardRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="rounded-lg bg-bg border border-border px-3 py-2.5 text-xs">
      <span className="text-text-tertiary">{label}：</span>
      <span className="desc-text text-text-secondary">{value}</span>
    </div>
  );
}
