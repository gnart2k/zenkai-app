import { 
  CVData, 
  JDData, 
  ExperienceEntry, 
  EducationEntry, 
  CertificationEntry, 
  ProjectEntry,
  LanguageEntry,
  ValidationResult,
  ProcessingError
} from './analysis';
import { detectDocumentType } from './utils';

// Mock AI service for demonstration - replace with actual AI service
class AIExtractionService {
  private baseUrl: string;
  private apiKey?: string;

  constructor() {
    this.baseUrl = process.env.AI_SERVICE_URL || 'http://localhost:8001';
    this.apiKey = process.env.AI_SERVICE_API_KEY;
  }

  async extractCVData(ocrText: string): Promise<Partial<CVData>> {
    try {
      // In a real implementation, this would call an AI service
      // For now, we'll implement sophisticated pattern matching
      
      const cvData = await this.extractCVDataWithPatterns(ocrText);
      return cvData;
    } catch (error) {
      console.error('AI extraction error:', error);
      throw new Error(`Failed to extract CV data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async extractJDData(ocrText: string): Promise<Partial<JDData>> {
    try {
      // In a real implementation, this would call an AI service
      // For now, we'll implement sophisticated pattern matching
      
      const jdData = await this.extractJDDataWithPatterns(ocrText);
      return jdData;
    } catch (error) {
      console.error('AI extraction error:', error);
      throw new Error(`Failed to extract JD data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async extractCVDataWithPatterns(text: string): Promise<Partial<CVData>> {
    const lines = text.split('\n').filter(line => line.trim());
    const cvData: Partial<CVData> = {
      personalInfo: {},
      experience: [],
      education: [],
      skills: {
        technical: [],
        soft: [],
        languages: [],
        tools: [],
        frameworks: [],
        databases: []
      },
      certifications: [],
      projects: []
    };

    // Extract personal information
    cvData.personalInfo = this.extractPersonalInfo(text);
    
    // Extract summary/objective
    cvData.summary = this.extractSummary(text);
    
    // Extract experience
    cvData.experience = this.extractExperience(text);
    
    // Extract education
    cvData.education = this.extractEducation(text);
    
    // Extract skills
    cvData.skills = this.extractSkills(text);
    
    // Extract certifications
    cvData.certifications = this.extractCertifications(text);
    
    // Extract projects
    cvData.projects = this.extractProjects(text);

    return cvData;
  }

  private async extractJDDataWithPatterns(text: string): Promise<Partial<JDData>> {
    const jdData: Partial<JDData> = {
      responsibilities: [],
      requirements: {
        required: [],
        preferred: []
      },
      skills: {
        technical: [],
        soft: [],
        tools: [],
        frameworks: [],
        databases: []
      },
      benefits: []
    };

    // Extract job title and company
    const { jobTitle, company } = this.extractJobTitleAndCompany(text);
    jdData.jobTitle = jobTitle;
    jdData.company = company;

    // Extract location
    jdData.location = this.extractLocation(text);

    // Extract employment type
    jdData.employmentType = this.extractEmploymentType(text);

    // Extract experience level
    jdData.experienceLevel = this.extractExperienceLevel(text);

    // Extract salary information
    jdData.salary = this.extractSalary(text);

    // Extract summary
    jdData.summary = this.extractJobSummary(text);

    // Extract responsibilities
    jdData.responsibilities = this.extractResponsibilities(text);

    // Extract requirements
    jdData.requirements = this.extractRequirements(text);

    // Extract skills
    jdData.skills = this.extractJobSkills(text);

    // Extract benefits
    jdData.benefits = this.extractBenefits(text);

    return jdData;
  }

  private extractPersonalInfo(text: string) {
    const personalInfo: CVData['personalInfo'] = {};

    // Extract name (usually at the beginning, large font - but in OCR we need patterns)
    const namePatterns = [
      /^([A-Z][a-z]+ [A-Z][a-z]+)/m,
      /^([A-Z]\. [A-Z][a-z]+)/m,
      /(?:^|\n)([A-Z][a-z]+ [A-Z][a-z]+ [A-Z][a-z]+)/m
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && !this.looksLikeCompanyName(match[1])) {
        personalInfo.name = match[1].trim();
        break;
      }
    }

    // Extract email
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emailMatch = text.match(emailPattern);
    if (emailMatch) {
      personalInfo.email = emailMatch[0];
    }

    // Extract phone
    const phonePatterns = [
      /\+?1[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g,
      /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g
    ];

    for (const pattern of phonePatterns) {
      const match = text.match(pattern);
      if (match && !match[0].match(/\d{4,}/)) { // Avoid matching years
        personalInfo.phone = match[0];
        break;
      }
    }

    // Extract location
    const locationPatterns = [
      /([A-Z][a-z]+, [A-Z]{2})/g,
      /([A-Z][a-z]+, [A-Z][a-z]+)/g,
      /((?:San Francisco|New York|Los Angeles|Chicago|Houston|Phoenix|Philadelphia|San Antonio|San Diego|Dallas|San Jose)[,\s][A-Z]{2})/g
    ];

    for (const pattern of locationPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        const location = matches[0];
        if (!this.looksLikeCompanyName(location)) {
          personalInfo.location = location;
          break;
        }
      }
    }

    // Extract LinkedIn
    const linkedinPattern = /linkedin\.com\/in\/([a-zA-Z0-9-]+)/g;
    const linkedinMatch = text.match(linkedinPattern);
    if (linkedinMatch) {
      personalInfo.linkedin = linkedinMatch[0];
    }

    // Extract GitHub
    const githubPattern = /github\.com\/([a-zA-Z0-9-]+)/g;
    const githubMatch = text.match(githubPattern);
    if (githubMatch) {
      personalInfo.github = githubMatch[0];
    }

    // Extract portfolio/website
    const urlPattern = /https?:\/\/(?!linkedin|github)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const urlMatches = text.match(urlPattern);
    if (urlMatches) {
      personalInfo.website = urlMatches[0];
    }

    return personalInfo;
  }

  private extractSummary(text: string): string | undefined {
    const summaryPatterns = [
      /(?:Summary|Professional Summary|About|Profile)[\s:]+([^\n]+(?:\n(?![A-Z][a-z]+:)[^\n])*)/i,
      /(?:Objective|Career Objective)[\s:]+([^\n]+(?:\n(?![A-Z][a-z]+:)[^\n])*)/i
    ];

    for (const pattern of summaryPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const summary = match[1].trim();
        if (summary.length > 20 && summary.length < 500) {
          return summary;
        }
      }
    }

    return undefined;
  }

  private extractExperience(text: string): ExperienceEntry[] {
    const experiences: ExperienceEntry[] = [];
    
    // Look for experience section
    const experienceSection = this.extractSection(text, [
      'Experience', 'Work Experience', 'Professional Experience', 'Employment History'
    ]);

    if (!experienceSection) return experiences;

    // Pattern to match individual experience entries
    const experiencePattern = /([A-Z][a-zA-Z\s&.,-]+)\n([A-Z][a-zA-Z\s&.,-]+)\n([\d]{1,2}\/[\d]{4}\s*[-–]\s*[\d]{1,2}\/[\d]{4}|[\d]{4}\s*[-–]\s*[\d]{4}|[\d]{4}\s*[-–]\s*Present)/gm;
    const matches = [...experienceSection.matchAll(experiencePattern)];

    matches.forEach(match => {
      const experience: ExperienceEntry = {
        title: match[1]?.trim(),
        company: match[2]?.trim(),
        duration: match[3]?.trim(),
        description: this.extractDescriptionAfterDate(match.index! + match[0].length, text)
      };

      // Parse dates
      const dateInfo = this.parseDates(experience.duration || '');
      if (dateInfo.startDate) experience.startDate = dateInfo.startDate;
      if (dateInfo.endDate) experience.endDate = dateInfo.endDate;
      if (dateInfo.current) experience.current = true;

      experiences.push(experience);
    });

    return experiences;
  }

  private extractEducation(text: string): EducationEntry[] {
    const education: EducationEntry[] = [];
    
    const educationSection = this.extractSection(text, [
      'Education', 'Academic Background', 'Qualifications'
    ]);

    if (!educationSection) return education;

    // Pattern for education entries
    const educationPattern = /([A-Z][a-zA-Z\s&.,-]+)\n([A-Z][a-zA-Z\s&.,-]+)\n([\d]{4}\s*[-–]\s*[\d]{4}|[\d]{4}|[\d]{4}\s*[-–]\s*Present)/gm;
    const matches = [...educationSection.matchAll(educationPattern)];

    matches.forEach(match => {
      const entry: EducationEntry = {
        degree: match[1]?.trim(),
        institution: match[2]?.trim()
      };

      // Parse dates
      const dateInfo = this.parseDates(match[3]?.trim() || '');
      if (dateInfo.startDate) entry.startDate = dateInfo.startDate;
      if (dateInfo.endDate) entry.endDate = dateInfo.endDate;
      if (dateInfo.current) entry.current = true;

      education.push(entry);
    });

    return education;
  }

  private extractSkills(text: string): CVData['skills'] {
    const skills: CVData['skills'] = {
      technical: [],
      soft: [],
      languages: [],
      tools: [],
      frameworks: [],
      databases: []
    };

    const skillsSection = this.extractSection(text, [
      'Skills', 'Technical Skills', 'Technologies', 'Core Competencies'
    ]);

    if (!skillsSection) return skills;

    // Common technical skills
    const technicalSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust',
      'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask',
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins',
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
      'Git', 'Linux', 'Ubuntu', 'Windows', 'macOS'
    ];

    const softSkills = [
      'Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Critical Thinking',
      'Project Management', 'Time Management', 'Adaptability', 'Creativity', 'Collaboration'
    ];

    // Extract technical skills
    technicalSkills.forEach(skill => {
      if (skillsSection.toLowerCase().includes(skill.toLowerCase())) {
        skills.technical!.push(skill);
      }
    });

    // Extract soft skills
    softSkills.forEach(skill => {
      if (skillsSection.toLowerCase().includes(skill.toLowerCase())) {
        skills.soft!.push(skill);
      }
    });

    return skills;
  }

