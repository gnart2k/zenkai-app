// CV domain types
export interface CVData {
  personalInfo: import('./personal').PersonalInfo;
  summary?: string;
  objective?: string;
  experience: import('./experience').ExperienceEntry[];
  education: import('./education').EducationEntry[];
  skills: import('./skills').SkillsData;
  certifications: import('./skills').CertificationEntry[];
  projects: import('./projects').ProjectEntry[];
  awards?: import('./projects').AwardEntry[];
  publications?: import('./projects').PublicationEntry[];
  volunteer?: import('./experience').VolunteerEntry[];
  references?: import('./personal').ReferenceEntry[];
}