import type { ProfileType } from "../types/talent";

export const PROFILE_TYPE_OPTIONS: { value: ProfileType; label: string }[] = [
  { value: "Self", label: "自己" },
  { value: "Partner", label: "伴侶" },
  { value: "Family", label: "家人" },
  { value: "Manager", label: "主管" },
  { value: "Client", label: "客戶" },
  { value: "Friend", label: "朋友" },
];

export const PROFILE_TYPE_LABEL: Record<ProfileType, string> = Object.fromEntries(
  PROFILE_TYPE_OPTIONS.map((o) => [o.value, o.label])
) as Record<ProfileType, string>;

export const MAYA_TOTEMS = [
  "紅龍", "白風", "藍夜", "黃種子", "紅蛇", "白世界橋", "藍手", "黃星星",
  "紅月", "白狗", "藍猴", "黃人", "紅天行者", "白巫師", "藍鷹", "黃戰士",
  "紅地球", "白鏡", "藍風暴", "黃太陽",
];

export const MAYA_TONES = [
  "磁性", "月亮", "電力", "自我存在", "超頻", "韻律", "共振",
  "銀河星系", "太陽", "行星", "光譜", "水晶", "宇宙",
];
