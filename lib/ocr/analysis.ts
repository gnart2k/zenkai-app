// Enhanced data structures for CV and JD analysis
// Builds on existing OCR types with more comprehensive models

export interface CVData {
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    website?: string;
  };
  summary?: string;
  objective?: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: {
    technical?: string[];
    soft?: string[];
    languages?: LanguageEntry[];
    tools?: string[];
    frameworks?: string[];
    databases?: string[];
  };
  certifications: CertificationEntry[];
  projects: ProjectEntry[];
  awards?: AwardEntry[];
  publications?: PublicationEntry[];
  volunteer?: VolunteerEntry[];
  references?: ReferenceEntry[];
}

export interface JDData {
  jobTitle?: string;
  company?: string;
  location?: string;
  employmentType?: EmploymentType;
  experienceLevel?: ExperienceLevel;
  salary?: SalaryRange;
  remoteOption?: RemoteOption;
  summary?: string;
  aboutCompany?: string;
  responsibilities: string[];
  requirements: {
    required?: string[];
    preferred?: string[];
    education?: EducationRequirement[];
    experience?: ExperienceRequirement[];
  };
  skills: {
    technical?: string[];
    soft?: string[];
    tools?: string[];
    frameworks?: string[];
    databases?: string[];
  };
  benefits?: BenefitEntry[];
  applicationDeadline?: Date;
  postedDate?: Date;
  department?: string;
  reportsTo?: string;
  teamSize?: string;
}

// Enhanced interfaces for better data modeling

export interface ExperienceEntry {
  id?: string;
  title?: string;
  company?: string;
  location?: string;
  duration?: string;
  startDate?: Date;
  endDate?: Date | 'present';
  current?: boolean;
  description?: string;
  achievements?: string[];
  technologies?: string[];
  type?: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
}

export interface EducationEntry {
  id?: string;
  degree?: string;
  field?: string;
  institution?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date | 'present';
  current?: boolean;
  gpa?: string;
  honors?: string[];
  coursework?: string[];
  thesis?: string;
  type?: 'bachelor' | 'master' | 'phd' | 'associate' | 'certificate' | 'diploma';
}

export interface LanguageEntry {
  language: string;
  proficiency: LanguageProficiency;
  certified?: boolean;
}

export interface CertificationEntry {
  id?: string;
  name?: string;
  issuer?: string;
  issueDate?: Date;
  expiryDate?: Date | 'valid' | 'expired';
  credentialId?: string;
  credentialUrl?: string;
  current?: boolean;
}

export interface ProjectEntry {
  id?: string;
  name?: string;
  description?: string;
  technologies?: string[];
  startDate?: Date;
  endDate?: Date | 'ongoing';
  current?: boolean;
  url?: string;
  githubUrl?: string;
  achievements?: string[];
  type?: 'personal' | 'academic' | 'professional' | 'open-source';
}

export interface AwardEntry {
  title?: string;
  issuer?: string;
  date?: Date;
  description?: string;
  value?: string;
}

export interface PublicationEntry {
  title?: string;
  authors?: string[];
  publisher?: string;
  date?: Date;
  url?: string;
  doi?: string;
  type?: 'journal' | 'conference' | 'book' | 'blog' | 'other';
}

export interface VolunteerEntry {
  organization?: string;
  role?: string;
  duration?: string;
  startDate?: Date;
  endDate?: Date | 'present';
  current?: boolean;
  description?: string;
  achievements?: string[];
}

export interface ReferenceEntry {
  name?: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  relationship?: string;
}

export interface BenefitEntry {
  category: BenefitCategory;
  items: string[];
  description?: string;
}

export interface EducationRequirement {
  level?: EducationLevel;
  field?: string;
  required?: boolean;
}

export interface ExperienceRequirement {
  years?: string;
  level?: ExperienceLevel;
  field?: string;
  required?: boolean;
}

// Enums for consistent categorization

export type EmploymentType = 
  | 'full-time' 
  | 'part-time' 
  | 'contract' 
  | 'temporary' 
  | 'internship' 
  | 'freelance'
  | 'remote-only'
  | 'hybrid';

export type ExperienceLevel = 
  | 'entry-level' 
  | 'junior' 
  | 'mid-level' 
  | 'senior' 
  | 'lead' 
  | 'manager' 
  | 'director' 
  | 'executive';

export type RemoteOption = 
  | 'on-site' 
  | 'remote' 
  | 'hybrid';

export type LanguageProficiency = 
  | 'basic' 
  | 'conversational' 
  | 'professional' 
  | 'fluent' 
  | 'native';

export type EducationLevel = 
  | 'high-school'
  | 'associate' 
  | 'bachelor' 
  | 'master' 
  | 'phd' 
  | 'diploma'
  | 'certificate';

export type BenefitCategory = 
  | 'health'
  | 'financial' 
  | 'time-off' 
  | 'professional-development'
  | 'perks'
  | 'family'
  | 'wellness'
  | 'other';

export interface SalaryRange {
  min?: number;
  max?: number;
  currency?: string;
  period?: 'hourly' | 'monthly' | 'yearly';
  equity?: boolean;
  bonus?: boolean;
}

// Validation and analysis interfaces

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

export type ValidationCategory = 
  | 'personal-info'
  | 'experience'
  | 'education'
  | 'skills'
  | 'format'
  | 'content'
  | 'completeness'
  | 'consistency';

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

export interface MissingDataAnalysis {
  critical: MissingField[];
  recommended: MissingField[];
  optional: MissingField[];
  overallScore: number; // 0-100
  priorityActions: PriorityAction[];
}

export interface MissingField {
  id: string;
  category: MissingFieldCategory;
  field: string;
  importance: 'critical' | 'recommended' | 'optional';
  reason: string;
  example?: string;
  templates?: string[];
  estimatedTime?: string; // Time to fill this field
  impactOnScore: number; // How much this affects the overall score
}

export type MissingFieldCategory = 
  | 'personal-info'
  | 'contact-info'
  | 'experience'
  | 'education'
  | 'skills'
  | 'summary'
  | 'achievements'
  | 'projects';

export interface PriorityAction {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  impactScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Processing and workflow interfaces

export interface ProcessingPipeline {
  stages: ProcessingStage[];
  currentStage: ProcessingStage;
  progress: number; // 0-100
  estimatedTimeRemaining?: number; // in seconds
  canProceed: boolean;
  errors?: ProcessingError[];
}

export interface ProcessingStage {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  progress: number; // 0-100
  result?: any;
  error?: ProcessingError;
  estimatedDuration?: number; // in seconds
}

export interface ProcessingError {
  stage: string;
  message: string;
  code?: string;
  recoverable: boolean;
  suggestions?: string[];
}

// Document matching and compatibility

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
  levelRequired?: EducationLevel;
  levelMatched?: EducationLevel;
  fieldMatch?: 'exact' | 'related' | 'different';
  score: number; // 0-100
}

export interface CompatibilityRecommendation {
  type: 'add-skill' | 'highlight-experience' | 'restructure-content' | 'add-keywords';
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
}

// Export existing types for compatibility
export * from './types';