  private extractCertifications(text: string): CertificationEntry[] {
    const certifications: CertificationEntry[] = [];
    
    const certSection = this.extractSection(text, [
      'Certifications', 'Certificates', 'Professional Certifications'
    ]);

    if (!certSection) return certifications;

    // Pattern for certifications
    const certPattern = /([A-Z][a-zA-Z\s&.,-]+)\n([A-Z][a-zA-Z\s&.,-]+)(?:\n([\d]{4}\s*[-–]\s*[\d]{4}|[\d]{4}\s*[-–]\s*Present))?/gm;
    const matches = [...certSection.matchAll(certPattern)];

    matches.forEach(match => {
      const certification: CertificationEntry = {
        name: match[1]?.trim(),
        issuer: match[2]?.trim()
      };

      // Parse dates
      const dateInfo = this.parseDates(match[3]?.trim() || '');
      if (dateInfo.startDate) certification.issueDate = dateInfo.startDate;
      if (dateInfo.endDate && dateInfo.endDate !== 'present') certification.expiryDate = dateInfo.endDate;
      if (dateInfo.current) certification.current = true;

      certifications.push(certification);
    });

    return certifications;
  }

  private extractProjects(text: string): ProjectEntry[] {
    const projects: ProjectEntry[] = [];
    
    const projectSection = this.extractSection(text, [
      'Projects', 'Personal Projects', 'Academic Projects'
    ]);

    if (!projectSection) return projects;

    // Pattern for projects
    const projectPattern = /([A-Z][a-zA-Z\s&.,-]+)\n([^\n]+(?:\n(?![A-Z][a-zA-Z\s&.,-]+\n)[^\n])*)/gm;
    const matches = [...projectSection.matchAll(projectPattern)];

    matches.forEach(match => {
      const description = match[2]?.trim();
      if (description && description.length > 20) {
        projects.push({
          name: match[1]?.trim(),
          description: description
        });
      }
    });

    return projects;
  }

