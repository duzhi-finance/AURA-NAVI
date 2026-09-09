import {
  Compass,
  Gem,
  Lock,
  MessageCircle,
  Radar,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ChapterLabel, IssueLabel, PullQuote, VerticalMicrocopy } from "../components/Editorial";
import Footer from "../components/Footer";
import { LINE_URL } from "../lib/promptTemplates";

const PAIN_POINTS: { title: string; description: string }[] = [
  {
    title: "遠見被當成不切實際",
    description: "你早就看透了全貌與趨勢，周遭的人卻還在糾結微小的細節。",
  },
  {
    title: "直覺被質疑沒有數據",
    description: "你擁有極強的第六感與導航感，卻不知道如何用世俗的語言說服主管或客戶。",
  },
  {
    title: "無意義的精力消耗",
    description: "不懂如何避開對方的地雷，每天花大量內耗處理不對頻的溝通。",
  },
];

const TRANSLATION_FEATURES: { title: string; description: string }[] = [
  {
    title: "商業策略與精準提案",
    description: "將你的直覺洞察，轉化為邏輯嚴謹、具備高度商業價值的策略報告。",
  },
  {
    title: "頻率校準策略",
    description: "自動算定當日流年（進攻日／沉澱日），鎖定今日最適合進行的商業突破點。",
  },
  {
    title: "無痛團隊破冰",
    description:
      "提供「靈魂天賦原貌｜30 秒職場頻率與充電模式檢測」輕頁面，讓主管與團隊成員在無隱私壓力的氛圍下輕鬆對焦。",
  },
];

const SIX_DIMENSIONS: { title: string; description: string }[] = [
  { title: "核心共鳴與細微差異", description: "解析調性微光，看見同圖騰下的微觀性格特質。" },
  { title: "對方的隱藏性格", description: "揭開對方的潛意識防線，找到最舒服的相處距離。" },
  { title: "力量動物（Totem Animal）", description: "召喚內在直覺圖騰，找回身體與行動力的最高頻率。" },
  { title: "隱藏推動（PSI）", description: "喚醒沉睡在記憶庫深處的爆發力與底層天賦。" },
  { title: "波符藍圖（Wavespell）", description: "明確你此生 13 天的生命軸線與靈魂使命。" },
  { title: "支持與挑戰擴展", description: "清楚掌握誰是你的靈魂貴人，誰是磨練你的擴展石。" },
];

const QUALITY_PROMISES: { Icon: LucideIcon; title: string; description: string }[] = [
  { Icon: Lock, title: "獨立本機儲存", description: "所有檔案僅保留於你的個人裝置，完全不上傳雲端，保障最高隱私。" },
  { Icon: Sparkles, title: "一鍵 Gemini 導航", description: "精密編排高維 Navigation Prompt，複製後直連 Gemini 開啟高品質對話。" },
  { Icon: Gem, title: "雜誌視覺美學", description: "採用古典繁體宋體與柔和莫蘭迪色系，帶來宛如翻閱精品刊物般的極致享受。" },
];

