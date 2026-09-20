import type { SoulReport } from "../pages/SoulManual";
import { excerpt } from "./reportText";

export interface ChatChip {
  id: string;
  label: string;
}

export interface ChatNode {
  reply: (report: SoulReport, turn: number) => string;
  followups: ChatChip[];
}

const OPENERS = [
  "我聽到你了，這種感覺真的不容易。",
  "謝謝你願意跟我說這些，這是很真實的感受。",
  "這個部分，很多和你同款命盤的人也會遇到，你不是特例。",
  "先讓我陪你梳理一下，再一起看怎麼往前走。",
  "嗯，這一題問得好，我們慢慢拆解。",
];

const CLOSERS = [
  "針對這個部分，你最近有沒有遇過類似的狀況？",
  "如果方便的話，可以多跟我說說當下發生了什麼嗎？",
  "這個建議你可以先試一週看看，有進展的話再回來跟我說？",
  "你會想先從哪一個方向開始呢？",
  "聽起來你已經有感覺了，要不要再往下聊聊？",
];

function pick(bank: string[], turn: number): string {
  return bank[((turn % bank.length) + bank.length) % bank.length];
}

const CHIP = {
  relationship: { id: "relationship", label: "我最近在感情/人際關係上卡關" },
  career: { id: "career", label: "我在工作上遇到瓶頸" },
  talent: { id: "talent", label: "我想知道怎麼發揮我的天賦" },
  drain: { id: "drain", label: "我最近很容易內耗、情緒低落" },
  year: { id: "year", label: "我想了解今年的能量重點" },
  money: { id: "money", label: "我想聊聊財務/金錢狀況" },
  growth: { id: "growth", label: "我想聊聊自我成長方向" },
} as const satisfies Record<string, ChatChip>;

export const INITIAL_CHIPS: ChatChip[] = [
  CHIP.relationship,
  CHIP.career,
  CHIP.talent,
  CHIP.drain,
  CHIP.year,
  CHIP.money,
  CHIP.growth,
];

