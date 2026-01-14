import { 
  CVData, 
  JDData, 
  ValidationResult, 
  ValidationIssue, 
  ValidationCategory,
  DataSuggestion,
  SuggestionCategory,
  SuggestionSource,
  CompletenessScore,
  QualityScore,
  ExperienceEntry,
  EducationEntry
} from './analysis';

export class DocumentValidator {
  // CV Validation
  validateCV(cvData: Partial<CVData>): ValidationResult {
    const issues: ValidationIssue[] = [];
    const suggestions: DataSuggestion[] = [];
    
    // Validate personal information
    const personalIssues = this.validatePersonalInfo(cvData.personalInfo || {});
    issues.push(...personalIssues);
    
    // Validate experience
    const experienceIssues = this.validateExperience(cvData.experience || []);
    issues.push(...experienceIssues);
    
    // Validate education
    const educationIssues = this.validateEducation(cvData.education || []);
    issues.push(...educationIssues);
    
    // Validate skills
    const skillsIssues = this.validateSkills(cvData.skills || {});
    issues.push(...skillsIssues);
    
    // Generate suggestions based on issues
    const cvSuggestions = this.generateCVSuggestions(cvData, issues);
    suggestions.push(...cvSuggestions);
    
    // Calculate scores
    const completeness = this.calculateCVCompleteness(cvData);
    const quality = this.calculateCVQuality(cvData, issues);
    
    const overallScore = Math.round((completeness.overall + quality.overall) / 2);
    const grade = this.calculateGrade(overallScore);
    
    return {
      score: overallScore,
      grade,
      issues,
      suggestions,
      completeness,
      qualityScore: quality,
      confidence: this.calculateExtractionConfidence(cvData, issues)
    };
  }

  // JD Validation
  validateJD(jdData: Partial<JDData>): ValidationResult {
    const issues: ValidationIssue[] = [];
    const suggestions: DataSuggestion[] = [];
    
    // Validate job information
    const jobIssues = this.validateJobInfo(jdData);
    issues.push(...jobIssues);
    
    // Validate responsibilities
    const responsibilityIssues = this.validateResponsibilities(jdData.responsibilities || []);
    issues.push(...responsibilityIssues);
    
    // Validate requirements
    const requirementIssues = this.validateRequirements(jdData.requirements || {});
    issues.push(...requirementIssues);
    
    // Validate skills
    const skillsIssues = this.validateJDSkills(jdData.skills || {});
    issues.push(...skillsIssues);
    
    // Generate suggestions
    const jdSuggestions = this.generateJDSuggestions(jdData, issues);
    suggestions.push(...jdSuggestions);
    
    // Calculate scores
    const completeness = this.calculateJDCompleteness(jdData);
    const quality = this.calculateJDQuality(jdData, issues);
    
    const overallScore = Math.round((completeness.overall + quality.overall) / 2);
    const grade = this.calculateGrade(overallScore);
    
    return {
      score: overallScore,
      grade,
      issues,
      suggestions,
      completeness,
      qualityScore: quality,
      confidence: this.calculateExtractionConfidence(jdData, issues)
    };
  }

  // Personal Information Validation
  private validatePersonalInfo(personalInfo: CVData['personalInfo']): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    // Name validation
    if (!personalInfo.name || personalInfo.name.trim().length === 0) {
      issues.push({
        id: 'missing-name',
        field: 'personalInfo.name',
        category: 'personal-info',
        severity: 'error',
        message: 'Name is required and appears to be missing',
        suggestion: 'Please add your full name',
        autoFixable: false,
        priority: 'high'
      });
    } else if (personalInfo.name.length < 3) {
      issues.push({
        id: 'invalid-name',
        field: 'personalInfo.name',
        category: 'personal-info',
        severity: 'warning',
        message: 'Name appears to be too short',
        suggestion: 'Please enter your full name',
        autoFixable: false,
        priority: 'high'
      });
    }
    
