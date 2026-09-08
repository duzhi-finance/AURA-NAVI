import { MAYA_TONES, MAYA_TOTEMS } from "./mayaOptions";

export interface DeepTalentData {
  core_resonance_nuance: string;
  hidden_personality: string;
  totem_animal: string;
  hidden_push_psi: string;
  wavespell: string;
  support_challenge_energy: string;
}

// Index-aligned with MAYA_TOTEMS. A self-consistent flavor mapping used across the
// app's "entertainment reference" deep-talent module -- not a claim of orthodox
// Dreamspell sourcing.
const TOTEM_ANIMALS = [
  "鱷魚", "蒼鷹", "貓頭鷹", "蜂鳥", "響尾蛇", "禿鷹", "棕熊", "孔雀",
  "海豚", "灰狼", "蜘蛛猴", "駿馬", "遊隼", "白鹿", "金鵰", "美洲豹",
  "犀牛", "白虎", "黑豹", "獅子",
];

const TOTEM_SHADOW = [
  "過度掌控、難以放手的滋養焦慮", "想說卻又怕被誤解的溝通壓抑", "過度謹慎、放大風險的直覺懷疑",
  "完美主義下的選擇困難", "生存焦慮引發的過度防衛", "害怕告別、拖延結束的執著",
  "事必躬親、難以信任他人的掌控欲", "在意他人眼光的自我懷疑", "情緒起伏被放大的敏感脆弱",
  "過度忠誠而委屈自己的討好傾向", "用玩笑掩飾真實脆弱的逃避", "過度理性壓抑感受的疏離",
  "心猿意馬、難以落地的漂浮感", "神秘難懂、拒絕解釋的疏遠", "站得太高而忽略細節的疏離感",
  "戰鬥模式下的過度好勝", "過度共感他人而迷失自己", "過度誠實而顯得尖銳的直言",
  "情緒瞬間引爆的爆裂力", "過度耀眼引發他人比較心結的壓力",
];

// Index-aligned with MAYA_TONES.
export const TONE_NUANCE = [
  "統合與吸引核心目標的意圖", "消化挑戰、穩定情緒的耐力", "服務他人、啟動行動的爆發",
  "定義自我形式與界線的精準", "突破限制、放大影響力的張力", "找到平衡與公平節奏的敏感",
  "調頻與他人深度連結的能力", "建立模型與典範的整合力", "點亮核心真理、照見全局的洞察",
  "展現與落實使命的推進力", "釋放與解放舊有框架的自由", "合作共創、透明分享的結構",
  "超越、包容一切的臨在",
];

const TONE_PSI = [
  "一旦鎖定目標便難以被說服放棄的向心力", "長期隱忍後一次爆發的清理能量", "臨場反應與即刻服務的行動本能",
  "被逼到底線時展現的堅定意志", "極限壓力下突然開竅的躍進力", "失衡久了會自動尋求平衡的修復本能",
  "深夜獨處時湧現的直覺共感", "混亂中自動歸納秩序的整合本能", "被質疑時反而更明亮的自信爆發",
  "責任當頭時瞬間展現的執行力", "被困住太久後徹底釋放的解放衝動", "團隊瓶頸時主動搭橋的協調本能",
  "看淡得失後湧現的巨大包容力",
];

// Index-aligned with MAYA_TONES -- used by the team quiz result card.
export const TONE_COMMUNICATION_STYLE = [
  "直接說明目標與期待，給予明確方向最有效。", "給予耐心與空間，讓對方消化後再回應。",
  "用簡短有力的指令即可啟動行動，不必多加解釋。", "清楚劃定界線與角色分工，避免模糊地帶。",
  "適時給予挑戰與高目標，能激發最大表現。", "強調公平與平衡，避免偏袒才能建立信任。",
  "先建立情感連結，再談公事會更順暢。", "提供架構與範例，讓對方參照建立模型。",
  "給予舞台與肯定，讓對方展現核心價值。", "賦予明確任務與截止日期，讓對方主動推進。",
  "給予彈性與自主空間，避免過度規範。", "透明公開資訊，邀請共同參與決策。",
  "給予大方向即可，細節放心交給對方統籌。",
];

export const TONE_RECHARGE_MODE = [
  "獨處釐清目標，重新聚焦意圖後即可充電。", "充足睡眠與情緒抒發，是最好的修復方式。",
  "短暫高強度活動（如運動）能快速恢復能量。", "獨立完成一件小事，重建自我掌控感。",
  "接觸新鮮刺激或挑戰，能重新點燃動力。", "規律作息與大自然散步，找回內在平衡。",
  "與親近的人深度對話，感受情感連結。", "整理歸納資訊或環境，重建秩序感。",
  "被看見、被肯定的時刻，是最好的充電。", "完成一項具體任務、打勾清單，最有成就感。",
  "放空、旅行或脫離常規行程，釋放壓力。", "與團隊共創、分享成果，感受歸屬感。",
  "靜心冥想或獨處沉澱，回到內在中心。",
];

export function computeDeepTalent(kinIndex0Based: number): DeepTalentData {
  const totemIdx = ((kinIndex0Based % 20) + 20) % 20;
  const toneIdx = ((kinIndex0Based % 13) + 13) % 13;
  const wavespellIdx = Math.floor((((kinIndex0Based % 260) + 260) % 260) / 13);

  const totem = MAYA_TOTEMS[totemIdx];
  const tone = MAYA_TONES[toneIdx];
  const supportTotem = MAYA_TOTEMS[(totemIdx + 10) % 20];
  const challengeTotem = MAYA_TOTEMS[(totemIdx + 5) % 20];

  return {
    core_resonance_nuance: `在「${totem}」的原型下，「${tone}」調性讓你的表現更著重於：${TONE_NUANCE[toneIdx]}`,
    hidden_personality: `表面之下，「${totem}」容易在壓力時展現：${TOTEM_SHADOW[totemIdx]}`,
    totem_animal: TOTEM_ANIMALS[totemIdx],
    hidden_push_psi: `「${tone}」調性深層蘊藏的爆發力：${TONE_PSI[toneIdx]}`,
    wavespell: `${MAYA_TOTEMS[wavespellIdx]}波符`,
    support_challenge_energy: `支持能量來自「${supportTotem}」特質的夥伴；挑戰擴展來自「${challengeTotem}」特質的磨練者。`,
  };
}
