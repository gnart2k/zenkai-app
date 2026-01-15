// Personal information domain types
export interface PersonalInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
}

export interface ReferenceEntry {
  name?: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  relationship?: string;
}