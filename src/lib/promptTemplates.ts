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

export function buildGuardPrompt(
  self: TalentProfile,
  target: TalentProfile,
  roleLabel: string,
  roleGuide: string,
  compositeKin: number,
  compositeTotem: string
): string {
  const targetRole = target.profile_type.trim() || "對象";
  return `你現在是一位精通星際瑪雅曆（Dreamspell）與職場人際心理學的「高維關係翻譯官」。

我要跟「${targetRole}｜${fmt(target.name_alias)}」（KIN ${fmt(target.maya_kin)}．${fmt(target.maya_totem)}）互動，我自己是 KIN ${fmt(self.maya_kin)}．${fmt(self.maya_totem)}。

雙方的合相印記（Composite KIN）為 KIN ${compositeKin}．${compositeTotem}，判定關係屬性為「${roleLabel}」：${roleGuide}

請根據以上資訊，給我一份「${targetRole}溝通攻心大綱」，包含：
1. 與對方互動時最容易踩到的地雷與誤解來源。
2. 最能打動對方、建立信任的溝通切入點。
3. 面對意見分歧時，最有效的化解與說服策略。

請用溫暖、精準、具備洞察力且落地的繁體中文回答，避免空泛的星座式描述。`;
}

export interface SynastryTopicGroup {
  key: string;
  label: string;
  questions: string[];
}

/** 合盤對焦的多面向問題選單：職場／感情／家庭人際／商業合夥，各附 2 道預設深度問題。 */
export const SYNASTRY_TOPIC_GROUPS: SynastryTopicGroup[] = [
  {
    key: "career",
    label: "職場",
    questions: ["對方潛意識的溝通地雷是什麼？", "如何用對方聽得懂的語言提案？"],
  },
  {
    key: "romance",
    label: "感情",
    questions: ["我們在親密關係中的核心磨合點在哪？", "如何給予對方安全感？"],
  },
  {
    key: "family",
    label: "家庭／人際",
    questions: ["面對家人的期待與情緒勒索，我該如何劃清界線？", "如何用不傷感情的方式表達自己的立場？"],
  },
  {
    key: "partnership",
    label: "商業合夥",
    questions: ["我們適合合作創業或投資嗎？", "財務分工上，我們彼此的互補點在哪？"],
  },
];

/** 合盤區的「生成專屬合盤 Gemini 深度解讀 Prompt」：打包自己+對方 KIN、合相結果，與挑選/自訂的問題。 */
export function buildSynastryQuestionPrompt(params: {
  selfKin: number;
  selfTotem: string;
  partnerName: string;
  partnerKin: number;
  partnerTotem: string;
  roleLabel: string;
  roleGuide: string;
  compositeKin: number;
  compositeTotem: string;
  questions: string[];
  customQuestion: string;
}): string {
  const name = params.partnerName.trim() || "對方";
  const items = [...params.questions];
  if (params.customQuestion.trim()) items.push(params.customQuestion.trim());
  const questionList =
    items.length > 0
      ? items.map((q, i) => `${i + 1}. ${q}`).join("\n")
      : "1. 請針對我們之間的合盤結果，給我最重要的相處建議。";

  return `你現在是一位精通星際瑪雅曆（Dreamspell）與人際關係心理學的「高維關係翻譯官」。

我要跟「${name}」（KIN ${params.partnerKin}．${params.partnerTotem}）互動，我自己是 KIN ${params.selfKin}．${params.selfTotem}。
雙方的合相印記（Composite KIN）為 KIN ${params.compositeKin}．${params.compositeTotem}，判定關係屬性為「${params.roleLabel}」：${params.roleGuide}

我想請你深入回答以下問題：
${questionList}

請用溫暖、精準、具備洞察力且落地的繁體中文回答，避免空泛的星座式描述，並在回答最後主動提出 2 個能幫助我更理解這段關係的追問問題。`;
}

export interface ScenarioCategory {
  key: string;
  label: string;
  questions: string[];
}

