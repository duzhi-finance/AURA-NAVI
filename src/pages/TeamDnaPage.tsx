import { Compass, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import TotemEmblem from "../components/TotemEmblem";
import { computeKinFromBirthdate, type DreamspellResult } from "../lib/dreamspellKin";
import { MAYA_TOTEMS } from "../lib/mayaOptions";

export default function TeamDnaPage() {
  const [birthdate, setBirthdate] = useState("");
  const [result, setResult] = useState<DreamspellResult | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!birthdate) return;
    const [y, m, d] = birthdate.split("-").map(Number);
    setResult(computeKinFromBirthdate(y, m, d));
  }

  const seed = result ? MAYA_TOTEMS.indexOf(result.totem) : 0;

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16 bg-bg">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Compass size={20} strokeWidth={1.5} className="text-text-primary" />
          <span className="font-serif text-text-primary">AURA-Navi</span>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-light text-text-primary">高維天賦圖譜</h1>
          <p className="mt-3 text-sm text-text-secondary leading-relaxed">
            你的職場天賦原型與能量指南
          </p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="panel p-7 flex flex-col gap-5">
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
            <button type="submit" className="btn-primary justify-center">
              <Sparkles size={16} strokeWidth={1.75} />
              生成我的天賦圖騰
            </button>
          </form>
        ) : (
          <div className="card-luxe card-halo p-8 flex flex-col items-center text-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.15em] text-text-tertiary">
              Your Talent Seal
            </span>
            <TotemEmblem seed={seed >= 0 ? seed : 0} size={96} className="text-luxe-gold my-2" />
            <div className="text-2xl font-serif font-normal text-text-primary">{result.totem}</div>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-text-secondary mt-1">
              <span className="rounded-lg bg-bg border border-border px-2.5 py-1 font-serif">
                KIN {result.kin}
              </span>
              <span className="rounded-lg bg-bg border border-border px-2.5 py-1">
                音調：{result.tone}
              </span>
            </div>

            <p className="text-xs text-text-tertiary leading-relaxed mt-4 pt-4 border-t border-border">
              將此圖卡截圖傳送給你的主管或 HR，即可完成天賦建檔。
            </p>

            <button
              onClick={() => {
                setResult(null);
                setBirthdate("");
              }}
              className="btn-secondary border border-border mt-1"
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

        <Footer />
      </div>
    </div>
  );
}
