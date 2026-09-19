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
  return `你在親密關係中最容易感到「躁」的原因，來自${card.name}特質中的：${excerpt(card.disadvantage, 40)}。

地雷區：當你不自覺地陷入這個模式時，最容易讓親密的人感到不解或受傷，也是最常被誤會的時刻。

白話相處指南：對方需要明白，你的優勢其實是「${excerpt(card.advantage, 32)}」——只要給你多一點空間去發揮這個特質，你反而會展現出最好的一面。`;
}

export function buildLandingPlans(card: MajorArcanaCard): string[] {
  return [
    `辨認出你的核心天賦：「${excerpt(card.advantage, 36)}」，刻意在工作中創造能發揮它的場景，而不是等機會自己出現。`,
    `留意你的內耗盲點：「${excerpt(card.disadvantage, 36)}」，建立一個提醒自己踩煞車的機制，例如固定時間覆盤。`,
    `本週先做一件事：找一個能讓你發揮${card.name}特質、又不會踩到盲點的小任務，練習「優雅發揮天賦」而不是「用蠻力硬撐」。`,
  ];
}

export function buildWavespellGuide(wavespell: string, kin: number, totem: string): string {
  return `你的年度能量轉化鑰匙，來自「${wavespell}」的底色——這股力量與你 KIN ${kin}．${totem} 的本命特質彼此呼應，是你這一年最該留意的隱藏節奏。

當你感覺卡關、內耗時，回到「${totem}」最純粹的樣子，就是你重新校準高維頻率的方式。`;
}
