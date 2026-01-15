// Validation and analysis domain types
export interface ValidationResult {
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  issues: ValidationIssue[];
  suggestions: DataSuggestion[];
  completeness: CompletenessScore;
  qualityScore: QualityScore;
  confidence: number; // AI confidence in extraction
}

export interface ValidationIssue {
  id: string;
  field: string;
  category: ValidationCategory;
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion?: string;
  autoFixable?: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface DataSuggestion {
  id: string;
  field: string;
  category: SuggestionCategory;
  suggestedValue: string | string[];
  confidence: number; // 0-100
  source: SuggestionSource;
  reason: string;
  impact: 'high' | 'medium' | 'low';
}

export interface CompletenessScore {
  overall: number; // 0-100
  personalInfo: number; // 0-100
  experience: number; // 0-100
  education: number; // 0-100
  skills: number; // 0-100
  summary: number; // 0-100
}

export interface QualityScore {
  overall: number; // 0-100
  clarity: number; // 0-100
  impact: number; // 0-100
  keywordOptimization: number; // 0-100
  structure: number; // 0-100
  completeness: number; // 0-100
}

export type ValidationCategory = 
  | 'personal-info'
  | 'experience'
  | 'education'
  | 'skills'
  | 'format'
  | 'content'
  | 'completeness'
  | 'consistency';

export type SuggestionCategory = 
  | 'missing-field'
  | 'format-correction'
  | 'content-improvement'
  | 'skill-optimization'
  | 'keyword-addition'
  | 'structure-improvement';

export type SuggestionSource = 
  | 'ai-analysis'
  | 'industry-standard'
  | 'job-matching'
  | 'best-practice'
  | 'template-based';