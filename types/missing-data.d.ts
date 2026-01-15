// Missing data analysis domain types
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

export interface PriorityAction {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  impactScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
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