    // Email validation
    if (!personalInfo.email) {
      issues.push({
        id: 'missing-email',
        field: 'personalInfo.email',
        category: 'personal-info',
        severity: 'error',
        message: 'Email is required and appears to be missing',
        suggestion: 'Add your professional email address',
        autoFixable: false,
        priority: 'high'
      });
    } else if (!this.isValidEmail(personalInfo.email)) {
      issues.push({
        id: 'invalid-email',
        field: 'personalInfo.email',
        category: 'personal-info',
        severity: 'error',
        message: 'Email format appears to be invalid',
        suggestion: 'Check email format (e.g., name@domain.com)',
        autoFixable: false,
        priority: 'high'
      });
    }
    
    // Phone validation
    if (!personalInfo.phone) {
      issues.push({
        id: 'missing-phone',
        field: 'personalInfo.phone',
        category: 'personal-info',
        severity: 'warning',
        message: 'Phone number is recommended but appears to be missing',
        suggestion: 'Add your phone number for better contact options',
        autoFixable: false,
        priority: 'medium'
      });
    } else if (!this.isValidPhone(personalInfo.phone)) {
      issues.push({
        id: 'invalid-phone',
        field: 'personalInfo.phone',
        category: 'personal-info',
        severity: 'warning',
        message: 'Phone number format appears to be invalid',
        suggestion: 'Format: +1 (555) 123-4567 or 555-123-4567',
        autoFixable: false,
        priority: 'medium'
      });
    }
    
    // Location validation
    if (!personalInfo.location) {
      issues.push({
        id: 'missing-location',
        field: 'personalInfo.location',
        category: 'personal-info',
        severity: 'warning',
        message: 'Location is recommended but appears to be missing',
        suggestion: 'Add your city, state or country',
        autoFixable: false,
        priority: 'medium'
      });
    }
    
    // LinkedIn validation
    if (!personalInfo.linkedin) {
      issues.push({
        id: 'missing-linkedin',
        field: 'personalInfo.linkedin',
        category: 'personal-info',
        severity: 'info',
        message: 'LinkedIn profile is recommended for professional networking',
        suggestion: 'Add your LinkedIn profile URL',
        autoFixable: false,
        priority: 'low'
      });
    }
    
