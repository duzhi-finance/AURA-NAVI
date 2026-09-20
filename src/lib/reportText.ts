import type { MajorArcanaCard } from "./tarotMajorArcana";
import { MAYA_TOTEMS } from "./mayaOptions";

export function excerpt(text: string, maxLen: number): string {
  const firstClause = text.split(/[、。]/)[0] ?? text;
  if (firstClause.length <= maxLen) return firstClause;
  return `${firstClause.slice(0, maxLen)}…`;
}

export function wavespellName(kin: number): string {
  const kinIndex0 = kin - 1;
  const wavespellStart0 = kinIndex0 - (kinIndex0 % 13);
  return `${MAYA_TOTEMS[wavespellStart0 % 20]}波符`;
}

export function buildRelationshipManual(card: MajorArcanaCard): string {
  return `你在親密關係中最容易被觸發、感到「不對勁」的根源，其實就藏在${card.name}的核心特質裡：

${card.disadvantage}

這不是你的缺點，而是你保護自己、保護這段關係的方式——只是這個方式有時候會被對方誤讀成疏遠、強勢，或難以靠近。地雷區：當你不自覺地陷入這個模式時，最容易讓親密的人感到不解或受傷，也是關係裡最常被誤會、最容易吵起來的時刻。

但真正該被看見的，是你的優勢面：

${card.advantage}

白話相處指南：讓對方明白，你需要的不是被糾正，而是被理解——只要給你多一點空間、多一點耐心去發揮這個特質，你反而會在關係裡展現出最溫暖、最可靠的一面。下次卡關時，與其急著解釋，不如把這段話原封不動地讓對方看一次，讓TA真正看懂你。`;
}

export function buildLandingPlans(card: MajorArcanaCard): string[] {
  return [
    `辨認你的核心天賦——「${card.advantage}」——這是你在職場上最不該被浪費的武器。刻意在工作中創造能讓這個特質正大光明發揮的場景，而不是被動等待機會自己出現；每一次主動出擊，都是在替自己的天賦「正名」，也是在累積別人對你的信任與能見度。`,
    `留意你的內耗盲點——「${card.disadvantage}」——這股力量沒被好好安放時，就會反過來消耗你自己，甚至悄悄影響身邊的人對你的觀感。建立一個提醒自己踩煞車的機制，例如固定時間覆盤、找一個信任的人定期提醒你，把「被動承受」變成「主動管理」，你會發現內耗其實是可以被訓練、被縮小的。`,
    `本週具體行動：找一個能讓你發揮${card.name}特質、又不會踩到盲點的小任務，把它當成一次「優雅發揮天賦」的練習，而不是「用蠻力硬撐」。做完之後花五分鐘記下這次的感受與結果，這會成為你之後判斷「什麼時候該衝、什麼時候該收」最重要的依據，也是你逐步把天賦練成本能的開始。`,
  ];
}

export function buildWavespellGuide(wavespell: string, kin: number, totem: string): string {
  return `你的年度能量轉化鑰匙，來自「${wavespell}」的底色——這股力量與你 KIN ${kin}．${totem} 的本命特質彼此呼應，是你這一年最該留意、也最容易被忽略的隱藏節奏。

當外在環境變動、計畫被打亂的時候，這股波符的力量會特別明顯——它不是要阻礙你，而是在提醒你「該調整步伐」了。順著它的節奏走，會比逆著它硬闖輕鬆許多，成果往往也更好。

當你感覺卡關、內耗，甚至有點迷失方向時，回到「${totem}」最純粹的樣子——不加修飾、不勉強自己扮演別人期待的角色——就是你重新校準高維頻率、找回自己步調的方式。建議把這段指引存下來，每次感覺不對勁的時候拿出來重讀一次，你會發現答案其實一直都在你自己身上，只是需要被重新喚醒。`;
}
