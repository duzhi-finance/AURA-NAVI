import type { DailyCard } from "./dailyCard";
import type { LifeDomain, PromptTemplate, RelationshipStatus, TalentProfile } from "../types/talent";

export const LIFE_DOMAIN_OPTIONS: { value: LifeDomain; label: string }[] = [
  { value: "Career", label: "職場發展" },
  { value: "Romance", label: "親密感情" },
  { value: "Family", label: "原生家庭" },
  { value: "Interpersonal", label: "社交人際" },
];

export const LIFE_DOMAIN_LABEL: Record<LifeDomain, string> = Object.fromEntries(
  LIFE_DOMAIN_OPTIONS.map((o) => [o.value, o.label])
) as Record<LifeDomain, string>;

export const RELATIONSHIP_STATUS_OPTIONS: { value: RelationshipStatus; label: string }[] = [
  { value: "Single", label: "單身／尋覓中" },
  { value: "InRelationship", label: "交往中／婚姻中" },
  { value: "Ambiguous", label: "斷聯／模糊曖昧" },
];

export const RELATIONSHIP_STATUS_LABEL: Record<RelationshipStatus, string> = Object.fromEntries(
  RELATIONSHIP_STATUS_OPTIONS.map((o) => [o.value, o.label])
) as Record<RelationshipStatus, string>;

// Only surfaced for domains where a same-sounding typo could flip the meaning of the
// user's situation (e.g. 想交男朋友 vs 想教男朋友) into an unrelated one.
export const RELATIONSHIP_STATUS_DOMAINS: LifeDomain[] = ["Romance"];

export const ROMANCE_SINGLE_PRESETS = [
  "想交男朋友",
  "想交女朋友",
  "想脫單卻不知道從何開始",
  "容易吸引到不適合的對象",
];

const BASE_TEMPLATE_TEXT = `你現在是一位精通星際瑪雅曆（Dreamspell）、生命靈數與職場/人際心理學的「高維生命導航員」。

我已經附上我從 glowing.cc 下載的個人星系印記圖卡（包含主印記、圖騰、波符、力量動物等資訊）。
{{ Profile_Reference }}{{ Daily_Card_Reference }}{{ Relationship_Status_Guardrail }}{{ Management_Focus_Block }}
請幫我閱讀這張圖片中的所有資料，並為我進行深度解析。請依據以下四大模組輸出：

---

### ❶ 【靈魂特質與能量解碼】
* 解析圖片中的主印記（KIN）、波符、圖騰與力量動物組合。
* 分析我性格中最核心的優勢（天賦）與隱藏的挑戰（內耗來源）。
* 用一段精準且有力量的話，總結我的「靈魂天賦原形」。

### ❷ 【情境診斷與高維解答（指定領域：{{ Life_Domain }}）】
* 我目前的困境是：{{ Context_Description }}
* 根據我的圖騰特質，我在這個領域中最容易感到「躁」或「卡關」的原因是什麼？
* 請提供 3 個能幫我「擺脫笨方法、優雅發揮天賦」的落地方案。

### ❸ 【人際與關係使用說明書】
* 在此情境下，我的「地雷區」與「核心需求」是什麼？
* 當別人覺得我難相處時，其實是因為我的什麼特質被誤解了？
* 請給我一份「對方該如何跟我相處」的白話指南。

### ❹ 【給 Gemini 的深度對話引導】
* 請在回答的最後，主動拋出 2 個值得我深入思考的引導問題，並邀請我繼續和你討論。

---
【注意事項】：請直接閱讀圖片中的文字與圖騰，若圖片中有高階資訊（如 PSI、女神力等），請一併納入解析。請用溫暖、精準、具備洞察力且落地的繁體中文回答。`;

export function buildPromptTemplates(): PromptTemplate[] {
  return LIFE_DOMAIN_OPTIONS.map((d) => ({
    template_id: `tpl_${d.value.toLowerCase()}`,
    domain_type: d.value,
    domain_label: d.label,
    base_prompt_text: BASE_TEMPLATE_TEXT,
  }));
}

function deepTalentParts(profile: TalentProfile): string[] {
  const parts: string[] = [];
  if (profile.core_resonance_nuance) parts.push(`核心共鳴與性格細微差異：${profile.core_resonance_nuance}`);
  if (profile.hidden_personality) parts.push(`隱藏性格：${profile.hidden_personality}`);
  if (profile.totem_animal) parts.push(`力量動物：${profile.totem_animal}`);
  if (profile.hidden_push_psi) parts.push(`隱藏推動（PSI）：${profile.hidden_push_psi}`);
  if (profile.wavespell) parts.push(`波符：${profile.wavespell}`);
  if (profile.support_challenge_energy) parts.push(`支持能量與挑戰擴展：${profile.support_challenge_energy}`);
  return parts;
}

