export interface TalentProfile {
  profile_id: string;
  /** Free-text relationship label (e.g. 伴侶、主管、手帳裡的暱稱) rather than a fixed enum. */
  profile_type: string;
  is_self: boolean;
  name_alias: string;
  maya_kin: number | null;
  maya_tone: string;
  maya_totem: string;
  life_path_num: number | null;
  core_traits_tags: string[];
  relationship_notes: string;
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
