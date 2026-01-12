export interface OCRRequest {
  file: File;
  extractText: boolean;
  extractTables: boolean;
  extractImages: boolean;
}

export interface OCRResult {
  text: string;
  tables?: TableData[];
  images?: ImageData[];
  metadata: {
    fileName: string;
    fileSize: number;
    processingTime: number;
    extractedAt: Date;
  };
}

export interface TableData {
  rows: string[][];
  headers?: string[];
  confidence: number;
}

export interface ImageData {
  base64: string;
  width: number;
  height: number;
  format: string;
  confidence: number;
}

export interface DocumentAnalysis {
  type: 'resume' | 'job-description' | 'unknown';
  extractedData: {
    personalInfo?: PersonalInfo;
    experience?: ExperienceEntry[];
    education?: EducationEntry[];
    skills?: string[];
    requirements?: string[];
    responsibilities?: string[];
  };
  confidence: number;
}

export interface PersonalInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
}

export interface ExperienceEntry {
  title?: string;
  company?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  location?: string;
}

export interface EducationEntry {
  degree?: string;
  institution?: string;
  year?: string;
  gpa?: string;
  field?: string;
}

export interface SkillEntry {
  name: string;
  category: 'technical' | 'soft' | 'language' | 'tool';
  experience?: string;
}

export interface ProcessingStatus {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  message?: string;
  error?: string;
}

export interface FileValidation {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

export type DocumentType = 'resume' | 'job-description' | 'unknown';
export type ProcessingStage = 'validation' | 'upload' | 'ocr' | 'analysis' | 'complete';