function profileReferenceLine(selfProfile?: TalentProfile | null): string {
  if (!selfProfile) return "";
  const parts: string[] = [];
  if (selfProfile.maya_kin != null) parts.push(`KIN ${selfProfile.maya_kin}`);
  if (selfProfile.maya_tone) parts.push(`音調：${selfProfile.maya_tone}`);
  if (selfProfile.maya_totem) parts.push(`圖騰：${selfProfile.maya_totem}`);
  if (selfProfile.life_path_num != null) parts.push(`生命靈數：${selfProfile.life_path_num}`);
  parts.push(...deepTalentParts(selfProfile));
  if (parts.length === 0) return "";
  return `（我在系統中預先典藏的資料供你參考核對：${parts.join("、")}）\n`;
}

function dailyCardReferenceLine(dailyCard?: DailyCard | null): string {
  if (!dailyCard) return "";
  return `* 今日對焦牌卡：${dailyCard.name}（${dailyCard.insight}）\n`;
}

const RELATIONSHIP_STATUS_FOCUS: Record<RelationshipStatus, string> = {
  Single:
    "當狀態為「單身／尋覓中」時，請聚焦於：個人吸引力磁場、擇偶地雷、如何吸引合適對象；切勿假設對方已有伴侶。",
  InRelationship:
    "當狀態為「交往中／婚姻中」時，請聚焦於：兩人相處磨合、溝通模式、關係維繫與衝突化解；請以使用者目前已有穩定對象為前提解讀。",
  Ambiguous:
    "當狀態為「斷聯／模糊曖昧」時，請聚焦於：釐清對方心意、辨識關係中的訊號、進退場時機；不要假設這是穩定交往關係，也不要假設兩人已完全沒有交集。",
};

function relationshipStatusGuardrail(status?: RelationshipStatus | null): string {
  if (!status) return "";
  const label = RELATIONSHIP_STATUS_LABEL[status];
  return `【關係狀態防呆設定】
目前的關係狀態為：${label}。
請特別注意：若使用者輸入包含同音錯字（如將「想交男朋友」打成「想教男朋友」），請依據其「${label}」的狀態進行解讀，切勿誤判為無關的情境（例如「已有伴侶並嘗試教育對方」）。
${RELATIONSHIP_STATUS_FOCUS[status]}
`;
}

function managementFocusBlock(active?: boolean): string {
  if (!active) return "";
  return `【管理對焦設定】
請從高維領導學與團隊心理學的角度，解析對方的天賦圖騰，並提供：1. 最能激發其產出的派工模式；2. 如何給予無內耗的反饋；3. 溝通時應避開的引爆點。
`;
}

export function generateNavigationPrompt(
  domain: LifeDomain,
  contextDescription: string,
  selfProfile?: TalentProfile | null,
  dailyCard?: DailyCard | null,
  relationshipStatus?: RelationshipStatus | null,
  isManagementFocus?: boolean
): string {
  return BASE_TEMPLATE_TEXT
    .replace("{{ Profile_Reference }}", profileReferenceLine(selfProfile))
    .replace("{{ Daily_Card_Reference }}", dailyCardReferenceLine(dailyCard))
    .replace("{{ Relationship_Status_Guardrail }}", relationshipStatusGuardrail(relationshipStatus))
    .replace("{{ Management_Focus_Block }}", managementFocusBlock(isManagementFocus))
    .replace("{{ Life_Domain }}", LIFE_DOMAIN_LABEL[domain])
    .replace("{{ Context_Description }}", contextDescription.trim() || "（尚未填寫）")
    .replace(/\n{3,}/g, "\n\n");
}

