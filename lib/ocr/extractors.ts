import { AIService, createAIService } from '../ai-service';
import { 
  ValidationResult
} from '../../types';
import { 
  CVData, 
  JDData, 
  ExperienceEntry, 
  EducationEntry, 
  CertificationEntry, 
  ProjectEntry,
  LanguageEntry
} from '../../types';
import { detectDocumentType } from './utils';

/**
 * AI-powered OCR data extractor using our AI service
 */
export class AIExtractionService {
  private cvService: AIService<string, CVData>;
  private jdService: AIService<string, JDData>;

  constructor() {
    // Initialize AI services with specific prompts
    this.cvService = createAIService<string, CVData>({
      temperature: 0.3, // Lower temperature for more structured extraction
      maxTokens: 3000,
      systemPrompt: `
        You are an expert resume/CV parser and data extractor.
        
        Your task is to extract structured information from OCR text output.
        
        Focus on extracting:
        1. Personal information (name, email, phone, location)
        2. Work experience with titles, companies, dates, and descriptions
        3. Educational background with degrees, institutions, and dates
        4. Technical and soft skills with categories
        5. Certifications, projects, and achievements
        
        Guidelines:
        - Return valid JSON that matches the CVData interface exactly
        - If information is missing or unclear, still try to extract what's available
        - Use arrays for lists (skills, experience, education)
        - Normalize dates where possible
        - Extract confidence levels for different sections
        
        Output Format:
        {
          "personalInfo": { ... },
          "experience": [ ... ],
          "education": [ ... ],
          "skills": { "technical": [...], "soft": [...] },
          "certifications": [ ... ],
          "projects": [ ... ]
        }
      `
    });

    this.jdService = createAIService<string, JDData>({
      temperature: 0.4, // Slightly higher for descriptive content
      maxTokens: 3000,
      systemPrompt: `
        You are an expert job description parser and data extractor.
        
        Your task is to extract structured information from OCR text output.
        
        Focus on extracting:
        1. Job title and company information
        2. Responsibilities and duties in clear, actionable language
        3. Requirements (required and preferred) with proper categorization
        4. Skills and qualifications needed
        5. Compensation, benefits, and company culture information
        
        Guidelines:
        - Return valid JSON that matches the JDData interface exactly
        - Distinguish between required and preferred qualifications
        - Use arrays for lists (skills, responsibilities, requirements)
        - Extract employment type, experience level, and remote options
        - Normalize dates and durations where mentioned
        
        Output Format:
        {
          "jobTitle": "...",
          "company": "...",
          "responsibilities": [...],
          "requirements": {
            "required": [...],
            "preferred": [...]
          },
          "skills": { "technical": [...], "soft": [...] },
          "employmentType": "...",
          "experienceLevel": "...",
          "remoteOption": "..."
        }
      `
    });
  }