    return issues;
  }

  // Experience Validation
  private validateExperience(experience: ExperienceEntry[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    if (experience.length === 0) {
      issues.push({
        id: 'no-experience',
        field: 'experience',
        category: 'experience',
        severity: 'error',
        message: 'No work experience found',
        suggestion: 'Add your relevant work experience, internships, or projects',
        autoFixable: false,
        priority: 'high'
      });
      return issues;
    }
    
    experience.forEach((exp, index) => {
      const prefix = `experience[${index}]`;
      
      if (!exp.title) {
        issues.push({
          id: `missing-title-${index}`,
          field: `${prefix}.title`,
          category: 'experience',
          severity: 'error',
          message: `Job title is missing for experience #${index + 1}`,
          suggestion: 'Add your job title',
          autoFixable: false,
          priority: 'high'
        });
      }
      
      if (!exp.company) {
        issues.push({
          id: `missing-company-${index}`,
          field: `${prefix}.company`,
          category: 'experience',
          severity: 'error',
          message: `Company name is missing for experience #${index + 1}`,
          suggestion: 'Add the company name',
          autoFixable: false,
          priority: 'high'
        });
      }
      
      if (!exp.duration && !exp.startDate) {
        issues.push({
          id: `missing-dates-${index}`,
          field: `${prefix}.duration`,
          category: 'experience',
          severity: 'error',
          message: `Employment dates are missing for experience #${index + 1}`,
          suggestion: 'Add start and end dates (or "Present")',
          autoFixable: false,
          priority: 'high'
        });
      }
      
      if (exp.description && exp.description.length < 20) {
        issues.push({
          id: `short-description-${index}`,
          field: `${prefix}.description`,
          category: 'experience',
          severity: 'warning',
          message: `Description for experience #${index + 1} is too short`,
          suggestion: 'Add more details about your responsibilities and achievements',
          autoFixable: false,
          priority: 'medium'
        });
      }
    });
    
    // Check for gaps in employment
    const sortedExperience = [...experience].sort((a, b) => {
      const aDate = new Date(a.startDate || '1900');
      const bDate = new Date(b.startDate || '1900');
      return bDate.getTime() - aDate.getTime();
    });
    
    for (let i = 0; i < sortedExperience.length - 1; i++) {
      const current = sortedExperience[i];
      const next = sortedExperience[i + 1];
      
      if (current.endDate && current.endDate !== 'present' && next.startDate) {
        const currentEnd = new Date(current.endDate);
        const nextStart = new Date(next.startDate);
        const gapInDays = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60 * 60 * 24);
        
        if (gapInDays > 180) { // More than 6 months gap
          issues.push({
            id: `employment-gap-${i}`,
            field: 'experience',
            category: 'experience',
            severity: 'info',
            message: `Potential employment gap of ${Math.round(gapInDays / 30)} months detected`,
            suggestion: 'Consider explaining employment gaps or including contract/freelance work',
            autoFixable: false,
            priority: 'low'
          });
        }
      }
    }
    
    return issues;
  }

  // Education Validation
  private validateEducation(education: EducationEntry[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    if (education.length === 0) {
      issues.push({
        id: 'no-education',
        field: 'education',
        category: 'education',
        severity: 'warning',
        message: 'No education information found',
        suggestion: 'Add your highest degree or relevant certifications',
        autoFixable: false,
        priority: 'medium'
      });
      return issues;
    }
    
    education.forEach((edu, index) => {
      const prefix = `education[${index}]`;
      
      if (!edu.degree) {
        issues.push({
          id: `missing-degree-${index}`,
          field: `${prefix}.degree`,
          category: 'education',
          severity: 'warning',
          message: `Degree information is missing for education #${index + 1}`,
          suggestion: 'Add your degree title',
          autoFixable: false,
          priority: 'medium'
        });
      }
      
      if (!edu.institution) {
        issues.push({
          id: `missing-institution-${index}`,
          field: `${prefix}.institution`,
          category: 'education',
          severity: 'warning',
          message: `Institution name is missing for education #${index + 1}`,
          suggestion: 'Add the educational institution name',
          autoFixable: false,
          priority: 'medium'
        });
      }
    });
    
    return issues;
  }

  // Skills Validation
  private validateSkills(skills: CVData['skills']): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    const hasTechnicalSkills = skills.technical && skills.technical.length > 0;
    const hasSoftSkills = skills.soft && skills.soft.length > 0;
    const hasAnySkills = hasTechnicalSkills || hasSoftSkills;
    
    if (!hasAnySkills) {
      issues.push({
        id: 'no-skills',
        field: 'skills',
        category: 'skills',
        severity: 'error',
        message: 'No skills information found',
        suggestion: 'Add your technical and soft skills',
        autoFixable: false,
        priority: 'high'
      });
    }
    
    if (skills.technical && skills.technical.length < 5) {
      issues.push({
        id: 'few-technical-skills',
        field: 'skills.technical',
        category: 'skills',
        severity: 'warning',
        message: 'Consider adding more technical skills',
        suggestion: 'Include programming languages, tools, and technologies you know',
        autoFixable: false,
        priority: 'medium'
      });
    }
    
    if (skills.soft && skills.soft.length < 3) {
      issues.push({
        id: 'few-soft-skills',
        field: 'skills.soft',
        category: 'skills',
        severity: 'info',
        message: 'Consider adding more soft skills',
        suggestion: 'Include communication, leadership, teamwork, and problem-solving skills',
        autoFixable: false,
        priority: 'low'
      });
    }
    
    return issues;
  }

  // Job Info Validation
  private validateJobInfo(jdData: Partial<JDData>): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    if (!jdData.jobTitle) {
      issues.push({
        id: 'missing-job-title',
        field: 'jobTitle',
        category: 'content',
        severity: 'error',
        message: 'Job title is missing',
        suggestion: 'Add a clear, specific job title',
        autoFixable: false,
        priority: 'high'
      });
    }
    
    if (!jdData.company) {
      issues.push({
        id: 'missing-company',
        field: 'company',
        category: 'content',
        severity: 'warning',
        message: 'Company name is missing',
        suggestion: 'Add the company name',
        autoFixable: false,
        priority: 'medium'
      });
    }
    
    if (!jdData.location) {
      issues.push({
        id: 'missing-job-location',
        field: 'location',
        category: 'content',
        severity: 'warning',
        message: 'Job location is missing',
        suggestion: 'Add the job location or specify if remote',
        autoFixable: false,
        priority: 'medium'
      });
    }
    
    if (!jdData.employmentType) {
      issues.push({
        id: 'missing-employment-type',
        field: 'employmentType',
        category: 'content',
        severity: 'info',
        message: 'Employment type is not specified',
        suggestion: 'Specify if this is full-time, part-time, contract, etc.',
        autoFixable: false,
        priority: 'low'
      });
    }
    
    return issues;
  }

  // Responsibilities Validation
  private validateResponsibilities(responsibilities: string[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    if (responsibilities.length === 0) {
      issues.push({
        id: 'no-responsibilities',
        field: 'responsibilities',
        category: 'content',
        severity: 'error',
        message: 'No job responsibilities found',
        suggestion: 'Add 3-7 key responsibilities for this role',
        autoFixable: false,
        priority: 'high'
      });
    } else if (responsibilities.length < 3) {
      issues.push({
        id: 'few-responsibilities',
        field: 'responsibilities',
        category: 'content',
        severity: 'warning',
        message: 'Consider adding more responsibilities',
        suggestion: 'Include at least 3-7 key responsibilities to give candidates a clear understanding of the role',
        autoFixable: false,
        priority: 'medium'
      });
    } else if (responsibilities.length > 10) {
      issues.push({
        id: 'too-many-responsibilities',
        field: 'responsibilities',
        category: 'content',
        severity: 'info',
        message: 'Consider consolidating responsibilities',
        suggestion: 'Group related responsibilities and aim for 3-7 key points',
        autoFixable: false,
        priority: 'low'
      });
    }
    
    responsibilities.forEach((resp, index) => {
      if (resp.length < 10) {
        issues.push({
          id: `short-responsibility-${index}`,
          field: `responsibilities[${index}]`,
          category: 'content',
          severity: 'warning',
          message: `Responsibility #${index + 1} is too short`,
          suggestion: 'Add more detail to describe the responsibility clearly',
          autoFixable: false,
          priority: 'medium'
        });
      }
    });
    
    return issues;
  }

  // Requirements Validation
  private validateRequirements(requirements: JDData['requirements']): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    const hasRequired = requirements.required && requirements.required.length > 0;
    const hasPreferred = requirements.preferred && requirements.preferred.length > 0;
    
    if (!hasRequired && !hasPreferred) {
      issues.push({
        id: 'no-requirements',
        field: 'requirements',
        category: 'content',
        severity: 'error',
        message: 'No job requirements found',
        suggestion: 'Add required and preferred qualifications',
        autoFixable: false,
        priority: 'high'
      });
    }
    
    if (hasRequired && requirements.required!.length < 2) {
      issues.push({
        id: 'few-required-requirements',
        field: 'requirements.required',
        category: 'content',
        severity: 'warning',
        message: 'Consider adding more required qualifications',
        suggestion: 'Include essential skills, experience, and education requirements',
        autoFixable: false,
        priority: 'medium'
      });
    }
    
    return issues;
  }

  // JD Skills Validation
  private validateJDSkills(skills: JDData['skills']): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    const hasTechnicalSkills = skills.technical && skills.technical.length > 0;
    
    if (!hasTechnicalSkills) {
      issues.push({
        id: 'no-technical-skills-jd',
        field: 'skills',
        category: 'content',
        severity: 'warning',
        message: 'No technical skills specified',
        suggestion: 'List the key technical skills and technologies required for this role',
        autoFixable: false,
        priority: 'medium'
      });
    }
    
    return issues;
  }

  // Suggestion Generation
  private generateCVSuggestions(cvData: Partial<CVData>, issues: ValidationIssue[]): DataSuggestion[] {
    const suggestions: DataSuggestion[] = [];
    
    // Suggest summary if missing
    if (!cvData.summary) {
      suggestions.push({
        id: 'add-summary',
        field: 'summary',
        category: 'missing-field',
        suggestedValue: 'Professional Software Engineer with 5+ years of experience developing scalable web applications. Passionate about clean code, user experience, and continuous learning.',
        confidence: 70,
        source: 'best-practice',
        reason: 'A summary helps recruiters quickly understand your background',
        impact: 'high'
      });
    }
    
    // Suggest skills if missing
    if (!cvData.skills || cvData.skills.technical!.length === 0) {
      suggestions.push({
        id: 'add-technical-skills',
        field: 'skills.technical',
        category: 'missing-field',
        suggestedValue: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python'],
        confidence: 80,
        source: 'industry-standard',
        reason: 'Technical skills are essential for most software roles',
        impact: 'high'
      });
    }
    
    return suggestions;
  }

  private generateJDSuggestions(jdData: Partial<JDData>, issues: ValidationIssue[]): DataSuggestion[] {
    const suggestions: DataSuggestion[] = [];
    
    // Suggest summary if missing
    if (!jdData.summary) {
      suggestions.push({
        id: 'add-job-summary',
        field: 'summary',
        category: 'missing-field',
        suggestedValue: 'We are seeking a talented Software Engineer to join our growing team and help us build innovative solutions that make a difference.',
        confidence: 75,
        source: 'best-practice',
        reason: 'A summary helps candidates understand the role and company culture',
        impact: 'high'
      });
    }
    
    return suggestions;
  }

  // Score Calculations
  private calculateCVCompleteness(cvData: Partial<CVData>): CompletenessScore {
    let personalInfo = 0;
    let experience = 0;
    let education = 0;
    let skills = 0;
    let summary = 0;
    
    // Personal info scoring (30% weight)
    const info = cvData.personalInfo || {};
    const personalFields = ['name', 'email', 'phone', 'location'];
    personalInfo = Math.round((personalFields.filter(field => info[field as keyof typeof info]).length / personalFields.length) * 100);
    
    // Experience scoring (25% weight)
    if (cvData.experience && cvData.experience.length > 0) {
      const completeExp = cvData.experience.filter(exp => 
        exp.title && exp.company && (exp.duration || exp.startDate)
      ).length;
      experience = Math.round((completeExp / cvData.experience.length) * 100);
    }
    
    // Education scoring (20% weight)
    if (cvData.education && cvData.education.length > 0) {
      const completeEdu = cvData.education.filter(edu => 
        edu.degree && edu.institution
      ).length;
      education = Math.round((completeEdu / cvData.education.length) * 100);
    }
    
    // Skills scoring (20% weight)
    if (cvData.skills) {
      const skillCategories = ['technical', 'soft'];
      const presentSkills = skillCategories.filter(cat => 
        cvData.skills![cat as keyof typeof cvData.skills] && 
        (cvData.skills![cat as keyof typeof cvData.skills] as string[]).length > 0
      ).length;
      skills = Math.round((presentSkills / skillCategories.length) * 100);
    }
    
    // Summary scoring (5% weight)
    summary = cvData.summary && cvData.summary.length > 20 ? 100 : 0;
    
    const overall = Math.round(
      personalInfo * 0.3 + 
      experience * 0.25 + 
      education * 0.2 + 
      skills * 0.2 + 
      summary * 0.05
    );
    
    return {
      overall,
      personalInfo,
      experience,
      education,
      skills,
      summary
    };
  }

  private calculateJDCompleteness(jdData: Partial<JDData>): CompletenessScore {
    let overall = 0;
    
    const jobInfoFields = ['jobTitle', 'company', 'location', 'employmentType', 'experienceLevel'];
    const presentJobFields = jobInfoFields.filter(field => jdData[field as keyof typeof jdData]).length;
    const jobInfoScore = Math.round((presentJobFields / jobInfoFields.length) * 100);
    
    const responsibilitiesScore = (jdData.responsibilities && jdData.responsibilities.length > 0) ? 100 : 0;
    const requirementsScore = (jdData.requirements && 
      (jdData.requirements.required!.length > 0 || jdData.requirements.preferred!.length > 0)) ? 100 : 0;
    const summaryScore = (jdData.summary && jdData.summary.length > 20) ? 100 : 0;
    
    overall = Math.round(
      jobInfoScore * 0.4 + 
      responsibilitiesScore * 0.3 + 
      requirementsScore * 0.2 + 
      summaryScore * 0.1
    );
    
    return {
      overall,
      personalInfo: jobInfoScore,
      experience: responsibilitiesScore,
      education: requirementsScore,
      skills: summaryScore,
      summary: summaryScore
    };
  }

  private calculateCVQuality(cvData: Partial<CVData>, issues: ValidationIssue[]): QualityScore {
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    const totalFields = this.countCVFields(cvData);
    
    const clarity = Math.max(0, 100 - (errorCount * 20) - (warningCount * 5));
    const impact = Math.max(0, 100 - (warningCount * 3));
    const structure = Math.max(0, 100 - (errorCount * 15));
    const completeness = this.calculateCVCompleteness(cvData).overall;
    const keywordOptimization = this.calculateKeywordScore(cvData);
    
    const overall = Math.round((clarity + impact + structure + completeness + keywordOptimization) / 5);
    
    return {
      overall,
      clarity,
      impact,
      keywordOptimization,
      structure,
      completeness
    };
  }

  private calculateJDQuality(jdData: Partial<JDData>, issues: ValidationIssue[]): QualityScore {
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    
    const clarity = Math.max(0, 100 - (errorCount * 20) - (warningCount * 5));
    const impact = Math.max(0, 100 - (warningCount * 3));
    const structure = Math.max(0, 100 - (errorCount * 15));
    const completeness = this.calculateJDCompleteness(jdData).overall;
    const keywordOptimization = this.calculateKeywordScore(jdData);
    
    const overall = Math.round((clarity + impact + structure + completeness + keywordOptimization) / 5);
    
    return {
      overall,
      clarity,
      impact,
      keywordOptimization,
      structure,
      completeness
    };
  }

  // Helper Methods
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?1[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$|^[0-9]{3}[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
    return phoneRegex.test(phone);
  }

  private countCVFields(cvData: Partial<CVData>): number {
    let count = 0;
    
    if (cvData.personalInfo) {
      count += Object.values(cvData.personalInfo).filter(val => val).length;
    }
    
    if (cvData.experience) {
      count += cvData.experience.length * 3; // title, company, dates
    }
    
    if (cvData.education) {
      count += cvData.education.length * 2; // degree, institution
    }
    
    if (cvData.skills) {
      count += Object.values(cvData.skills).filter(val => val && val.length > 0).length;
    }
    
    if (cvData.summary) count++;
    
    return count;
  }

  private calculateKeywordScore(data: any): number {
    // Simple keyword scoring based on presence of important terms
    let score = 50; // Base score
    
    const importantKeywords = [
      'experience', 'skills', 'project', 'team', 'development',
      'management', 'leadership', 'communication', 'analysis'
    ];
    
    const text = JSON.stringify(data).toLowerCase();
    const foundKeywords = importantKeywords.filter(keyword => text.includes(keyword));
    
    score += foundKeywords.length * 5;
    
    return Math.min(100, score);
  }

  private calculateExtractionConfidence(data: any, issues: ValidationIssue[]): number {
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const totalFields = Object.keys(data).length;
    
    if (totalFields === 0) return 0;
    
    const baseConfidence = Math.max(0, 100 - (errorCount * 10));
    const fieldConfidence = Math.min(100, (totalFields / 10) * 100); // Assuming 10 fields is full confidence
    
    return Math.round((baseConfidence + fieldConfidence) / 2);
  }

  private calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}

// Export singleton instance
export const documentValidator = new DocumentValidator();

// Main validation functions
export async function validateDocument(data: any, type: 'cv' | 'jd'): Promise<ValidationResult> {
  if (type === 'cv') {
    return documentValidator.validateCV(data as Partial<CVData>);
  } else {
    return documentValidator.validateJD(data as Partial<JDData>);
  }
}