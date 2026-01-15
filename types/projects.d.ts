// Projects and achievements domain types
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