const RELATION_TEMPLATE_TEXT = `你現在是一位精通星際瑪雅曆（Dreamspell）、生命靈數與人際關係心理學的「高維關係翻譯官」。

我要請你幫我分析我與另一個人之間的天賦關係頻率。以下是雙方的星系印記資料：

【我自己】
* 暱稱：{{ Self_Name }}
* 主印記：KIN {{ Self_Kin }}｜音調：{{ Self_Tone }}｜圖騰：{{ Self_Totem }}｜生命靈數：{{ Self_LifePath }}

【對象：{{ Target_Role }}】
* 暱稱：{{ Target_Name }}
* 主印記：KIN {{ Target_Kin }}｜音調：{{ Target_Tone }}｜圖騰：{{ Target_Totem }}｜生命靈數：{{ Target_LifePath }}

（若我附上的圖片中有更完整的資訊，例如波符、力量動物、PSI 或女神力，請一併納入你的解析。）

請依據以下模組輸出：

---

### ❶ 【雙人天賦頻率解碼】
* 分別解析我與對方的圖騰特質核心。
* 指出兩人圖騰組合之間的「共鳴亮點」與「磨合挑戰」。

### ❷ 【關係磨合診斷】
* 在「{{ Target_Role }}」這個角色關係中，我們最容易在什麼情境下產生摩擦？
* 這個摩擦背後，雙方各自沒被滿足的核心需求是什麼？

### ❸ 【相處使用說明書】
* 給我一份「如何跟對方溝通最有效」的具體做法（語氣、時機、方式）。
* 給我一份「我該如何調整自己」讓這段關係更順暢的建議。

### ❹ 【給 Gemini 的深度對話引導】
* 請在回答最後，主動拋出 2 個能幫助我更理解這段關係的引導問題，邀請我繼續討論。

---
【注意事項】：請用溫暖、精準、具備洞察力且落地的繁體中文回答，避免空泛的星座式描述，盡量給出可執行的具體建議。`;

function fmt(value: string | number | null | undefined, fallback = "未填寫"): string {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

function notesLine(label: string, profile: TalentProfile): string {
  if (!profile.relationship_notes.trim()) return "";
  return `* ${label}的相處備註：${profile.relationship_notes.trim()}\n`;
}

function deepTalentLine(label: string, profile: TalentProfile): string {
  const parts = deepTalentParts(profile);
  if (parts.length === 0) return "";
  return `* ${label}的深度天賦資料：${parts.join("；")}\n`;
}

export function generateRelationPrompt(
  self: TalentProfile,
  target: TalentProfile
): string {
  const targetRole = target.profile_type.trim() || "對象";
  return RELATION_TEMPLATE_TEXT.replace("{{ Self_Name }}", fmt(self.name_alias, "我"))
    .replace("{{ Self_Kin }}", fmt(self.maya_kin))
    .replace("{{ Self_Tone }}", fmt(self.maya_tone))
    .replace("{{ Self_Totem }}", fmt(self.maya_totem))
    .replace("{{ Self_LifePath }}", fmt(self.life_path_num))
    .replace(/\{\{ Target_Role \}\}/g, targetRole)
    .replace("{{ Target_Name }}", fmt(target.name_alias))
    .replace("{{ Target_Kin }}", fmt(target.maya_kin))
    .replace("{{ Target_Tone }}", fmt(target.maya_tone))
    .replace("{{ Target_Totem }}", fmt(target.maya_totem))
    .replace("{{ Target_LifePath }}", fmt(target.life_path_num))
    .replace(
      "（若我附上的圖片中有更完整的資訊，例如波符、力量動物、PSI 或女神力，請一併納入你的解析。）",
      `${notesLine("我", self)}${notesLine(targetRole, target)}${deepTalentLine("我", self)}${deepTalentLine(targetRole, target)}（若我附上的圖片中有更完整的資訊，例如波符、力量動物、PSI 或女神力，請一併納入你的解析。）`
    );
}

export function buildFullProfileSummary(profile: TalentProfile): string {
  const lines: string[] = [];
  lines.push("✦ AURA-Navi 星軌檔案 ✦");
  lines.push(`${fmt(profile.name_alias, "我")}｜KIN ${fmt(profile.maya_kin)}`);
  lines.push(`主印記：${fmt(profile.maya_totem)}．${fmt(profile.maya_tone)}`);
  if (profile.life_path_num != null) lines.push(`生命靈數：${profile.life_path_num}`);
  lines.push("");
  lines.push(...deepTalentParts(profile));
  lines.push("");
  lines.push("—— 由 AURA-Navi 星軌導航系統生成");
  return lines.join("\n").replace(/\n{3,}/g, "\n\n");
}

export const DEEP_DIVE_PROMPTS: { title: string; buildText: (totem: string) => string }[] = [
  {
    title: "職場加薪／定位",
    buildText: () => "請根據我的天賦圖譜，分析我最適合的職場突破點與加薪策略。",
  },
  {
    title: "履歷與提案優化",
    buildText: (totem) => `幫我寫一份符合我「${totem || "天賦圖騰"}」洞察力特質的商業提案大綱。`,
  },
  {
    title: "內耗排解",
    buildText: () => "當我覺得直覺被質疑、與團隊不對頻時，我該如何進行心理調頻？",
  },
  {
    title: "重要決策日選取",
    buildText: () => "請告訴我接下來這個月，最適合我進行重要商業談判的流年日期。",
  },
];

export const GEMINI_URL = "https://gemini.google.com";
export const GLOWING_URL = "https://glowing.cc";
export const LINE_URL = "https://line.me/R/ti/p/@799vhtvj";