export default function SalesPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 md:py-24">
        {/* Header */}
        <header className="text-center mb-24">
          <IssueLabel
            text="AURA-Navi Journal ── SPECIAL EDITION / VOL.01"
            className="justify-center inline-flex mb-5"
          />
          <div className="flex items-center justify-center gap-2.5">
            <Compass size={22} strokeWidth={1.5} className="text-text-primary" />
            <span className="font-serif text-lg text-text-primary tracking-[0.05em]">
              AURA-Navi｜高維天賦導航樞紐
            </span>
          </div>
          <p className="desc-text text-sm text-text-tertiary mt-3">
            The High-Dimensional Compass for Cosmic Souls.
          </p>
        </header>

        {/* Cover Story / Hero */}
        <section className="relative mb-28 text-center overflow-hidden">
          <VerticalMicrocopy text="HIGH-DIMENSION COMPASS" className="top-0 right-0 hidden md:block" />
          <ChapterLabel number="00" title="封面宣言" className="justify-center flex mb-6" />
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-text-primary leading-relaxed tracking-[0.04em]">
            告別世俗的笨方法。
            <br />
            你不是不夠努力，你只是不必再抹滅天賦。
          </h1>
          <div className="mt-10">
            <PullQuote>收回想要改造自己的掌控手把，將自己活成一個優雅、閃耀的示範者。</PullQuote>
          </div>
          <p className="desc-text text-sm text-text-secondary leading-relaxed max-w-lg mx-auto mt-8">
            笨方法，是用你的短板去迎合世俗的框架；
            <br />
            高明的方法，是將你內在的宇宙天賦，精準翻譯為商業世界的絕對定海神針。
          </p>
        </section>

        {/* Chapter 01 -- Pain Points */}
        <section className="mb-28">
          <ChapterLabel number="01" title="痛點解構" className="mb-5" />
          <h2 className="font-serif text-xl md:text-2xl font-medium text-text-primary tracking-[0.04em] leading-relaxed">
            宇宙小孩的世俗卡點：你擁有一流的遠見，卻苦於笨拙的翻譯。
          </h2>
          <p className="desc-text text-sm text-text-secondary leading-relaxed mt-4 max-w-lg">
            身為感知敏銳的靈性靈魂，你是否常常在職場與關係中感到無比挫折？
          </p>

          <div className="mt-8 flex flex-col gap-4">
            {PAIN_POINTS.map((p) => (
              <div key={p.title} className="panel p-6">
                <div className="text-sm font-medium text-text-primary">{p.title}</div>
                <p className="desc-text text-sm text-text-secondary leading-relaxed mt-2">
                  {p.description}
                </p>
              </div>
            ))}
          </div>

          <p className="desc-text text-sm text-text-primary leading-relaxed mt-8 border-t border-border pt-6">
            AURA-Navi 不教你扭曲自己去迎合世界，我們幫你做「高維精準對焦」。
          </p>
        </section>

        {/* Chapter 02 -- Translation Mechanism */}
        <section className="mb-28">
          <ChapterLabel number="02" title="翻譯機制" className="mb-5" />
          <h2 className="font-serif text-xl md:text-2xl font-medium text-text-primary tracking-[0.04em] leading-relaxed">
            不懂神秘學沒關係，我們替你講出商業世界聽得懂的語言。
          </h2>
          <p className="desc-text text-sm text-text-secondary leading-relaxed mt-4 max-w-lg">
            AURA-Navi 是一套結合星際瑪雅曆與現代策略的 AI 導航樞紐。我們將你內在的神秘學特質，精準翻譯成世俗看得懂的「商業策略、溝通話術與客製化提案」：
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {TRANSLATION_FEATURES.map((f) => (
              <div key={f.title} className="card-luxe card-hover p-6 flex flex-col gap-2">
                <span className="text-luxe-gold">✦</span>
                <div className="text-sm font-medium text-text-primary">{f.title}</div>
                <p className="desc-text text-xs text-text-secondary leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Chapter 03 -- Six Dimensions */}
        <section className="mb-28 relative overflow-hidden">
          <VerticalMicrocopy text="SIX DIMENSIONS OF SOUL" className="top-0 right-0 hidden md:block" />
          <ChapterLabel number="03" title="深度天賦圖譜" className="mb-5" />
          <h2 className="font-serif text-xl md:text-2xl font-medium text-text-primary tracking-[0.04em] leading-relaxed">
            拒絕標籤化，直擊靈魂最細微的性格紋理。
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {SIX_DIMENSIONS.map((d) => (
              <div key={d.title} className="panel p-6 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Radar size={14} strokeWidth={1.5} className="text-luxe-gold shrink-0" />
                  <div className="text-sm font-medium text-text-primary">{d.title}</div>
                </div>
                <p className="desc-text text-xs text-text-secondary leading-relaxed">
                  {d.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Chapter 04 -- Quality Promises + CTA */}
        <section className="text-center">
          <ChapterLabel number="04" title="高級感體驗" className="justify-center flex mb-8" />

          <div className="grid gap-4 sm:grid-cols-3 text-left">
            {QUALITY_PROMISES.map(({ Icon, title, description }) => (
              <div key={title} className="panel p-6 flex flex-col gap-2">
                <Icon size={18} strokeWidth={1.25} className="text-text-primary" />
                <div className="text-sm font-medium text-text-primary">{title}</div>
                <p className="desc-text text-xs text-text-secondary leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <Link to="/app" className="btn-primary justify-center mt-12 mx-auto !text-base !px-8 !py-3.5">
            <Sparkles size={16} strokeWidth={1.75} />
            開啟你的 AURA-Navi 星軌導航
          </Link>

          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 text-xs text-text-tertiary hover:text-text-secondary transition-colors"
          >
            <MessageCircle size={14} strokeWidth={1.5} />
            測完了嗎？加入官方 LINE @799vhtvj，跟我分享你的結果準不準
          </a>

          <p className="desc-text text-[11px] text-text-tertiary leading-[1.5] mt-6 max-w-md mx-auto">
            本產品為數位天賦導航軟體與指令內容，一經發送交付即可享受完整高維對焦體驗。
          </p>
        </section>

        <Footer />
      </div>
    </div>
  );
}
