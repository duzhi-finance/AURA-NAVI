import { computeGoddessKin, computePsiKin, kinToResult } from "./dreamspellKin";
import { MAYA_TOTEMS } from "./mayaOptions";

/** 20 圖騰 -> 5 大地球家族（每 4 個圖騰一組，依 MAYA_TOTEMS 排序均分）。 */
export const EARTH_FAMILIES = ["中央家族", "訊號家族", "極性家族", "門戶家族", "光之家族"];

export function earthFamilyOf(totemIdx0: number): string {
  return EARTH_FAMILIES[Math.floor(totemIdx0 / 4)];
}

/** 20 圖騰 -> 7 脈輪（循環對應）。 */
export const CHAKRAS = ["頂輪", "眉心輪", "喉輪", "心輪", "太陽神經叢輪", "臍輪", "海底輪"];

const CHAKRA_TRAITS: string[] = [
  "與更高視野連結，容易看見全局趨勢與長遠格局。",
  "直覺與洞察力強，善於看穿表象、預見未說出口的訊息。",
  "表達與溝通的樞紐，能把複雜想法轉譯成清楚的語言。",
  "同理與連結的核心，容易感受他人情緒、建立深度信任。",
  "自信與行動力的引擎，敢於承擔、推動事情落地。",
  "創造力與人際魅力所在，擅長開啟新關係與新提案。",
  "根基與安全感的來源，穩定時最能承受高強度壓力。",
];

export function chakraOf(totemIdx0: number): string {
  return CHAKRAS[totemIdx0 % 7];
}

export function chakraTraitOf(totemIdx0: number): string {
  return CHAKRA_TRAITS[totemIdx0 % 7];
}

export interface ChakraAttunement {
  /** 建議精油／香氛氣味。 */
  scent: string;
  /** 建議水晶。 */
  crystal: string;
  /** 自我肯定句。 */
  affirmation: string;
}

/** 每個脈輪的日常調頻建議（香氛、水晶、肯定句），依 CHAKRAS 順序排列。 */
const CHAKRA_ATTUNEMENTS: ChakraAttunement[] = [
  { scent: "乳香", crystal: "紫水晶", affirmation: "我信任生命的更高安排。" },
  { scent: "薰衣草", crystal: "靛藍螢石", affirmation: "我清晰看見自己的方向。" },
  { scent: "薄荷／尤加利", crystal: "藍晶石", affirmation: "我可以誠實且安全地表達真相。" },
  { scent: "玫瑰", crystal: "粉晶", affirmation: "我值得被愛，也願意柔軟地愛人。" },
  { scent: "檸檬／薑", crystal: "黃虎眼石", affirmation: "我有力量，也有能力承擔。" },
  { scent: "橙花", crystal: "橙色瑪瑙", affirmation: "我允許自己享受創造與連結的喜悅。" },
  { scent: "岩蘭草", crystal: "紅碧玉", affirmation: "我在此時此地，是安全且被支持的。" },
];

export function chakraAttunementOf(totemIdx0: number): ChakraAttunement {
  return CHAKRA_ATTUNEMENTS[totemIdx0 % 7];
}

export interface ChakraCardRow {
  role: "本命 KIN" | "PSI 隱藏推動" | "內在女神力";
  kin: number;
  totem: string;
  chakra: string;
  earthFamily: string;
  trait: string;
  roleContext: string;
  attunement: ChakraAttunement;
}

const ROLE_CONTEXT: Record<ChakraCardRow["role"], string> = {
  "本命 KIN": "職場表皮特質 —— 別人第一眼看到、日常互動中最常展現的你。",
  "PSI 隱藏推動": "底層潛意識爆發力 —— 被逼到底線或極限壓力下才會浮現的深層力量。",
  "內在女神力": "極限壓力下的修復安穩建議 —— 讓你重新回到中心、找回柔軟力量的方式。",
};

export function buildChakraCard(birthKin: number): ChakraCardRow[] {
  const psiKin = computePsiKin(birthKin);
  const goddessKin = computeGoddessKin(birthKin);

  return (
    [
      { role: "本命 KIN" as const, kin: birthKin },
      { role: "PSI 隱藏推動" as const, kin: psiKin },
      { role: "內在女神力" as const, kin: goddessKin },
    ] satisfies { role: ChakraCardRow["role"]; kin: number }[]
  ).map(({ role, kin }) => {
    const result = kinToResult(kin);
    const totemIdx0 = MAYA_TOTEMS.indexOf(result.totem);
    return {
      role,
      kin: result.kin,
      totem: result.totem,
      chakra: chakraOf(totemIdx0),
      earthFamily: earthFamilyOf(totemIdx0),
      trait: chakraTraitOf(totemIdx0),
      roleContext: ROLE_CONTEXT[role],
      attunement: chakraAttunementOf(totemIdx0),
    };
  });
}