/** 全方位情境追問區的 5 大面向，各附 4-5 道深度問題。 */
export const SCENARIO_CATEGORIES: ScenarioCategory[] = [
  {
    key: "career",
    label: "職場商業",
    questions: [
      "這份提案要如何包裝，才能讓主管一聽就買單？",
      "我該如何為自己爭取加薪或升遷的黃金時機？",
      "面對辦公室政治與競爭，我該如何守住自己的位置？",
      "我適合現在轉職或創業嗎？該注意什麼？",
      "如何在會議中用最有效的方式展現我的專業？",
    ],
  },
  {
    key: "romance",
    label: "感情親密",
    questions: [
      "我在親密關係中最容易卡關的模式是什麼？",
      "如何讓伴侶感受到我真正的愛意與需求？",
      "面對關係中的冷戰或衝突，我該如何主動破冰？",
      "我適合現在進入一段新關係嗎？",
      "如何辨別這段關係是否值得我繼續投入？",
    ],
  },
  {
    key: "family",
    label: "家庭關係",
    questions: [
      "面對家人的期待與情緒勒索，我該如何劃清界線？",
      "如何用不傷感情的方式表達自己的立場？",
      "我該如何修復與家人之間長期的心結？",
      "面對手足或伴侶家庭的比較壓力，我該如何自處？",
    ],
  },
  {
    key: "wealth",
    label: "金錢財富",
    questions: [
      "我目前最適合的財富累積策略是什麼？",
      "我容易在什麼情況下做出衝動的財務決定？",
      "我適合投資還是穩健儲蓄？該注意什麼盲點？",
      "如何提升我對「談錢」這件事的自在度？",
    ],
  },
  {
    key: "burnout",
    label: "自我內耗",
    questions: [
      "我今天內耗、心累的根源可能是什麼？",
      "如何快速把自己拉回中心、停止過度思考？",
      "我該如何練習不把別人的情緒照單全收？",
      "有什麼日常儀式能幫我重新充電？",
    ],
  },
];

/** 情境追問區的 Prompt 引擎：打包自己+今日流日 KIN、選定面向與挑選/自訂的問題，並要求 Gemini 主動追問。 */
export function buildScenarioPrompt(params: {
  selfKin: number;
  selfTotem: string;
  todayKin: number;
  todayTotem: string;
  categoryLabel: string;
  questions: string[];
  customQuestion: string;
}): string {
  const items = [...params.questions];
  if (params.customQuestion.trim()) items.push(params.customQuestion.trim());
  const questionList =
    items.length > 0
      ? items.map((q, i) => `${i + 1}. ${q}`).join("\n")
      : "1. 請根據我今天的能量狀態，給我最重要的提醒。";

  return `你現在是一位精通星際瑪雅曆（Dreamspell）的「高維生命導航員」。

我今天是「${params.selfTotem}」（KIN ${params.selfKin}），今天的日流能量是「${params.todayTotem}」（KIN ${params.todayKin}）。
我目前的情境面向是：${params.categoryLabel}。

我想請你根據這兩股能量疊加，深入回答以下問題：
${questionList}

請用溫暖、精準、具備洞察力且落地的繁體中文回答。回答完畢後，請主動提出 3 個更深入的追問問題，邀請我繼續與你交流。`;
}

/** 三維脈輪卡的「脈輪能量堵塞排解與自我對話」引導 Prompt。 */
export function buildChakraGuidancePrompt(params: {
  role: string;
  kin: number;
  totem: string;
  chakra: string;
  trait: string;
}): string {
  return `你現在是一位精通脈輪能量療癒與身心靈自我對話的引導師。

我的「${params.role}」對應 KIN ${params.kin}．${params.totem}，能量中心落在「${params.chakra}」：${params.trait}

請帶領我進行一段「${params.chakra}能量堵塞排解與自我對話」引導，包含：
1. 這個脈輪堵塞時，我在生活與職場中會出現的具體徵兆。
2. 一段簡短的自我覺察提問，幫我釐清目前堵塞的根源。
3. 一個現在就能做的身體、呼吸或語言練習，幫我疏通這股能量。

請用溫暖、有畫面感、具體可執行的繁體中文回答。`;
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

export const GEMINI_URL = "https://gemini.google.com";
export const GLOWING_URL = "https://glowing.cc";
export const LINE_URL = "https://line.me/R/ti/p/@799vhtvj";
