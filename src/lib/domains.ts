import type { MajorArcanaCard } from "./tarotMajorArcana";
import { computeLifePathNumber, getCard } from "./tarotMajorArcana";
import type { SoulProfile } from "./soulProfile";
import {
  buildDrainRelief,
  buildLandingPlans,
  buildLifeNumberIdentity,
  buildPersonalityAnalysis,
  buildRelationshipManual,
  buildTalentPotential,
  buildYearlyOutlook,
} from "./reportText";

export interface Domain {
  id: string;
  label: string;
  teaser: string;
  buildBody: (card: MajorArcanaCard, profile: SoulProfile) => string;
  promptIntro: string;
}

function getYearCard(profile: SoulProfile): MajorArcanaCard {
  const currentYear = new Date().getFullYear();
  const lifePath = computeLifePathNumber(currentYear, profile.m, profile.d);
  return getCard(lifePath.primary);
}

export const DOMAINS: Domain[] = [
  {
    id: "identity",
    label: "命數人格",
    teaser: "你是幾號人？這組數字藏著你這一生的靈魂課題",
    buildBody: (card) => buildLifeNumberIdentity(card),
    promptIntro: "請幫我深入分析這個塔羅命數人格代表的靈魂課題與人生方向",
  },
  {
    id: "talent",
    label: "天賦潛能",
    teaser: "你與生俱來、最不該被浪費的優勢是什麼",
    buildBody: (card) => buildTalentPotential(card),
    promptIntro: "請幫我分析我的天賦潛能，以及怎麼在生活中具體發揮它",
  },
  {
    id: "personality",
    label: "個性剖析",
    teaser: "別人眼中的你，跟你自己知道的你，差在哪裡",
    buildBody: (card) => buildPersonalityAnalysis(card),
    promptIntro: "請幫我深入剖析我的個性特質，包含優勢面跟容易被誤解的地方",
  },
  {
    id: "relationship",
    label: "感情關係",
    teaser: "你在親密關係裡最容易踩到的地雷與相處之道",
    buildBody: (card) => buildRelationshipManual(card),
    promptIntro: "請幫我分析我在親密關係中的相處模式，以及該注意的地雷區",
  },
  {
    id: "career",
    label: "工作事業",
    teaser: "把天賦落地成具體行動的 3 個步驟",
    buildBody: (card) =>
      buildLandingPlans(card)
        .map((line, i) => `${i + 1}. ${line}`)
        .join("\n\n"),
    promptIntro: "請幫我把這個天賦落地成具體的職涯行動建議",
  },
  {
    id: "drain",
    label: "內耗排解",
    teaser: "找出讓你悄悄被掏空的模式，學會回血",
    buildBody: (card) => buildDrainRelief(card),
    promptIntro: "請幫我分析我容易內耗的根源，以及具體可以怎麼緩解",
  },
  {
    id: "year",
    label: "流年運勢",
    teaser: "今年疊加在你本命牌之上的額外能量主題",
    buildBody: (card, profile) => buildYearlyOutlook(card, getYearCard(profile), new Date().getFullYear()),
    promptIntro: "請結合我的本命牌與今年的流年牌，幫我分析今年的運勢重點",
  },
];

export function getDomain(id: string): Domain | undefined {
  return DOMAINS.find((d) => d.id === id);
}

const PERSONA_PREAMBLE =
  "你是一位溫暖、精準、具備深厚洞察力的高維生命導師，擅長用塔羅與生命靈數幫助人看懂自己的天賦與卡關點。請用同理心驗證我的感受，但給出非常具體、可以馬上實踐的建議，並在回答結尾反問我一個問題，引導我繼續深入討論。全程使用繁體中文。";

export const FOLLOWUP_QUESTIONS: string[] = [
  "我這段關係該繼續堅持還是放手？",
  "以我的天賦，我適合轉職還是創業？",
  "為什麼我最近總是感到很躁、靜不下來？",
  "請給我一個本週突破困局的小練習。",
];

export function buildCopyPrompt(domain: Domain, profile: SoulProfile, followUpQuestion?: string): string {
  const { primaryCard } = profile;
  const yearCard = getYearCard(profile);

  const matrixBlock =
    yearCard.number === primaryCard.number
      ? `我的本命牌是「命數 ${primaryCard.number}．${primaryCard.name}」。
我的核心優勢：${primaryCard.advantage}
我的內耗盲點：${primaryCard.disadvantage}`
      : `我的本命牌是「命數 ${primaryCard.number}．${primaryCard.name}」，${new Date().getFullYear()} 年的流年牌是「${yearCard.number}．${yearCard.name}」。
我的核心優勢：${primaryCard.advantage}
我的內耗盲點：${primaryCard.disadvantage}
今年額外疊加的主題：${yearCard.advantage}`;

  const question = followUpQuestion ? `追問：${followUpQuestion}` : `${domain.promptIntro}。`;

  return `${PERSONA_PREAMBLE}

${matrixBlock}

${question}`;
}
