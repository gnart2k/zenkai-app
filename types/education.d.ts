// Education domain types
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

export type EducationLevel = 
  | 'high-school'
  | 'associate' 
  | 'bachelor' 
  | 'master' 
  | 'phd' 
  | 'diploma'
  | 'certificate';

export type ExperienceLevel = 
  | 'entry-level' 
  | 'junior' 
  | 'mid-level' 
  | 'senior' 
  | 'lead' 
  | 'manager' 
  | 'director' 
  | 'executive';

export interface LanguageEntry {
  language: string;
  proficiency: LanguageProficiency;
  certified?: boolean;
}

export type LanguageProficiency = 
  | 'basic' 
  | 'conversational' 
  | 'professional' 
  | 'fluent' 
  | 'native';