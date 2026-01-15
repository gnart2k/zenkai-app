import { AIService, createAIService } from '../ai/ai-service';
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
        
        CRITICAL INSTRUCTIONS:
        - Return ONLY valid JSON, no markdown formatting, no code blocks, no explanations
        - Do NOT include \`\`\`json or \`\`\` markers
        - Do NOT add any text before or after the JSON
        - Response must start with { and end with }
        
        Guidelines:
        - Match the CVData interface structure exactly
        - If information is missing or unclear, still try to extract what's available
        - Use arrays for lists (skills, experience, education)
        - Normalize dates where possible
        - Extract confidence levels for different sections
        
        Output must be pure JSON:
        {
          "personalInfo": { ... },
          "summary": "",
          "objective": "",
          "experience": [ ... ],
          "education": [ ... ],
          "skills": { "technical": [...], "soft": [] },
          "certifications": [ ... ],
          "projects": [ ... ],
          "awards": [ ... ],
          "publications": [ ... ],
          "volunteer": [ ... ],
          "references": [ ... ]
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
        
        CRITICAL INSTRUCTIONS:
        - Return ONLY valid JSON, no markdown formatting, no code blocks, no explanations
        - Do NOT include \`\`\`json or \`\`\` markers
        - Do NOT add any text before or after the JSON
        - Response must start with { and end with }
        
        Guidelines:
        - Match the JDData interface structure exactly
        - Distinguish between required and preferred qualifications
        - Use arrays for lists (skills, responsibilities, requirements)
        - Extract employment type, experience level, and remote options
        - Normalize dates and durations where mentioned
        
        Output must be pure JSON:
        {
          "jobTitle": "...",
          "company": "...",
          "location": "",
          "employmentType": "",
          "experienceLevel": "",
          "salary": "",
          "remoteOption": "",
          "summary": "",
          "aboutCompany": "",
          "responsibilities": [...],
          "requirements": { "required": [], "preferred": [], "education": [], "experience": [] },
          "skills": { "technical": [], "soft": [], "frameworks": [], "databases": [], "tools": [] },
          "benefits": [],
          "applicationDeadline": "",
          "postedDate": "",
          "department": "",
          "reportsTo": "",
          "teamSize": ""
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
    // Create a new AI service for validation with proper response type
    const validationService = createAIService<string, any>({
      temperature: 0.3,
      maxTokens: 1000,
      systemPrompt: `
        You are a data validation expert for OCR extraction.
        
        CRITICAL INSTRUCTIONS:
        - Return ONLY valid JSON, no markdown formatting, no code blocks, no explanations
        - Do NOT include \`\`\`json or \`\`\` markers
        - Response must start with { and end with }
        
        Analyze the provided data and return validation results with this exact structure:
        {
          "score": 85,
          "grade": "B",
          "issues": ["issue1", "issue2"],
          "suggestions": ["suggestion1", "suggestion2"],
          "completeness": {
            "overall": 80,
            "personalInfo": 90,
            "experience": 75,
            "education": 85,
            "skills": 70,
            "summary": 60
          },
          "qualityScore": {
            "overall": 82,
            "clarity": 85,
            "impact": 78,
            "keywordOptimization": 80,
            "structure": 85,
            "completeness": 80
          },
          "confidence": 0.85
        }
      `
    });
    
    const validationText = `
      Original OCR Text:
      ${originalText}
      
      Extracted Data:
      ${JSON.stringify(extractedData, null, 2)}
      
      Analyze and provide validation results as pure JSON only.
    `;

    try {
      const validationResult = await validationService.generate(
        validationText,
        class ValidationType {} as any
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
export async function extractCVData(ocrText: string): Promise<{ data: CVData; confidence: number }> {
  const service = new AIExtractionService();
  const data = await service.extractCVData(ocrText);
  // Calculate confidence based on data completeness
  const confidence = calculateConfidence(data);
  return { data, confidence };
}

export async function extractJDData(ocrText: string): Promise<{ data: JDData; confidence: number }> {
  const service = new AIExtractionService();
  const data = await service.extractJDData(ocrText);
  // Calculate confidence based on data completeness
  const confidence = calculateConfidence(data);
  return { data, confidence };
}

// Helper function to calculate confidence score
function calculateConfidence(data: CVData | JDData): number {
  const cvData = data as CVData;
  const jdData = data as JDData;
  
  let score = 0;
  let totalFields = 0;
  
  if (cvData.personalInfo || cvData.experience) {
    // CV confidence calculation
    if (cvData.personalInfo) {
      const pi = cvData.personalInfo;
      if (pi.name) { score += 15; }
      if (pi.email) { score += 10; }
      if (pi.phone) { score += 10; }
      if (pi.location) { score += 5; }
      totalFields += 40;
    }
    
    if (cvData.experience && cvData.experience.length > 0) {
      score += Math.min(30, cvData.experience.length * 10);
      totalFields += 30;
    }
    
    if (cvData.education && cvData.education.length > 0) {
      score += Math.min(15, cvData.education.length * 8);
      totalFields += 15;
    }
    
    if (cvData.skills && ((cvData.skills.technical?.length || 0) > 0 || (cvData.skills.soft?.length || 0) > 0)) {
      score += 15;
      totalFields += 15;
    }
    
  } else {
    // JD confidence calculation
    if (jdData.jobTitle) { score += 20; }
    if (jdData.company) { score += 10; }
    if (jdData.responsibilities && jdData.responsibilities.length > 0) {
      score += Math.min(25, jdData.responsibilities.length * 5);
    }
    if (jdData.requirements && ((jdData.requirements.required?.length || 0) > 0 || (jdData.requirements.preferred?.length || 0) > 0)) {
      score += 20;
    }
    if (jdData.skills && ((jdData.skills.technical?.length || 0) > 0 || (jdData.skills.soft?.length || 0) > 0)) {
      score += 15;
    }
    totalFields = 90;
  }
  
  return totalFields > 0 ? Math.min(1, score / totalFields) : 0;
}

export async function validateExtraction(
  type: 'cv' | 'jd',
  originalText: string,
  extractedData: CVData | JDData
): Promise<ValidationResult> {
  const service = new AIExtractionService();
  return service.validateExtraction(type, originalText, extractedData);
}