const NODES: Record<string, ChatNode> = {
  relationship: {
    reply: (report, turn) => {
      const { primaryCard: card } = report;
      return `${pick(OPENERS, turn)}

你在關係裡容易「躁」的根源，來自${card.name}特質中的：${excerpt(card.disadvantage, 40)}。這種時刻，最容易讓對方覺得被拒於門外，其實你只是在用自己的方式保護關係。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "relationship_deepen", label: "這個模式最常發生在什麼情況？" },
      { id: "relationship_howto", label: "那我該怎麼開口跟對方說？" },
      { id: "career", label: "換個話題，聊聊我的工作" },
    ],
  },
  relationship_deepen: {
    reply: (report, turn) => {
      const { primaryCard: card } = report;
      return `${pick(OPENERS, turn)}

多半發生在你覺得「說了也沒用」或「對方應該懂」的時候——${card.name}的特質讓你習慣自己扛，久了對方反而感覺不到你的在乎。這不是你不在乎，是你表達在乎的方式跟對方接收的方式不同步。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "relationship_howto", label: "那我該怎麼開口跟對方說？" },
      { id: "career", label: "了解，換個話題聊聊工作" },
    ],
  },
  relationship_howto: {
    reply: (report, turn) => {
      const { primaryCard: card } = report;
      return `${pick(OPENERS, turn)}

你可以試著這樣開口：「我知道我剛剛看起來很${excerpt(card.disadvantage, 12)}，但我其實是希望${excerpt(card.advantage, 18)}，只是還在練習怎麼講出來。」把「防衛」翻譯成「需求」，對方會更容易接住你。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "talent", label: "換個話題，聊聊我的天賦" },
      { id: "year", label: "換個話題，了解今年的能量重點" },
    ],
  },
  career: {
    reply: (report, turn) => {
      const { primaryCard: card } = report;
      return `${pick(OPENERS, turn)}

在工作上，你的破局點就藏在${card.name}的優勢裡：${excerpt(card.advantage, 40)}。卡關往往不是能力不夠，而是還沒找到能讓這個優勢正大光明發揮的場景——先問自己，最近哪個任務其實最需要這個特質？

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "career_procrastinate", label: "如果是內耗導致的拖延怎麼辦？" },
      { id: "career_talk", label: "那我該怎麼跟主管/同事表達？" },
      { id: "relationship", label: "換個話題，聊聊感情" },
    ],
  },
  career_procrastinate: {
    reply: (report, turn) => {
      const { primaryCard: card } = report;
      return `${pick(OPENERS, turn)}

拖延常常是${excerpt(card.disadvantage, 30)}在背後煞車——不是不想做，是怕做不到自己設的標準。建議把任務切到「五分鐘就能開始」的第一步，讓身體先動起來，完美主義的聲音自然會小聲一點。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "drain", label: "換個話題，聊聊內耗情緒" },
      { id: "talent", label: "換個話題，聊聊我的天賦" },
    ],
  },
  career_talk: {
    reply: (report, turn) => {
      const { primaryCard: card } = report;
      return `${pick(OPENERS, turn)}

跟主管或同事表達時，可以用「事實＋需求」的句型：「我在${excerpt(card.advantage, 16)}這件事上很有把握，但需要多一點時間/空間來完成，這樣成果會更好。」把你的優勢講成貢獻，而不是解釋自己的難處。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "year", label: "換個話題，了解今年的能量重點" },
      { id: "relationship", label: "換個話題，聊聊感情" },
    ],
  },
  talent: {
    reply: (report, turn) => {
      const { primaryCard: card } = report;
      return `${pick(OPENERS, turn)}

你的天賦核心是：${excerpt(card.advantage, 44)}。很多人以為天賦要靠「更努力」才能發揮，但對你來說，恰恰相反——你需要的是「刻意留白」，讓這個特質有空間自然展現，而不是硬撐出來的。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "talent_start", label: "那要怎麼開始練習？" },
      { id: "talent_stuck", label: "如果我很難跨出第一步怎麼辦？" },
      { id: "year", label: "換個話題，了解今年的能量重點" },
    ],
  },
  talent_start: {
    reply: (report, turn) => {
      const { primaryCard: card } = report;
      return `${pick(OPENERS, turn)}

從一件「小到不會有壓力」的事開始：這週找一個能自然展現${excerpt(card.advantage, 20)}的小場合，刻意去做，不用求結果，只是讓自己重新熟悉這股力量的手感。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "talent_stuck", label: "如果我很難跨出第一步怎麼辦？" },
      { id: "year", label: "換個話題，了解今年的能量重點" },
    ],
  },
  talent_stuck: {
    reply: (report, turn) => {
      const { primaryCard: card } = report;
      return `${pick(OPENERS, turn)}

卡在第一步，通常是${excerpt(card.disadvantage, 30)}悄悄接管了方向盤。試著把「我要做到多好」換成「我只是先開始」——天賦不需要完美的起點，它只需要一個起點。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "drain", label: "換個話題，聊聊內耗情緒" },
      { id: "relationship", label: "換個話題，聊聊感情" },
    ],
  },
  drain: {
    reply: (report, turn) => {
      const { primaryCard: card } = report;
      return `${pick(OPENERS, turn)}

你的內耗多半來自${excerpt(card.disadvantage, 40)}——這股力量本身不是壞事，只是沒被好好安放時，就會回頭消耗你自己。先不用急著改掉它，光是「看見它」就已經在鬆動它的力道了。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "drain_relief", label: "那我平常可以怎麼緩解？" },
      { id: "drain_impact", label: "如果影響到工作/感情怎麼辦？" },
      { id: "talent", label: "換個話題，聊聊我的天賦" },
    ],
  },
  drain_relief: {
    reply: (report, turn) => {
      const { totem } = report;
      return `${pick(OPENERS, turn)}

平常可以建立一個小小的「歸零儀式」：每天留 5-10 分鐘，回到「${totem}」最純粹的狀態——不用做什麼，只是讓自己停下來，感受一下此刻的身體和呼吸，這是你重新校準頻率最快的方式。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "talent", label: "換個話題，聊聊我的天賦" },
      { id: "career", label: "換個話題，聊聊工作" },
    ],
  },
  drain_impact: {
    reply: (report, turn) => {
      const { totem } = report;
      return `${pick(OPENERS, turn)}

當內耗開始外溢到工作或感情，通常是提醒你該踩煞車、留白休息了，而不是要你更用力撐住。先把手邊最消耗你的一件事暫時放下，回到「${totem}」的節奏裡，你會發現其他關係跟工作反而鬆動得比想像中快。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "relationship", label: "換個話題，聊聊感情" },
      { id: "career", label: "換個話題，聊聊工作" },
    ],
  },
  year: {
    reply: (report, turn) => {
      const { wavespell, kin, totem } = report;
      return `${pick(OPENERS, turn)}

你今年的能量底色來自「${wavespell}」，這股力量跟你 KIN ${kin}．${totem} 的本命特質彼此呼應，是你這一年最該留意的隱藏節奏。當你感覺卡關時，回到「${totem}」最純粹的樣子，就是重新校準的方式。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "year_month", label: "那這個月我該注意什麼？" },
      { id: "year_unlucky", label: "如果我最近諸事不順怎麼辦？" },
      { id: "drain", label: "換個話題，聊聊內耗情緒" },
    ],
  },
  year_month: {
    reply: (report, turn) => {
      const { tone, totem } = report;
      return `${pick(OPENERS, turn)}

這個月建議把重心放在「${tone}」音調帶來的節奏感上——順著它做決定，而不是逆著它硬撐。「${totem}」的能量這陣子特別適合收斂、整理，而不是大開大闔地衝刺。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "talent", label: "換個話題，聊聊我的天賦" },
      { id: "drain", label: "換個話題，聊聊內耗情緒" },
    ],
  },
  year_unlucky: {
    reply: (report, turn) => {
      const { primaryCard: card } = report;
      return `${pick(OPENERS, turn)}

諸事不順的時候，往往是${card.name}的內耗面被放大了。這不是運氣不好，是提醒你該回到「${excerpt(card.advantage, 20)}」這個核心優勢上，而不是繼續用消耗自己的方式硬撐過去。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "talent", label: "換個話題，聊聊我的天賦" },
      { id: "relationship", label: "換個話題，聊聊感情" },
    ],
  },
  money: {
    reply: (report, turn) => {
      const { primaryCard: card } = report;
      return `${pick(OPENERS, turn)}

你跟金錢的關係，其實反映的是${card.name}特質怎麼看待「安全感」——${excerpt(card.advantage, 34)}，這是你賺錢、談判、爭取應得報酬時最大的底氣。但${excerpt(card.disadvantage, 30)}，也常常悄悄影響你看待金錢的方式，讓你在該爭取的時候猶豫，或在該收手的時候停不下來。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "money_deepen", label: "這個模式具體會怎麼影響我？" },
      { id: "money_action", label: "那我該怎麼調整？" },
      { id: "career", label: "換個話題，聊聊工作" },
    ],
  },
  money_deepen: {
    reply: (report, turn) => {
      const { primaryCard: card } = report;
      return `${pick(OPENERS, turn)}

具體來說，${card.name}的內耗面容易讓你在金錢上做出「情緒化」而非「策略性」的決定——可能是該談加薪時退縮，也可能是心情不好就花錢犒賞自己，事後又懊悔。這不是自制力的問題，是還沒有一套屬於你的金錢決策節奏。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "money_action", label: "那我該怎麼調整？" },
      { id: "growth", label: "換個話題，聊聊自我成長" },
    ],
  },
  money_action: {
    reply: (report, turn) => {
      const { primaryCard: card } = report;
      return `${pick(OPENERS, turn)}

建議你建立一個「先擱置 24 小時」的小規則——不管是大筆花費還是重要的金錢決定，都先放一天再行動，讓${excerpt(card.advantage, 20)}的理性面有機會介入，而不是任由情緒面主導。同時，練習把「我值得」掛在嘴邊，尤其是在談判、爭取報酬的時候。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "career", label: "換個話題，聊聊工作" },
      { id: "drain", label: "換個話題，聊聊內耗情緒" },
    ],
  },
  growth: {
    reply: (report, turn) => {
      const { primaryCard: card } = report;
      return `${pick(OPENERS, turn)}

你的成長方向，其實藏在${card.name}最擅長的事情裡：${excerpt(card.advantage, 36)}。很多人以為自我成長是要「補足弱點」，但對你來說，真正的突破反而是把這個已經很強的特質，練到更純熟、更收放自如。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "growth_deepen", label: "那我該從哪裡開始練習？" },
      { id: "growth_action", label: "如果我一直停滯不前怎麼辦？" },
      { id: "year", label: "換個話題，了解今年的能量重點" },
    ],
  },
  growth_deepen: {
    reply: (report, turn) => {
      const { primaryCard: card } = report;
      return `${pick(OPENERS, turn)}

從一個你已經在做、卻沒有特別重視的小習慣開始——那很可能就是${excerpt(card.advantage, 20)}正在悄悄運作的證據。把它變成刻意練習，而不是理所當然的日常，你會發現它能被放大到意想不到的程度。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "growth_action", label: "如果我一直停滯不前怎麼辦？" },
      { id: "talent", label: "換個話題，聊聊我的天賦" },
    ],
  },
  growth_action: {
    reply: (report, turn) => {
      const { primaryCard: card } = report;
      return `${pick(OPENERS, turn)}

停滯感通常不是因為你不夠努力，而是${excerpt(card.disadvantage, 30)}讓你卡在原地打轉。試著找一件小到不會引發這個模式的事情先做，用「小勝利」慢慢累積信心，而不是一開始就挑戰最難的關卡。

${pick(CLOSERS, turn)}`;
    },
    followups: [
      { id: "drain", label: "換個話題，聊聊內耗情緒" },
      { id: "money", label: "換個話題，聊聊財務狀況" },
    ],
  },
};

export function getNode(id: string): ChatNode {
  return NODES[id] ?? NODES.talent;
}
