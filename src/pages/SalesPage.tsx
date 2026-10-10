import {
  Compass,
  Gem,
  Lock,
  MessageCircle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ChapterLabel, IssueLabel, PullQuote, VerticalMicrocopy } from "../components/Editorial";
import Footer from "../components/Footer";
import { LINE_URL } from "../lib/links";

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
    title: "七大領域深度解析",
    description: "命數人格、天賦潛能、個性剖析、感情關係、工作事業、內耗排解、流年運勢，每個主題都能一直往下探索。",
  },
  {
    title: "一鍵複製指令，無限追問",
    description: "每個解析下方都有專屬提示詞，複製貼到你慣用的 AI，就能延續同一個對話串繼續深聊。",
  },
];

const SEVEN_DIMENSIONS: { title: string; description: string }[] = [
  { title: "命數人格", description: "你是幾號人？這組數字藏著你這一生最核心的靈魂課題。" },
  { title: "天賦潛能", description: "找出你與生俱來、最不該被浪費的優勢，學會收放自如地發揮它。" },
  { title: "個性剖析", description: "別人眼中的你，跟你自己知道的你，差在哪裡——看懂自己的正面與影子面。" },
  { title: "感情關係", description: "你在親密關係裡最容易踩到的地雷，以及最自然的相處之道。" },
  { title: "工作事業", description: "把天賦落地成具體可行的職涯行動方案，而不是停在想法階段。" },
  { title: "內耗排解", description: "找出讓你悄悄被掏空的模式，學會把力氣放回對的地方。" },
  { title: "流年運勢", description: "本命牌疊加今年的流年牌，掌握這一年特別被放大的能量主題。" },
];

const QUALITY_PROMISES: { Icon: LucideIcon; title: string; description: string }[] = [
  { Icon: Lock, title: "獨立本機儲存", description: "所有檔案僅保留於你的個人裝置，完全不上傳雲端，保障最高隱私。" },
  { Icon: Sparkles, title: "一鍵複製指令", description: "精密編排高維提示詞，複製後貼到你慣用的 AI，開啟高品質的無限追問對話。" },
  { Icon: Gem, title: "雜誌視覺美學", description: "採用古典繁體宋體與柔和粉系配色，帶來宛如翻閱精品刊物般的極致享受。" },
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
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-text-primary leading-relaxed tracking-[0.04em]">
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

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {PAIN_POINTS.map((p) => (
              <div key={p.title} className="card-glass p-7">
                <h3 className="font-serif text-base font-semibold text-text-primary tracking-[0.03em]">
                  {p.title}
                </h3>
                <p className="desc-text text-sm text-text-secondary leading-relaxed mt-3">
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
            AURA-Navi 是一套結合塔羅生命靈數與現代策略的高維解碼工具。我們將你內在的神秘學特質，精準翻譯成世俗看得懂的「商業策略、溝通話術與客製化提案」：
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {TRANSLATION_FEATURES.map((f) => (
              <div key={f.title} className="card-glass p-6 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-luxe-gold text-sm shrink-0">✦</span>
                  <div className="font-serif text-sm font-semibold text-text-primary">{f.title}</div>
                </div>
                <p className="desc-text text-xs text-text-secondary leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Chapter 03 -- Six Dimensions */}
        <section className="mb-28 relative overflow-hidden">
          <VerticalMicrocopy text="SEVEN DIMENSIONS OF SOUL" className="top-0 right-0 hidden md:block" />
          <ChapterLabel number="03" title="深度天賦圖譜" className="mb-5" />
          <h2 className="font-serif text-xl md:text-2xl font-medium text-text-primary tracking-[0.04em] leading-relaxed">
            拒絕標籤化，直擊靈魂最細微的性格紋理。
          </h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {SEVEN_DIMENSIONS.map((d) => (
              <div key={d.title} className="card-glass p-6 flex flex-col gap-2 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-luxe-gold text-sm shrink-0">✦</span>
                  <div className="font-serif text-sm font-semibold text-text-primary">{d.title}</div>
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
              <div key={title} className="card-glass p-6 flex flex-col gap-2">
                <Icon size={18} strokeWidth={1.25} className="text-text-primary" />
                <div className="font-serif text-sm font-semibold text-text-primary">{title}</div>
                <p className="desc-text text-xs text-text-secondary leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center gap-4">
            <div className="w-14 h-px bg-[#D8C8C0]" />
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-serif text-sm text-text-secondary hover:text-luxe-gold transition-colors"
            >
              <MessageCircle size={16} strokeWidth={1.5} />
              完成對焦後，誠摯邀請你加入官方 LINE @799vhtvj，與我們分享這趟旅程的迴響
            </a>
          </div>

          <p className="desc-text text-[11px] text-text-tertiary leading-[1.5] mt-6 max-w-md mx-auto">
            本產品為數位天賦導航軟體與指令內容，一經發送交付即可享受完整高維對焦體驗。
          </p>
        </section>

        <Footer />
        <div className="h-20" />
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <Link to="/app" className="btn-cta-pill !text-sm !py-3 !px-6">
          <Sparkles size={15} strokeWidth={1.75} />
          開啟星軌導航
        </Link>
      </div>
    </div>
  );
}
