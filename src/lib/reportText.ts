import type { MajorArcanaCard } from "./tarotMajorArcana";
import type { SoulProfile } from "./soulProfile";

export function excerpt(text: string, maxLen: number): string {
  const firstClause = text.split(/[、。]/)[0] ?? text;
  if (firstClause.length <= maxLen) return firstClause;
  return `${firstClause.slice(0, maxLen)}…`;
}

/** Concrete suggested fields/directions per primary life-path card (0-21), hand-mapped to each card's core theme. */
const SUGGESTED_DIRECTIONS: Record<number, string[]> = {
  0: ["新創業務開發", "自由接案工作者", "內容創作／自媒體", "旅遊、體驗相關產業"],
  1: ["創業當老闆", "行銷企劃", "業務開發", "整合型專案統籌"],
  2: ["研究分析", "心理諮商／教練", "人資與招募", "命理、占卜類顧問"],
  3: ["藝術創作", "美容美業", "療癒相關工作", "教育、社福類工作"],
  4: ["中高階管理職", "自己創業當老闆", "專案管理", "軍警公職、紀律型組織"],
  5: ["教學、培訓講師", "顧問諮詢", "傳產家業管理", "法律、會計類專業"],
  6: ["業務公關", "設計、創意產業", "媒合／media 類工作", "活動企劃"],
  7: ["業務銷售、衝業績型工作", "運動教練、健身產業", "創業（衝刺型）", "競技、比賽相關領域"],
  8: ["諮商、輔導工作", "護理、照護產業", "教育訓練", "危機處理、客訴應對角色"],
  9: ["研究員、工程師", "寫作、文字工作", "數據分析", "宗教、靈性相關工作"],
  10: ["業務、投資相關工作", "自由工作者", "趨勢、潮流相關產業", "跨領域斜槓發展"],
  11: ["法律相關工作", "財務、會計、稽核", "管理決策職位", "仲裁、調解類角色"],
  12: ["社工、輔導工作", "心理諮商", "靈性、身心靈工作", "客服、後勤支援角色"],
  13: ["轉型顧問", "整理收納、斷捨離相關服務", "危機處理、重組專案", "二次創業"],
  14: ["人資", "中介、仲介類工作", "諮商、協調角色", "團隊潤滑／跨部門溝通職位"],
  15: ["業務銷售", "投資理財相關工作", "娛樂產業", "精品、時尚銷售"],
  16: ["急難救助、救護相關", "危機公關", "高風險新創", "改革、轉型型職位"],
  17: ["自媒體、品牌經營", "療癒產業", "非營利組織", "願景、策略型角色"],
  18: ["心理諮商", "藝術創作", "風控、保險相關工作", "占卜、命理類顧問"],
  19: ["業務", "演藝、主持、表演", "教育培訓", "公關、活動主持"],
  20: ["教練（Coach）", "宗教、靈性工作", "人資訓練", "轉職、生涯顧問"],
  21: ["專案總監", "國際業務", "整合型管理職", "顧問、策略規劃角色"],
};

export function getSuggestedDirections(card: MajorArcanaCard): string[] {
  return SUGGESTED_DIRECTIONS[card.number] ?? SUGGESTED_DIRECTIONS[0];
}

export function buildLifeNumberIdentity(profile: SoulProfile): string {
  const { primaryCard: card, dayCard } = profile;
  return `命數 ${card.number}，在塔羅的系統裡對應的是「${card.name}」——這張牌不只是一個分類標籤，它更像是你靈魂選擇這一世要練習的主題。

你是${card.name}型的人，代表你這一生最核心的課題，就藏在這張牌的優劣勢裡：

${card.advantage}

${card.disadvantage}

除了命數牌之外，你的出生「日數」對應到「${dayCard.name}」——這是你日常外顯、第一眼就會被人看到的樣子：${excerpt(dayCard.advantage, 40)}。如果說命數牌是你這一生的深層課題，日數牌就是你平常展現出來的樣貌，兩者合在一起，才是完整的你。

跟你同樣是${card.name}型的人，會有類似的核心驅動力，但活出來的樣子可能天差地遠——差別就在於有沒有「自覺」。知道自己是${card.name}型、外顯是${dayCard.name}型，等於拿到一份自己的使用說明書，接下來的每一個選擇，都可以更貼近自己真正的設定，而不是照著別人的劇本走。`;
}

