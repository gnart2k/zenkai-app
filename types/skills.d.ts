// Skills and competencies domain types
export interface SkillsData {
  technical?: string[];
  soft?: string[];
  languages?: import('./education').LanguageEntry[];
  tools?: string[];
  frameworks?: string[];
  databases?: string[];
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

export type BenefitCategory = 
  | 'health'
  | 'financial' 
  | 'time-off' 
  | 'professional-development'
  | 'perks'
  | 'family'
  | 'wellness'
  | 'other';

export interface BenefitEntry {
  category: BenefitCategory;
  items: string[];
  description?: string;
}