  async extractCVData(ocrText: string): Promise<CVData> {
    try {
      // Pre-process OCR text for better extraction
      const cleanedText = this.preprocessText(ocrText);
      
      const result = await this.cvService.generate(
        cleanedText,
        class CVDataType {} as any,
        `Extract structured CV data from the following text: ${cleanedText}`
      );
      
      // Post-process and validate the result
      return this.postProcessCVData(result);
    } catch (error) {
      console.error('CV extraction error:', error);
      throw new Error(`Failed to extract CV data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async extractJDData(ocrText: string): Promise<JDData> {
    try {
      // Pre-process OCR text for better extraction
      const cleanedText = this.preprocessText(ocrText);
      
      const result = await this.jdService.generate(
        cleanedText,
        class JDDataType {} as any,
        `Extract structured job description data from the following text: ${cleanedText}`
      );
      
      // Post-process and validate the result
      return this.postProcessJDData(result);
    } catch (error) {
      console.error('JD extraction error:', error);
      throw new Error(`Failed to extract JD data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Pre-process OCR text for better AI extraction
   */
  private preprocessText(ocrText: string): string {
    return ocrText
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Fix common OCR errors
      .replace(/O/g, '0')
      .replace(/l/g, '1')
      .replace(/I/g, '1')
      // Remove artifacts that confuse AI
      .replace(/[|\\-_]/g, ' ')
      .trim();
  }

  /**
   * Post-process CV extraction results
   */
  private postProcessCVData(data: CVData): CVData {
    // Ensure required fields have proper defaults
    return {
      personalInfo: data.personalInfo || {},
      summary: data.summary || '',
      objective: data.objective || '',
      experience: data.experience || [],
      education: data.education || [],
      skills: data.skills || { technical: [], soft: [] },
      certifications: data.certifications || [],
      projects: data.projects || [],
      awards: data.awards || [],
      publications: data.publications || [],
      volunteer: data.volunteer || [],
      references: data.references || []
    };
  }

  /**
   * Post-process JD extraction results
   */
  private postProcessJDData(data: JDData): JDData {
    // Ensure required fields have proper defaults
    return {
      jobTitle: data.jobTitle || '',
      company: data.company || '',
      location: data.location || '',
      employmentType: data.employmentType,
      experienceLevel: data.experienceLevel,
      salary: data.salary,
      remoteOption: data.remoteOption,
      summary: data.summary || '',
      aboutCompany: data.aboutCompany || '',
      responsibilities: data.responsibilities || [],
      requirements: data.requirements || { required: [], preferred: [], education: [], experience: [] },
      skills: data.skills || { technical: [], soft: [], frameworks: [], databases: [], tools: [] },
      benefits: data.benefits || [],
      applicationDeadline: data.applicationDeadline,
      postedDate: data.postedDate,
      department: data.department || '',
      reportsTo: data.reportsTo || '',
      teamSize: data.teamSize || ''
    };
  }

  /**
   * Get extraction validation results
   */
  async validateExtraction(
    type: 'cv' | 'jd',
    originalText: string,
    extractedData: CVData | JDData
  ): Promise<ValidationResult> {
    const service = type === 'cv' ? this.cvService : this.jdService;
    
    const validationPrompt = `
      You are a data validation expert.
      
      Compare the original OCR text with the extracted structured data.
      Identify missing information, inconsistencies, or formatting issues.
      
      Original OCR Text:
      ${originalText}
      
      Extracted Data:
      ${JSON.stringify(extractedData, null, 2)}
      
      Analyze and provide:
      1. Overall quality score (0-100)
      2. Missing critical fields
      3. Data inconsistencies
      4. Suggestions for improvement
      
      Return JSON with: score, issues, suggestions, completeness, qualityScore, confidence
    `;

    try {
      // Request validation that returns proper ValidationResult structure
      const validationRequest = {
        text: `Validation Request: Compare original text "${originalText}" with extracted data`,
        extractedData
      };

      const validationResult = await service.generate(
        validationRequest,
        class ValidationType {} as any,
        validationPrompt
      );
      
      // Ensure we return ValidationResult that matches expected interface
      return {
        score: validationResult.score || 0,
        grade: validationResult.grade || 'C',
        issues: validationResult.issues || [],
        suggestions: validationResult.suggestions || [],
        completeness: validationResult.completeness || { overall: 0, personalInfo: 0, experience: 0, education: 0, skills: 0, summary: 0 },
        qualityScore: validationResult.qualityScore || { overall: 0, clarity: 0, impact: 0, keywordOptimization: 0, structure: 0, completeness: 0 },
        confidence: validationResult.confidence || 0
      };
    } catch (error) {
      console.error('Validation error:', error);
      throw new Error(`Failed to validate extraction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Temporary types for internal use
class CVDataType {}
class JDDataType {}
class ValidationType {}

// Export functions for backward compatibility
export async function extractCVData(ocrText: string): Promise<CVData> {
  const service = new AIExtractionService();
  return service.extractCVData(ocrText);
}

export async function extractJDData(ocrText: string): Promise<JDData> {
  const service = new AIExtractionService();
  return service.extractJDData(ocrText);
}

export async function validateExtraction(
  type: 'cv' | 'jd',
  originalText: string,
  extractedData: CVData | JDData
): Promise<ValidationResult> {
  const service = new AIExtractionService();
  return service.validateExtraction(type, originalText, extractedData);
}