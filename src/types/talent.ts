export type ProfileType =
  | "Self"
  | "Partner"
  | "Family"
  | "Manager"
  | "Client"
  | "Friend";

export interface TalentProfile {
  profile_id: string;
  profile_type: ProfileType;
  name_alias: string;
  maya_kin: number | null;
  maya_tone: string;
  maya_totem: string;
  life_path_num: number | null;
  core_traits_tags: string[];
  created_at: string;
}

export type LifeDomain = "Career" | "Romance" | "Family" | "Interpersonal";

export interface PromptTemplate {
  template_id: string;
  domain_type: LifeDomain;
  domain_label: string;
  base_prompt_text: string;
}
