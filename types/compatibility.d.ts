// Document matching and compatibility domain types
export interface DocumentCompatibility {
  score: number; // 0-100
  compatibility: 'excellent' | 'good' | 'fair' | 'poor';
  skillMatch: SkillMatch;
  experienceMatch: ExperienceMatch;
  educationMatch: EducationMatch;
  recommendations: CompatibilityRecommendation[];
}

export interface SkillMatch {
  matchingSkills: string[];
  missingSkills: string[];
  additionalSkills: string[];
  score: number; // 0-100
}

export interface ExperienceMatch {
  yearsRequired?: string;
  yearsMatched?: string;
  levelMatch: 'perfect' | 'close' | 'under-qualified' | 'over-qualified';
  relevantExperience: number; // years
  score: number; // 0-100
}

export interface EducationMatch {
  levelRequired?: import('./education').EducationLevel;
  levelMatched?: import('./education').EducationLevel;
  fieldMatch?: 'exact' | 'related' | 'different';
  score: number; // 0-100
}

export interface CompatibilityRecommendation {
  type: 'add-skill' | 'highlight-experience' | 'restructure-content' | 'add-keywords';
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
}