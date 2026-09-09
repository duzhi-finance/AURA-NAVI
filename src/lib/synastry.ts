import { kinToResult, type DreamspellResult } from "./dreamspellKin";
import { MAYA_TOTEMS } from "./mayaOptions";

export type RelationshipRole = "Supporting" | "Guiding" | "Challenging" | "PSI";

export const RELATIONSHIP_ROLE_LABEL: Record<RelationshipRole, string> = {
  Supporting: "支持（Supporting）",
  Guiding: "引導（Guiding）",
  Challenging: "挑戰擴張（Challenging）",
  PSI: "隱藏推動（PSI）",
};

export const RELATIONSHIP_ROLE_GUIDE: Record<RelationshipRole, string> = {
  Supporting: "對方是你的能量後盾，相處時給予肯定與信任，關係會愈來愈順。",
  Guiding: "對方帶著你看見新的角度，適合多請教、多觀察對方的做事方式。",
  Challenging: "對方容易踩到你的地雷，也最能磨練你，溝通時放慢步調、對事不對人。",
  PSI: "與對方同頻共振，容易一拍即合，但也可能互相放大彼此的盲點，需要適時拉開距離覆盤。",
};

/** 合相印記（Composite KIN）：兩人 KIN 相加後對 260 取模，0 視為 260。 */
export function computeCompositeKin(selfKin: number, targetKin: number): DreamspellResult {
  const sum = (selfKin + targetKin) % 260;
  return kinToResult(sum === 0 ? 260 : sum);
}

/**
 * 關係角色判定：以既有的支持／挑戰圖騰位移（totem+10／totem+5）為基礎，
 * 再加上「同調性」判為 PSI 隱藏推動共振，其餘視為引導關係。
 */
export function classifyRelationshipRole(
  selfKin: number,
  targetKin: number
): RelationshipRole {
  const selfIndex0 = selfKin - 1;
  const targetIndex0 = targetKin - 1;
  const selfTotemIdx = selfIndex0 % 20;
  const targetTotemIdx = targetIndex0 % 20;
  const selfToneIdx = selfIndex0 % 13;
  const targetToneIdx = targetIndex0 % 13;

  if (targetTotemIdx === (selfTotemIdx + 10) % 20) return "Supporting";
  if (targetTotemIdx === (selfTotemIdx + 5) % 20 || targetTotemIdx === (selfTotemIdx + 15) % 20) {
    return "Challenging";
  }
  if (targetToneIdx === selfToneIdx) return "PSI";
  return "Guiding";
}

export function totemLabel(kin: number): string {
  const kinIndex0 = kin - 1;
  return MAYA_TOTEMS[kinIndex0 % 20];
}