export function buildTalentPotential(profile: SoulProfile): string {
  const { primaryCard: card, dayCard } = profile;
  const directions = getSuggestedDirections(card);
  return `你與生俱來、最不該被浪費的天賦，就是${card.name}帶給你的這股力量：

${card.advantage}

很多人終其一生都在尋找自己的天賦，但你的天賦其實早就在那裡了——只是太熟悉，反而容易被你自己忽略，甚至覺得「這有什麼了不起」。真正厲害的人，不是擁有稀有的天賦，而是知道怎麼把自己本來就有的東西，用得淋漓盡致。

而阻礙天賦發揮的，往往是同一張牌的另一面：

${card.disadvantage}

天賦跟內耗常常是一體兩面——你最強的地方，用力過猛時就會變成弱點。練習的重點不是逼自己變成另一種人，而是學會收放：知道什麼時候該讓${card.name}的力量全開，什麼時候該踩煞車，讓它維持在剛剛好的強度。

你的日數牌「${dayCard.name}」則補上了另一個角度：${excerpt(dayCard.advantage, 40)}。這代表你的天賦不會只用一種樣子展現，有時候是${card.name}的方式，有時候是${dayCard.name}的方式，兩者交替出現才是你真實的全貌。

適合你發揮這份天賦的具體方向，可以參考：${directions.join("、")}。這些不是標準答案，而是跟你天賦特質最契合的領域——真正適合你的位置，往往就藏在這幾個方向的交集裡。`;
}

export function buildPersonalityAnalysis(profile: SoulProfile): string {
  const { primaryCard: card, dayCard } = profile;
  return `你的日常行為模式，說穿了是${card.name}與${dayCard.name}這兩張牌交織出來的樣子。

先看別人眼中的你，往往是這樣的：

${card.advantage}

這是你最自然、不用刻意表現就會流露出來的樣子——也是身邊的人會記住你、信任你的原因。

但每個人格都有它的影子面，你的影子藏在這裡：

${card.disadvantage}

有趣的是，這兩面其實是同一股力量的正反面，不是兩個互相矛盾的你。認識自己最快的方式，不是去消滅影子面，而是學會在對的場合，讓對的那一面上場。

再疊加你的日數牌「${dayCard.name}」，這是你比較表層、第一印象容易被看見的部分：${dayCard.advantage}不過要留意，${excerpt(dayCard.disadvantage, 34)}，這也常常是旁人誤解你的起點。命數牌是裡子、日數牌是面子——當這兩張牌的氣質差異越大，你給人的感覺就越「有反差」，也越容易被說「跟我想的不一樣」。`;
}

export function buildRelationshipManual(profile: SoulProfile): string {
  const { primaryCard: card, dayCard } = profile;
  return `你在親密關係中最容易被觸發、感到「不對勁」的根源，其實就藏在${card.name}的核心特質裡：

${card.disadvantage}

這不是你的缺點，而是你保護自己、保護這段關係的方式——只是這個方式有時候會被對方誤讀成疏遠、強勢，或難以靠近。地雷區：當你不自覺地陷入這個模式時，最容易讓親密的人感到不解或受傷，也是關係裡最常被誤會、最容易吵起來的時刻。

但真正該被看見的，是你的優勢面：

${card.advantage}

白話相處指南：讓對方明白，你需要的不是被糾正，而是被理解——只要給你多一點空間、多一點耐心去發揮這個特質，你反而會在關係裡展現出最溫暖、最可靠的一面。

你的日數牌「${dayCard.name}」會影響你在關係初期給對方的第一印象：${excerpt(dayCard.advantage, 36)}。如果你發現自己剛認識一個人時表現得很不一樣，但熟了之後又變回${card.name}的樣子，這是正常的——那是你從「展現面」慢慢走回「真實面」的過程，對方需要一點時間才跟得上這個轉變。

下次卡關時，與其急著解釋，不如把這段話原封不動地讓對方看一次，讓TA真正看懂你。`;
}