  private extractJobTitleAndCompany(text: string): { jobTitle?: string; company?: string } {
    const result: { jobTitle?: string; company?: string } = {};

    // Extract job title (usually in first few lines)
    const lines = text.split('\n').filter(line => line.trim()).slice(0, 10);
    
    const titleKeywords = [
      'Engineer', 'Developer', 'Manager', 'Director', 'Analyst', 'Designer', 
      'Specialist', 'Coordinator', 'Administrator', 'Consultant', 'Architect',
      'Developer', 'Programmer', 'Software Engineer', 'Full Stack', 'Front End',
      'Back End', 'DevOps', 'Data Scientist', 'Product Manager'
    ];

    for (const line of lines) {
      for (const keyword of titleKeywords) {
        if (line.toLowerCase().includes(keyword.toLowerCase())) {
          result.jobTitle = line.trim();
          break;
        }
      }
      if (result.jobTitle) break;
    }

    // Extract company name (usually near job title)
    const companyPatterns = [
      /(?:at|@)\s+([A-Z][a-zA-Z\s&.,-]+)/gi,
      /([A-Z][a-zA-Z\s&.,-]+(?:Inc|LLC|Corp|Company|LTD|Limited))/gi
    ];

    for (const pattern of companyPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        const company = matches[0].replace(/^(?:at|@)\s+/i, '').trim();
        if (company.length > 2 && company.length < 50) {
          result.company = company;
          break;
        }
      }
    }

