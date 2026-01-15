// Job description domain types
export interface JDData {
  jobTitle?: string;
  company?: string;
  location?: string;
  employmentType?: import('./experience').EmploymentType;
  experienceLevel?: import('./experience').ExperienceLevel;
  salary?: SalaryRange;
  remoteOption?: import('./experience').RemoteOption;
  summary?: string;
  aboutCompany?: string;
  responsibilities: string[];
  requirements: JDRequirements;
  skills: import('./skills').SkillsData;
  benefits?: import('./skills').BenefitEntry[];
  applicationDeadline?: Date;
  postedDate?: Date;
  department?: string;
  reportsTo?: string;
  teamSize?: string;
}

export interface JDRequirements {
  required?: string[];
  preferred?: string[];
  education?: import('./education').EducationRequirement[];
  experience?: import('./education').ExperienceRequirement[];
}

export interface SalaryRange {
  min?: number;
  max?: number;
  currency?: string;
  period?: 'hourly' | 'monthly' | 'yearly';
  equity?: boolean;
  bonus?: boolean;
}