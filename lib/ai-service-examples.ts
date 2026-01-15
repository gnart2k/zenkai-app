// Usage examples for the AI service

import { createAIService, generateAI, generateAIStream } from './ai-service';
import { CVData, JDData } from '../types';

// Example 1: Generate CV data from a text description
class CVDataGenerator {
  private static aiService = createAIService<string, CVData>({
    model: 'ministral-3:14b-cloud',
    systemPrompt: 'You are an expert CV writer and analyst. Extract and structure CV information from the given text.',
    temperature: 0.3,
  });

  static async generateCVFromText(text: string): Promise<CVData> {
    const customPrompt = `
    You are an expert CV parser and analyzer.
    
    Extract structured information from the following CV/resume text.
    
    Focus on:
    - Personal information (name, email, phone)
    - Work experience with titles, companies, durations
    - Educational background
    - Technical and soft skills
    - Projects and achievements
    
    Return valid JSON matching the CVData structure.
    `;
    
    return this.aiService.generate(text, class TempCVData {} as any, customPrompt);
  }

  static async streamCVFromText(text: string): Promise<ReadableStream<Partial<CVData>>> {
    return this.aiService.generateStream(text, class TempCVData {} as any);
  }
}

// Example 2: Generate JD data from requirements
class JDDataGenerator {
  private static aiService = createAIService<string, JDData>({
    model: 'ministral-3:14b-cloud',
    systemPrompt: 'You are an expert job description writer. Create structured job descriptions from requirements.',
    temperature: 0.4,
  });

  static async generateJDFromRequirements(requirements: string): Promise<JDData> {
    const customPrompt = `
    You are an expert job description writer and HR analyst.
    
    Create a comprehensive job description based on these requirements:
    ${requirements}
    
    Include:
    - Clear job title and company information
    - Detailed responsibilities
    - Required and preferred qualifications
    - Skills and competencies needed
    - Benefits and company culture information
    
    Return valid JSON matching the JDData structure.
    `;
    
    return this.aiService.generate(requirements, class TempJDData {} as any, customPrompt);
  }
}

// Example 3: Quick helper usage
class QuickExamples {
  static async analyzeSkills(skills: string[]): Promise<{ technical: string[], soft: string[] }> {
    const SkillsAnalysis = class {
      technical: string[] = [];
      soft: string[] = [];
    };

    return generateAI(
      skills,
      SkillsAnalysis,
      {
        systemPrompt: 'You are an expert skills analyst. Categorize skills into technical and soft skills.',
      }
    );
  }

  static async generateInterviewQuestions(jobTitle: string): Promise<string[]> {
    return generateAI(
      { jobTitle, experienceLevel: 'mid-level' },
      class InterviewQuestions {
        questions: string[] = [];
      },
      {
        systemPrompt: 'You are an expert interviewer. Generate relevant interview questions for the given job.',
      }
    ).then(result => result.questions);
  }
}

// Example 4: Custom type usage
interface CustomAnalysis {
  summary: string;
  keyPoints: string[];
  confidence: number;
}

class CustomExample {
  static async analyzeText(text: string): Promise<CustomAnalysis> {
    const service = createAIService<string, CustomAnalysis>({
      model: 'ministral-3:14b-cloud',
      temperature: 0.2,
      maxTokens: 1000,
    });

    const customPrompt = `
    You are a sentiment analysis expert.
    
    Analyze the following text for:
    - Overall sentiment (positive, neutral, negative)
    - Key points or main themes
    - Confidence level in your analysis
    
    Text to analyze: ${text}
    
    Return JSON with: summary, keyPoints (array), sentiment, confidence (0-100)
    `;

    return service.generate(text, class TempCustomAnalysis {} as any, customPrompt);
  }
}

export { CVDataGenerator, JDDataGenerator, QuickExamples, CustomExample };