    return result;
  }

  private extractLocation(text: string): string | undefined {
    const locationPatterns = [
      /(?:Location|Office|Based in)[\s:]+([^\n]+)/gi,
      /([A-Z][a-z]+,\s*[A-Z]{2})/g,
      /((?:San Francisco|New York|Los Angeles|Chicago|Houston|Phoenix|Philadelphia|San Antonio|San Diego|Dallas|San Jose|Austin|Seattle|Denver|Boston|Portland|Washington DC|Atlanta|Miami|Nashville)[,\s][A-Z]{2})/g
    ];

    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match) {
        const location = match[1] || match[0];
        if (location.length > 5 && location.length < 50) {
          return location.trim();
        }
      }
    }

    return undefined;
  }

  private extractEmploymentType(text: string): JDData['employmentType'] {
    const types: JDData['employmentType'][] = ['full-time', 'part-time', 'contract', 'temporary', 'internship', 'freelance', 'remote-only', 'hybrid'];
    
    for (const type of types) {
      if (type && text.toLowerCase().includes(type.replace('-', ' '))) {
        return type;
      }
    }

    return undefined;
  }

  private extractExperienceLevel(text: string): JDData['experienceLevel'] {
    const levels: JDData['experienceLevel'][] = ['entry-level', 'junior', 'mid-level', 'senior', 'lead', 'manager', 'director', 'executive'];
    
    for (const level of levels) {
      if (level && text.toLowerCase().includes(level.replace('-', ' '))) {
        return level;
      }
    }

    return undefined;
  }

  private extractSalary(text: string): JDData['salary'] {
    const salaryPattern = /\$([0-9,]+)\s*[-–]\s*\$([0-9,]+)(?:\s*(k|K))?/g;
    const match = text.match(salaryPattern);
    
    if (match) {
      const minSalary = parseInt(match[1].replace(/,/g, ''));
      const maxSalary = parseInt(match[2].replace(/,/g, ''));
      const isK = match[3] ? 'k' : '';
      
      return {
        min: isK ? minSalary * 1000 : minSalary,
        max: isK ? maxSalary * 1000 : maxSalary,
        currency: 'USD',
        period: 'yearly'
      };
    }

    return undefined;
  }

  private extractJobSummary(text: string): string | undefined {
    const summaryPatterns = [
      /(?:About the (?:Job|Role|Position)|Job Summary|Overview)[\s:]+([^\n]+(?:\n(?![A-Z][a-z]+:)[^\n])*)/i,
      /We are (?:looking for|seeking|hiring)[\s:]+([^\n]+(?:\n(?![A-Z][a-z]+:)[^\n])*)/i
    ];

    for (const pattern of summaryPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const summary = match[1].trim();
        if (summary.length > 20 && summary.length < 500) {
          return summary;
        }
      }
    }

    return undefined;
  }

  private extractResponsibilities(text: string): string[] {
    const responsibilities: string[] = [];
    
    const respSection = this.extractSection(text, [
      'Responsibilities', 'What You\'ll Do', 'Key Responsibilities', 'Duties'
    ]);

    if (!respSection) return responsibilities;

    // Extract bullet points and numbered lists
    const bulletPatterns = [
      /[-•*]\s+([^\n]+)/g,
      /^\d+\.\s+([^\n]+)/gm
    ];

    for (const pattern of bulletPatterns) {
      const matches = [...respSection.matchAll(pattern)];
      matches.forEach(match => {
        const responsibility = match[1]?.trim();
        if (responsibility && responsibility.length > 10) {
          responsibilities.push(responsibility);
        }
      });
    }

    return responsibilities;
  }

  private extractRequirements(text: string): JDData['requirements'] {
    const requirements: JDData['requirements'] = {
      required: [],
      preferred: []
    };

    const reqSection = this.extractSection(text, [
      'Requirements', 'Qualifications', 'Skills Required', 'What We\'re Looking For'
    ]);

    if (!reqSection) return requirements;

    // Look for bullet points
    const bulletPattern = /[-•*]\s+([^\n]+)/g;
    const matches = [...reqSection.matchAll(bulletPattern)];

    matches.forEach(match => {
      const requirement = match[1]?.trim();
      if (requirement && requirement.length > 10) {
        // Classify as required vs preferred based on keywords
        if (requirement.toLowerCase().includes('required') || 
            requirement.toLowerCase().includes('must have') ||
            requirement.toLowerCase().includes('experience')) {
          requirements.required!.push(requirement);
        } else if (requirement.toLowerCase().includes('preferred') ||
                   requirement.toLowerCase().includes('nice to have') ||
                   requirement.toLowerCase().includes('bonus')) {
          requirements.preferred!.push(requirement);
        } else {
          requirements.required!.push(requirement);
        }
      }
    });

    return requirements;
  }

  private extractJobSkills(text: string): JDData['skills'] {
    const skills: JDData['skills'] = {
      technical: [],
      soft: [],
      tools: [],
      frameworks: [],
      databases: []
    };

    // Extract from skills section
    const skillsSection = this.extractSection(text, [
      'Skills', 'Technical Skills', 'Technologies', 'Tech Stack'
    ]);

    if (skillsSection) {
      const technicalSkills = [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go',
        'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django',
        'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
        'PostgreSQL', 'MySQL', 'MongoDB', 'Redis'
      ];

      technicalSkills.forEach(skill => {
        if (skillsSection.toLowerCase().includes(skill.toLowerCase())) {
          skills.technical!.push(skill);
        }
      });
    }

    return skills;
  }

  private extractBenefits(text: string): any[] {
    const benefits: any[] = [];
    
    const benefitsSection = this.extractSection(text, [
      'Benefits', 'What We Offer', 'Perks', 'Compensation & Benefits'
    ]);

    if (!benefitsSection) return benefits;

    const benefitCategories = [
      'health', 'dental', 'vision', '401k', 'retirement', 'vacation', 'pto', 'flexible',
      'remote', 'work from home', 'bonus', 'stock', 'equity', 'professional development'
    ];

    benefitCategories.forEach(category => {
      if (benefitsSection.toLowerCase().includes(category)) {
        benefits.push({
          category: category,
          mentioned: true
        });
      }
    });

    return benefits;
  }

  // Helper methods
  private looksLikeCompanyName(text: string): boolean {
    const companyIndicators = ['Inc', 'LLC', 'Corp', 'Company', 'LTD', 'Limited', 'Technologies', 'Solutions', 'Group'];
    return companyIndicators.some(indicator => text.includes(indicator));
  }

  private extractSection(text: string, sectionNames: string[]): string | undefined {
    for (const sectionName of sectionNames) {
      const pattern = new RegExp(`${sectionName}\\s*[:\\n]([\\s\\S]*?)(?=\\n[A-Z][a-zA-Z\\s]+\\s*[:\\n]|$)`, 'i');
      const match = text.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    return undefined;
  }

  private extractDescriptionAfterDate(startIndex: number, text: string): string {
    const lines = text.substring(startIndex).split('\n').filter(line => line.trim());
    const description: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Stop if we hit another entry (looks like a title/company)
      if (this.looksLikeNewEntry(line)) break;
      
      if (line.length > 10 && !line.match(/^\d+$/)) {
        description.push(line);
      }
      
      // Stop after reasonable length
      if (description.join(' ').length > 500) break;
    }
    
    return description.join(' ');
  }

  private looksLikeNewEntry(line: string): boolean {
    // Looks like a new experience/education entry if it has title patterns
    return line.includes('Engineer') || line.includes('Developer') || 
           line.includes('Manager') || line.includes('Director') ||
           line.includes('University') || line.includes('College') ||
           line.includes('Bachelor') || line.includes('Master');
  }

  private parseDates(dateString: string): { startDate?: Date; endDate?: Date | 'present'; current?: boolean } {
    const result: { startDate?: Date; endDate?: Date | 'present'; current?: boolean } = {};
    
    if (!dateString) return result;

    // Handle various date formats
    const datePatterns = [
      /(\d{1,2})\/(\d{4})\s*[-–]\s*(\d{1,2})\/(\d{4})/,
      /(\d{4})\s*[-–]\s*(\d{4})/,
      /(\d{1,2}\/\d{4})\s*[-–]\s*(Present)/,
      /(\d{4})\s*[-–]\s*(Present)/
    ];

    for (const pattern of datePatterns) {
      const match = dateString.match(pattern);
      if (match) {
        if (match.length === 5) { // MM/YYYY - MM/YYYY format
          result.startDate = new Date(parseInt(match[2]), parseInt(match[1]) - 1, 1);
          result.endDate = new Date(parseInt(match[4]), parseInt(match[3]) - 1, 1);
        } else if (match.length === 3) { // YYYY - YYYY format
          result.startDate = new Date(parseInt(match[1]), 0, 1);
          result.endDate = new Date(parseInt(match[2]), 11, 31);
        } else if (match.length === 4 && match[3] === 'Present') { // YYYY/MM - Present format
          if (match[1].includes('/')) {
            const [month, year] = match[1].split('/');
            result.startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
          } else {
            result.startDate = new Date(parseInt(match[1]), 0, 1);
          }
          result.endDate = 'present';
          result.current = true;
        }
        break;
      }
    }

    return result;
  }
}