export function buildLandingPlans(profile: SoulProfile): string[] {
  const { primaryCard: card } = profile;
  const directions = getSuggestedDirections(card);
  return [
    `辨認你的核心天賦——「${card.advantage}」——這是你在職場上最不該被浪費的武器。刻意在工作中創造能讓這個特質正大光明發揮的場景，而不是被動等待機會自己出現；每一次主動出擊，都是在替自己的天賦「正名」，也是在累積別人對你的信任與能見度。`,
    `留意你的內耗盲點——「${card.disadvantage}」——這股力量沒被好好安放時，就會反過來消耗你自己，甚至悄悄影響身邊的人對你的觀感。建立一個提醒自己踩煞車的機制，例如固定時間覆盤、找一個信任的人定期提醒你，把「被動承受」變成「主動管理」，你會發現內耗其實是可以被訓練、被縮小的。`,
    `參考你的天賦特質最契合的方向——${directions.join("、")}——如果你正在考慮轉職、創業或找新方向，這幾個領域值得優先評估；如果你已經在相關領域，代表你走的路跟天賦本來就是對的，接下來要做的是深耕而不是轉彎。`,
    `本週具體行動：找一個能讓你發揮${card.name}特質、又不會踩到盲點的小任務，把它當成一次「優雅發揮天賦」的練習，而不是「用蠻力硬撐」。做完之後花五分鐘記下這次的感受與結果，這會成為你之後判斷「什麼時候該衝、什麼時候該收」最重要的依據，也是你逐步把天賦練成本能的開始。`,
  ];
}

export function buildDrainRelief(profile: SoulProfile): string {
  const { primaryCard: card, dayCard } = profile;
  return `你會感到內耗，通常不是因為「做得不夠多」，而是因為${card.name}特質裡的這一面正在悄悄消耗你：

${card.disadvantage}

這股力量沒有被看見、沒有被安放時，就會從「保護你」變成「困住你」——明明很累，卻又說不出具體是為了什麼。

真正能讓你回血的方式，是回到你的核心優勢，重新把力氣放在對的地方：

${card.advantage}

你的日數牌「${dayCard.name}」也有它容易耗損的一面：${excerpt(dayCard.disadvantage, 34)}。這代表你的內耗其實有兩層——一層是深層的${card.name}課題，一層是表層的${dayCard.name}消耗，兩層同時發作時，就是你感覺「整個人被掏空」的時候，值得分開辨認、分開處理。

下次感覺被掏空時，先別急著逼自己振作，試著問自己：「我現在是不是又掉進${excerpt(card.disadvantage, 20)}的迴圈了？」光是辨認出這個模式，就已經是鬆綁的開始。`;
}

export function buildYearlyOutlook(primaryCard: MajorArcanaCard, yearCard: MajorArcanaCard, year: number): string {
  if (yearCard.number === primaryCard.number) {
    return `${year} 年對你來說是一個特別的年份——這一年的能量牌剛好疊回你的本命牌「${primaryCard.name}」，等於是把你的核心課題再加強一次。今年很適合正面迎向${excerpt(primaryCard.advantage, 24)}這件事，把它活得更徹底，而不是繞路。`;
  }
  return `你今年的流年牌是「${yearCard.number}．${yearCard.name}」——這是今年疊加在你本命「${primaryCard.name}」之上的額外能量主題。

今年的核心提醒是：${yearCard.advantage}

而今年要留意的卡關點：${yearCard.disadvantage}

把你的本命牌（${primaryCard.name}）當作底色，今年的流年牌（${yearCard.name}）則是這一年特別被放大的主題——兩者疊在一起看，會比單看一張牌更接近你今年實際會經歷的樣子。`;
}
