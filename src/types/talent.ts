export interface TalentProfile {
  profile_id: string;
  /** Free-text relationship label (e.g. 伴侶、主管、手帳裡的暱稱) rather than a fixed enum. */
  profile_type: string;
  is_self: boolean;
  name_alias: string;
  /** Birth date as YYYY-MM-DD, empty string if unknown. Needed for yearly-KIN and life-cycle-year modules. */
  birth_date: string;
  maya_kin: number | null;
  maya_tone: string;
  maya_totem: string;
  life_path_num: number | null;
  core_traits_tags: string[];
  relationship_notes: string;
  /** 核心共鳴與性格細微差異：同圖騰因調性不同產生的微觀性格差異 */
  core_resonance_nuance: string;
  /** 對方的隱藏性格：合盤視角下未顯化在表面的防衛機制與潛意識需求 */
  hidden_personality: string;
  /** 力量動物（Totem Animal）：13 調性對應的靈魂圖騰 */
  totem_animal: string;
  /** 隱藏推動（PSI / Hidden Push） */
  hidden_push_psi: string;
  /** 波符（Wavespell）：13 天靈魂使命藍圖 */
  wavespell: string;
  /** 支持能量與挑戰擴展（Analog & Antipodal Energy） */
  support_challenge_energy: string;
  created_at: string;
}

export type LifeDomain = "Career" | "Romance" | "Family" | "Interpersonal";

export type RelationshipStatus = "Single" | "InRelationship" | "Ambiguous";

export interface PromptTemplate {
  template_id: string;
  domain_type: LifeDomain;
  domain_label: string;
  base_prompt_text: string;
}