// Export singleton instance
export const aiExtractionService = new AIExtractionService();

// Main extraction functions
export async function extractCVData(ocrText: string): Promise<{ data: Partial<CVData>; confidence: number }> {
  try {
    const data = await aiExtractionService.extractCVData(ocrText);
    
    // Calculate confidence based on extracted data completeness
    const confidence = calculateExtractionConfidence(data, 'cv');
    
    return { data, confidence };
  } catch (error) {
    console.error('CV extraction failed:', error);
    throw error;
  }
}

export async function extractJDData(ocrText: string): Promise<{ data: Partial<JDData>; confidence: number }> {
  try {
    const data = await aiExtractionService.extractJDData(ocrText);
    
    // Calculate confidence based on extracted data completeness
    const confidence = calculateExtractionConfidence(data, 'jd');
    
    return { data, confidence };
  } catch (error) {
    console.error('JD extraction failed:', error);
    throw error;
  }
}

function calculateExtractionConfidence(data: any, type: 'cv' | 'jd'): number {
  let score = 0;
  let totalFields = 0;
  
  if (type === 'cv') {
    const cvData = data as Partial<CVData>;
    
    // Personal info (40% of score)
    if (cvData.personalInfo) {
      const personalFields = ['name', 'email', 'phone', 'location'];
      personalFields.forEach(field => {
        totalFields++;
        if (cvData.personalInfo![field as keyof typeof cvData.personalInfo]) {
          score += 10;
        }
      });
    }
    
    // Experience (30% of score)
    if (cvData.experience && cvData.experience.length > 0) {
      score += 30;
    }
    
    // Education (20% of score)
    if (cvData.education && cvData.education.length > 0) {
      score += 20;
    }
    
    // Skills (10% of score)
    if (cvData.skills) {
      const skillCategories = ['technical', 'soft', 'languages'];
      skillCategories.forEach(category => {
        totalFields++;
        if (cvData.skills![category as keyof typeof cvData.skills] && 
            Array.isArray(cvData.skills![category as keyof typeof cvData.skills]) &&
            cvData.skills![category as keyof typeof cvData.skills]!.length > 0) {
          score += 3.33;
        }
      });
    }
    
  } else if (type === 'jd') {
    const jdData = data as Partial<JDData>;
    
    // Job info (30% of score)
    const jobFields = ['jobTitle', 'company', 'location'];
    jobFields.forEach(field => {
      totalFields++;
      if (jdData[field as keyof typeof jdData]) {
        score += 10;
      }
    });
    
    // Responsibilities (30% of score)
    if (jdData.responsibilities && jdData.responsibilities.length > 0) {
      score += 30;
    }
    
    // Requirements (30% of score)
    if (jdData.requirements) {
      const reqFields = ['required', 'preferred'];
      reqFields.forEach(field => {
        totalFields++;
        if (jdData.requirements![field as keyof typeof jdData.requirements] && 
            Array.isArray(jdData.requirements![field as keyof typeof jdData.requirements]) &&
            jdData.requirements![field as keyof typeof jdData.requirements]!.length > 0) {
          score += 15;
        }
      });
    }
    
    // Skills (10% of score)
    if (jdData.skills) {
      const skillCategories = ['technical', 'soft'];
      skillCategories.forEach(category => {
        if (category === 'technical' || category === 'soft') {
          if (jdData.skills![category] && jdData.skills![category]!.length > 0) {
            score += 5;
          }
        }
      });
    }
  }
  
  return Math.min(100, Math.round(score));
}