// Professional experience domain types
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