import { 
  CVData, 
  JDData, 
  DataSuggestion, 
  SuggestionCategory,
  SuggestionSource,
  ValidationResult,
  MissingDataAnalysis
} from './analysis';

export class SmartSuggestionsEngine {
  
  // Generate suggestions for CV
  generateCVSuggestions(
    cvData: Partial<CVData>, 
    validation: ValidationResult,
    missingData: MissingDataAnalysis
  ): DataSuggestion[] {
    const suggestions: DataSuggestion[] = [];

    // Personal Info Suggestions
    suggestions.push(...this.generatePersonalInfoSuggestions(cvData.personalInfo || {}));
    
    // Experience Suggestions
    suggestions.push(...this.generateExperienceSuggestions(cvData.experience || []));
    
    // Education Suggestions
    suggestions.push(...this.generateEducationSuggestionsForCV(cvData.education || []));
    
    // Skills Suggestions
    suggestions.push(...this.generateSkillsSuggestions(cvData.skills || {}));
    
    // Summary Suggestions
    suggestions.push(...this.generateSummarySuggestions(cvData));
    
    // Content Quality Suggestions
    suggestions.push(...this.generateContentQualitySuggestions(cvData, validation));
    
    // ATS Optimization Suggestions
    suggestions.push(...this.generateATSOptimizationSuggestions(cvData));
    
    // Industry-Specific Suggestions
    suggestions.push(...this.generateIndustrySpecificSuggestions(cvData));

    // Sort by impact and confidence
    return suggestions.sort((a, b) => {
      const impactWeight = b.impact === 'high' ? 3 : b.impact === 'medium' ? 2 : 1;
      const confidenceWeight = b.confidence / 100;
      
      const scoreA = (a.impact === 'high' ? 3 : a.impact === 'medium' ? 2 : 1) * (a.confidence / 100);
      const scoreB = impactWeight * confidenceWeight;
      
      return scoreB - scoreA;
    });
  }

  // Generate suggestions for JD
  generateJDSuggestions(
    jdData: Partial<JDData>, 
    validation: ValidationResult,
    missingData: MissingDataAnalysis
  ): DataSuggestion[] {
    const suggestions: DataSuggestion[] = [];

    // Job Info Suggestions
    suggestions.push(...this.generateJobInfoSuggestions(jdData));
    
    // Responsibilities Suggestions
    suggestions.push(...this.generateResponsibilitiesSuggestions(jdData.responsibilities || []));
    
    // Requirements Suggestions
    suggestions.push(...this.generateRequirementsSuggestions(jdData.requirements || {}));
    
    // Skills Suggestions
    suggestions.push(...this.generateJDSkillsSuggestions(jdData.skills || {}));
    
    // Summary Suggestions
    suggestions.push(...this.generateJDSummarySuggestions(jdData));
    
    // Content Quality Suggestions
    suggestions.push(...this.generateJDContentQualitySuggestions(jdData, validation));
    
    // Candidate Experience Suggestions
    suggestions.push(...this.generateCandidateExperienceSuggestions(jdData));

    // Sort by impact and confidence
    return suggestions.sort((a, b) => {
      const impactWeight = b.impact === 'high' ? 3 : b.impact === 'medium' ? 2 : 1;
      const confidenceWeight = b.confidence / 100;
      
      const scoreA = (a.impact === 'high' ? 3 : a.impact === 'medium' ? 2 : 1) * (a.confidence / 100);
      const scoreB = impactWeight * confidenceWeight;
      
      return scoreB - scoreA;
    });
  }

  // Personal Information Suggestions
  private generatePersonalInfoSuggestions(personalInfo: CVData['personalInfo']): DataSuggestion[] {
    const suggestions: DataSuggestion[] = [];

    if (!personalInfo.linkedin) {
      suggestions.push({
        id: 'add-linkedin',
        field: 'personalInfo.linkedin',
        category: 'missing-field',
        suggestedValue: 'linkedin.com/in/yourprofile',
        confidence: 85,
        source: 'best-practice',
        reason: 'LinkedIn profile provides professional networking opportunities and credibility',
        impact: 'medium'
      });
    }

    if (!personalInfo.github && this.isLikelyTechRole(personalInfo)) {
      suggestions.push({
        id: 'add-github',
        field: 'personalInfo.github',
        category: 'missing-field',
        suggestedValue: 'github.com/yourusername',
        confidence: 80,
        source: 'industry-standard',
        reason: 'GitHub showcases coding skills and project contributions for tech roles',
        impact: 'medium'
      });
    }

    if (!personalInfo.portfolio && this.isLikelyCreativeRole(personalInfo)) {
      suggestions.push({
        id: 'add-portfolio',
        field: 'personalInfo.portfolio',
        category: 'missing-field',
        suggestedValue: 'yourportfolio.com',
        confidence: 75,
        source: 'industry-standard',
        reason: 'Portfolio displays your work samples and projects',
        impact: 'medium'
      });
    }

    if (personalInfo.phone && !personalInfo.phone.includes('+')) {
      suggestions.push({
        id: 'format-phone-international',
        field: 'personalInfo.phone',
        category: 'format-correction',
        suggestedValue: `+1 ${personalInfo.phone}`,
        confidence: 90,
        source: 'best-practice',
        reason: 'International phone format ensures global recruiters can contact you',
        impact: 'low'
      });
    }

    return suggestions;
  }

  // Experience Suggestions
  private generateExperienceSuggestions(experience: any[]): DataSuggestion[] {
    const suggestions: DataSuggestion[] = [];

    experience.forEach((exp, index) => {
      // Suggest adding achievements if missing
      if (!exp.description || exp.description.length < 50) {
        suggestions.push({
          id: `enhance-experience-description-${index}`,
          field: `experience[${index}].description`,
          category: 'content-improvement',
          suggestedValue: this.generateExperienceDescriptionTemplate(exp),
          confidence: 70,
          source: 'ai-analysis',
          reason: 'Detailed descriptions with achievements help you stand out',
          impact: 'high'
        });
      }

      // Suggest adding metrics
      if (exp.description && !this.hasMetrics(exp.description)) {
        suggestions.push({
          id: `add-metrics-${index}`,
          field: `experience[${index}].description`,
          category: 'content-improvement',
          suggestedValue: this.addMetricsToDescription(exp.description),
          confidence: 75,
          source: 'best-practice',
          reason: 'Quantifiable achievements demonstrate impact and value',
          impact: 'high'
        });
      }

      // Suggest adding technologies if missing
      if (!exp.technologies || exp.technologies.length === 0) {
        const suggestedTech = this.suggestTechnologiesForRole(exp.title);
        suggestions.push({
          id: `add-technologies-${index}`,
          field: `experience[${index}].technologies`,
          category: 'missing-field',
          suggestedValue: suggestedTech,
          confidence: 65,
          source: 'ai-analysis',
          reason: 'Listing technologies improves ATS matching and recruiter understanding',
          impact: 'medium'
        });
      }
    });

    return suggestions;
  }

  // Education Suggestions
  private generateEducationSuggestionsForCV(education: any[]): DataSuggestion[] {
    const suggestions: DataSuggestion[] = [];

    education.forEach((edu, index) => {
      // Suggest adding GPA if good
      if (!edu.gpa && this.shouldAddGPA(edu.year)) {
        suggestions.push({
          id: `add-gpa-${index}`,
          field: `education[${index}].gpa`,
          category: 'missing-field',
          suggestedValue: '3.5/4.0',
          confidence: 60,
          source: 'best-practice',
          reason: 'GPA can strengthen your profile if it\'s impressive',
          impact: 'low'
        });
      }

      // Suggest adding relevant coursework
      if (!edu.coursework || edu.coursework.length === 0) {
        const suggestedCoursework = this.suggestRelevantCoursework(edu.field);
        suggestions.push({
          id: `add-coursework-${index}`,
          field: `education[${index}].coursework`,
          category: 'missing-field',
          suggestedValue: suggestedCoursework,
          confidence: 70,
          source: 'ai-analysis',
          reason: 'Relevant coursework shows specific knowledge and skills',
          impact: 'medium'
        });
      }

      // Suggest adding honors if applicable
      if (!edu.honors || edu.honors.length === 0) {
        suggestions.push({
          id: `add-honors-${index}`,
          field: `education[${index}].honors`,
          category: 'missing-field',
          suggestedValue: ['Dean\'s List', 'Magna Cum Laude', 'Honor Society'],
          confidence: 50,
          source: 'best-practice',
          reason: 'Academic honors demonstrate excellence and dedication',
          impact: 'low'
        });
      }
    });

    return suggestions;
  }

  // Skills Suggestions
  private generateSkillsSuggestions(skills: CVData['skills']): DataSuggestion[] {
    const suggestions: DataSuggestion[] = [];

    // Suggest additional technical skills based on experience
    if (skills.technical && skills.technical.length < 8) {
      const suggestedSkills = this.suggestAdditionalTechnicalSkills(skills.technical);
      suggestions.push({
        id: 'expand-technical-skills',
        field: 'skills.technical',
        category: 'skill-optimization',
        suggestedValue: [...skills.technical, ...suggestedSkills],
        confidence: 75,
        source: 'ai-analysis',
        reason: 'Additional technical skills increase job matching opportunities',
        impact: 'high'
      });
    }

    // Suggest soft skills based on experience level
    if (!skills.soft || skills.soft.length < 5) {
      const suggestedSoftSkills = this.suggestSoftSkills();
      suggestions.push({
        id: 'expand-soft-skills',
        field: 'skills.soft',
        category: 'skill-optimization',
        suggestedValue: suggestedSoftSkills,
        confidence: 80,
        source: 'industry-standard',
        reason: 'Soft skills are crucial for team collaboration and career growth',
        impact: 'medium'
      });
    }

    // Suggest categorizing skills better
    if (skills.technical && !skills.frameworks) {
      const frameworks = this.extractFrameworks(skills.technical);
      if (frameworks.length > 0) {
        suggestions.push({
          id: 'organize-frameworks',
          field: 'skills.frameworks',
          category: 'structure-improvement',
          suggestedValue: frameworks,
          confidence: 85,
          source: 'best-practice',
          reason: 'Organizing frameworks separately improves readability and ATS matching',
          impact: 'medium'
        });
      }
    }

    return suggestions;
  }

  // Summary Suggestions
  private generateSummarySuggestions(cvData: Partial<CVData>): DataSuggestion[] {
    const suggestions: DataSuggestion[] = [];

    if (!cvData.summary) {
      const yearsOfExperience = this.calculateYearsOfExperience(cvData.experience || []);
      suggestions.push({
        id: 'add-professional-summary',
        field: 'summary',
        category: 'missing-field',
        suggestedValue: this.generateSummaryTemplate(cvData, yearsOfExperience),
        confidence: 90,
        source: 'ai-analysis',
        reason: 'Professional summary provides quick overview for recruiters',
        impact: 'high'
      });
    } else if (cvData.summary.length < 50) {
      suggestions.push({
        id: 'expand-summary',
        field: 'summary',
        category: 'content-improvement',
        suggestedValue: this.expandSummary(cvData.summary, cvData),
        confidence: 80,
        source: 'ai-analysis',
        reason: 'Longer summary can better showcase your value proposition',
        impact: 'medium'
      });
    }

    return suggestions;
  }

  // Content Quality Suggestions
  private generateContentQualitySuggestions(cvData: Partial<CVData>, validation: ValidationResult): DataSuggestion[] {
    const suggestions: DataSuggestion[] = [];

    // Suggest action verbs if descriptions are passive
    cvData.experience?.forEach((exp, index) => {
      if (exp.description && this.hasPassiveLanguage(exp.description)) {
        suggestions.push({
          id: `use-action-verbs-${index}`,
          field: `experience[${index}].description`,
          category: 'content-improvement',
          suggestedValue: this.convertToActiveLanguage(exp.description),
          confidence: 85,
          source: 'best-practice',
          reason: 'Action verbs make your achievements more impactful',
          impact: 'medium'
        });
      }
    });

    // Suggest removing jargon if detected
    const jargonWords = this.detectJargon(cvData);
    if (jargonWords.length > 0) {
      suggestions.push({
        id: 'remove-jargon',
        field: 'overall',
        category: 'content-improvement',
        suggestedValue: this.suggestJargonAlternatives(jargonWords),
        confidence: 70,
        source: 'best-practice',
        reason: 'Removing jargon makes your CV more accessible to recruiters',
        impact: 'medium'
      });
    }

    return suggestions;
  }

  // ATS Optimization Suggestions
  private generateATSOptimizationSuggestions(cvData: Partial<CVData>): DataSuggestion[] {
    const suggestions: DataSuggestion[] = [];

    // Suggest keywords based on job market trends
    const suggestedKeywords = this.getMarketKeywords(cvData);
    if (suggestedKeywords.length > 0) {
      suggestions.push({
        id: 'add-ats-keywords',
        field: 'skills.technical',
        category: 'keyword-addition',
        suggestedValue: suggestedKeywords,
        confidence: 85,
        source: 'job-matching',
        reason: 'These keywords are frequently requested by recruiters and improve ATS matching',
        impact: 'high'
      });
    }

    // Suggest formatting improvements
    const formattingIssues = this.checkATSFormatting(cvData);
    formattingIssues.forEach((issue, index) => {
      suggestions.push({
        id: `ats-formatting-${index}`,
        field: issue.field,
        category: 'format-correction',
        suggestedValue: issue.suggestion,
        confidence: 90,
        source: 'best-practice',
        reason: issue.reason,
        impact: 'medium'
      });
    });

    return suggestions;
  }

  // Industry-Specific Suggestions
  private generateIndustrySpecificSuggestions(cvData: Partial<CVData>): DataSuggestion[] {
    const suggestions: DataSuggestion[] = [];
    const industry = this.detectIndustry(cvData);

    switch (industry) {
      case 'tech':
        suggestions.push(...this.generateTechSuggestions(cvData));
        break;
      case 'healthcare':
        suggestions.push(...this.generateHealthcareSuggestions(cvData));
        break;
      case 'finance':
        suggestions.push(...this.generateFinanceSuggestions(cvData));
        break;
      case 'education':
        suggestions.push(...this.generateEducationIndustrySuggestions(cvData));
        break;
    }

    return suggestions;
  }

  // Job Info Suggestions for JD
  private generateJobInfoSuggestions(jdData: Partial<JDData>): DataSuggestion[] {
    const suggestions: DataSuggestion[] = [];

    if (!jdData.salary) {
      const suggestedSalary = this.suggestSalaryRange(jdData.jobTitle, jdData.experienceLevel);
      suggestions.push({
        id: 'add-salary-range',
        field: 'salary',
        category: 'missing-field',
        suggestedValue: suggestedSalary,
        confidence: 75,
        source: 'industry-standard',
        reason: 'Salary range transparency attracts more qualified candidates',
        impact: 'medium'
      });
    }

    if (!jdData.remoteOption) {
      suggestions.push({
        id: 'specify-remote-option',
        field: 'remoteOption',
        category: 'missing-field',
        suggestedValue: 'hybrid',
        confidence: 85,
        source: 'industry-standard',
        reason: 'Remote work flexibility is important to modern candidates',
        impact: 'medium'
      });
    }

    return suggestions;
  }

  // Responsibilities Suggestions for JD
  private generateResponsibilitiesSuggestions(responsibilities: string[]): DataSuggestion[] {
    const suggestions: DataSuggestion[] = [];

    if (responsibilities.length < 3) {
      const additionalResponsibilities = this.suggestAdditionalResponsibilities();
      suggestions.push({
        id: 'expand-responsibilities',
        field: 'responsibilities',
        category: 'content-improvement',
        suggestedValue: [...responsibilities, ...additionalResponsibilities],
        confidence: 80,
        source: 'best-practice',
        reason: 'Add more responsibilities to give candidates complete picture of the role',
        impact: 'high'
      });
    }

    // Suggest making responsibilities more action-oriented
    responsibilities.forEach((resp, index) => {
      if (this.isPassiveResponsibility(resp)) {
        suggestions.push({
          id: `active-responsibility-${index}`,
          field: `responsibilities[${index}]`,
          category: 'content-improvement',
          suggestedValue: this.makeResponsibilityActive(resp),
          confidence: 85,
          source: 'best-practice',
          reason: 'Action-oriented responsibilities are clearer and more engaging',
          impact: 'medium'
        });
      }
    });

    return suggestions;
  }

  // Requirements Suggestions for JD
  private generateRequirementsSuggestions(requirements: JDData['requirements']): DataSuggestion[] {
    const suggestions: DataSuggestion[] = [];

    if (!requirements.preferred || requirements.preferred.length === 0) {
      const suggestedPreferred = this.suggestPreferredRequirements(requirements.required || []);
      suggestions.push({
        id: 'add-preferred-requirements',
        field: 'requirements.preferred',
        category: 'missing-field',
        suggestedValue: suggestedPreferred,
        confidence: 75,
        source: 'best-practice',
        reason: 'Preferred qualifications help identify exceptional candidates',
        impact: 'medium'
      });
    }

    return suggestions;
  }

  // Helper Methods
  private isLikelyTechRole(personalInfo?: CVData['personalInfo']): boolean {
    const techIndicators = ['software', 'developer', 'engineer', 'programmer', 'full stack', 'backend', 'frontend'];
    const text = JSON.stringify(personalInfo || {}).toLowerCase();
    return techIndicators.some(indicator => text.includes(indicator));
  }

  private isLikelyCreativeRole(personalInfo?: CVData['personalInfo']): boolean {
    const creativeIndicators = ['designer', 'artist', 'creative', 'ui', 'ux', 'graphic', 'illustrator'];
    const text = JSON.stringify(personalInfo || {}).toLowerCase();
    return creativeIndicators.some(indicator => text.includes(indicator));
  }

  private generateExperienceDescriptionTemplate(experience: any): string {
    const templates = [
      `Responsible for ${experience.title || 'key responsibilities'} at ${experience.company || 'organization'}, focusing on delivering high-quality results and collaborating with cross-functional teams to achieve business objectives.`,
      `Served as ${experience.title || 'team member'} at ${experience.company || 'company'}, driving innovation and excellence through strategic initiatives and effective problem-solving.`,
      `Contributed to ${experience.company || 'organization\'s success'} as ${experience.title || 'professional'}, leveraging expertise to optimize processes and deliver exceptional outcomes.`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private hasMetrics(description: string): boolean {
    const metricPatterns = [
      /\d+%/,
      /\$\d+/,
      /\d+x/,
      /\d+ (year|month|week|day)s?/,
      /(increased|decreased|reduced|improved|grew|saved) by \d+/i
    ];
    return metricPatterns.some(pattern => pattern.test(description));
  }

  private addMetricsToDescription(description: string): string {
    // Simple enhancement - in real AI service, this would be more sophisticated
    return description + ' Achieved 15% improvement in efficiency and reduced costs by $10K annually.';
  }

  private suggestTechnologiesForRole(title?: string): string[] {
    const roleTechMap: Record<string, string[]> = {
      'software engineer': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Git'],
      'data scientist': ['Python', 'R', 'TensorFlow', 'Scikit-learn', 'SQL'],
      'product manager': ['JIRA', 'Confluence', 'Analytics tools', 'Agile/Scrum'],
      'designer': ['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping tools']
    };

    const normalizedTitle = title?.toLowerCase() || '';
    for (const [role, tech] of Object.entries(roleTechMap)) {
      if (normalizedTitle.includes(role)) {
        return tech;
      }
    }

    return ['JavaScript', 'Git', 'Agile']; // Default suggestions
  }

  private calculateYearsOfExperience(experience: any[]): number {
    // Simple calculation - would be more sophisticated in real implementation
    return experience.length * 2; // Assume 2 years per position
  }

  private generateSummaryTemplate(cvData: Partial<CVData>, yearsOfExperience: number): string {
    const templates = [
      `Professional with ${yearsOfExperience}+ years of experience delivering innovative solutions and driving business success through strategic thinking and technical expertise.`,
      `Results-oriented professional with ${yearsOfExperience} years of experience specializing in technology and business transformation, consistently exceeding expectations and contributing to organizational growth.`,
      `Accomplished professional with a track record of success over ${yearsOfExperience} years, combining technical expertise with strong leadership skills to deliver exceptional results.`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private hasPassiveLanguage(description: string): boolean {
    const passiveIndicators = ['responsible for', 'involved in', 'participated in', 'assisted with'];
    return passiveIndicators.some(indicator => description.toLowerCase().includes(indicator));
  }

  private convertToActiveLanguage(description: string): string {
    const replacements: Record<string, string> = {
      'responsible for': 'Led',
      'involved in': 'Contributed to',
      'participated in': 'Participated in and improved',
      'assisted with': 'Supported'
    };

    let result = description;
    Object.entries(replacements).forEach(([passive, active]) => {
      result = result.replace(new RegExp(passive, 'gi'), active);
    });

    return result;
  }

  private detectJargon(cvData: Partial<CVData>): string[] {
    const commonJargon = ['synergize', 'leverage', 'paradigm', 'utilize', 'optimize', 'streamline'];
    const text = JSON.stringify(cvData).toLowerCase();
    return commonJargon.filter(word => text.includes(word));
  }

  private suggestJargonAlternatives(jargonWords: string[]): string[] {
    const alternatives: Record<string, string> = {
      'synergize': 'collaborate',
      'leverage': 'use',
      'paradigm': 'approach',
      'utilize': 'use',
      'optimize': 'improve',
      'streamline': 'simplify'
    };

    return jargonWords.map(word => alternatives[word] || word);
  }

  private getMarketKeywords(cvData: Partial<CVData>): string[] {
    // Based on current job market trends
    const trendingKeywords = ['Cloud Computing', 'Machine Learning', 'DevOps', 'Agile', 'Microservices'];
    const existingKeywords = cvData.skills?.technical || [];
    
    return trendingKeywords.filter(keyword => 
      !existingKeywords.some(existing => existing.toLowerCase().includes(keyword.toLowerCase()))
    );
  }

  private checkATSFormatting(cvData: Partial<CVData>): Array<{field: string; suggestion: string; reason: string}> {
    const issues = [];
    
    // Check for common ATS issues
    if (JSON.stringify(cvData).length > 15000) {
      issues.push({
        field: 'overall',
        suggestion: 'Consider condensing content to 2-3 pages maximum',
        reason: 'ATS systems may truncate or reject overly long documents'
      });
    }

    return issues;
  }

  private detectIndustry(cvData: Partial<CVData>): string {
    const text = JSON.stringify(cvData).toLowerCase();
    
    if (text.includes('software') || text.includes('developer') || text.includes('engineer')) {
      return 'tech';
    }
    if (text.includes('nurse') || text.includes('doctor') || text.includes('medical')) {
      return 'healthcare';
    }
    if (text.includes('finance') || text.includes('banking') || text.includes('accounting')) {
      return 'finance';
    }
    if (text.includes('teacher') || text.includes('education') || text.includes('professor')) {
      return 'education';
    }
    
    return 'general';
  }

  private generateTechSuggestions(cvData: Partial<CVData>): DataSuggestion[] {
    return [{
      id: 'add-github-projects',
      field: 'personalInfo.github',
      category: 'missing-field',
      suggestedValue: 'github.com/yourusername',
      confidence: 85,
      source: 'industry-standard',
      reason: 'GitHub projects demonstrate practical coding skills for tech roles',
      impact: 'medium'
    }];
  }

  // Additional helper methods for other industries would go here...
  private generateHealthcareSuggestions(cvData: Partial<CVData>): DataSuggestion[] { return []; }
  private generateFinanceSuggestions(cvData: Partial<CVData>): DataSuggestion[] { return []; }
  private generateEducationIndustrySuggestions(cvData: Partial<CVData>): DataSuggestion[] { return []; } // Different from education suggestions above

  private shouldAddGPA(year?: string): boolean {
    if (!year) return false;
    const gradYear = parseInt(year);
    const yearsSinceGraduation = new Date().getFullYear() - gradYear;
    return yearsSinceGraduation < 5; // Only suggest GPA for recent graduates
  }

  private suggestRelevantCoursework(field?: string): string[] {
    const courseworkMap: Record<string, string[]> = {
      'computer science': ['Data Structures', 'Algorithms', 'Database Systems', 'Software Engineering'],
      'business': ['Financial Analysis', 'Marketing Strategy', 'Operations Management', 'Business Analytics'],
      'engineering': ['Thermodynamics', 'Materials Science', 'CAD/CAM', 'Project Management']
    };
    
    const normalizedField = field?.toLowerCase() || '';
    return courseworkMap[normalizedField] || ['Core Curriculum', 'Specialized Courses'];
  }

  private suggestAdditionalTechnicalSkills(currentSkills: string[]): string[] {
    const allTechSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust',
      'React', 'Angular', 'Vue', 'Node.js', 'Django', 'Spring Boot',
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform',
      'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'MySQL'
    ];
    
    return allTechSkills.filter(skill => 
      !currentSkills.some(existing => existing.toLowerCase() === skill.toLowerCase())
    ).slice(0, 5);
  }

  private suggestSoftSkills(): string[] {
    return [
      'Communication', 'Leadership', 'Problem Solving', 'Teamwork', 
      'Time Management', 'Adaptability', 'Critical Thinking', 'Creativity'
    ];
  }

  private extractFrameworks(technicalSkills: string[]): string[] {
    const frameworkKeywords = ['React', 'Angular', 'Vue', 'Django', 'Spring', 'Laravel', 'Flask'];
    return technicalSkills.filter(skill => 
      frameworkKeywords.some(framework => skill.toLowerCase().includes(framework.toLowerCase()))
    );
  }

  private expandSummary(currentSummary: string, cvData: Partial<CVData>): string {
    const experienceCount = cvData.experience?.length || 0;
    const skillsCount = (cvData.skills?.technical?.length || 0) + (cvData.skills?.soft?.length || 0);
    
    return `${currentSummary} With ${experienceCount} years of professional experience and expertise in ${skillsCount} key technologies, I bring a proven track record of delivering high-impact solutions and driving business success.`;
  }

  private suggestSalaryRange(jobTitle?: string, experienceLevel?: string): any {
    const salaryRanges: Record<string, any> = {
      'senior': { min: 120000, max: 180000, currency: 'USD', period: 'yearly' },
      'mid-level': { min: 80000, max: 120000, currency: 'USD', period: 'yearly' },
      'junior': { min: 60000, max: 90000, currency: 'USD', period: 'yearly' }
    };
    
    return salaryRanges[experienceLevel || 'mid-level'] || salaryRanges['mid-level'];
  }

  private suggestAdditionalResponsibilities(): string[] {
    return [
      'Collaborate with cross-functional teams to deliver projects on time and within budget',
      'Mentor junior team members and contribute to knowledge sharing initiatives',
      'Stay current with industry trends and recommend process improvements',
      'Participate in code reviews and maintain high code quality standards'
    ];
  }

  private isPassiveResponsibility(responsibility: string): boolean {
    const passiveIndicators = ['responsible for', 'involved in', 'participate in'];
    return passiveIndicators.some(indicator => responsibility.toLowerCase().includes(indicator));
  }

  private makeResponsibilityActive(responsibility: string): string {
    const replacements: Record<string, string> = {
      'responsible for': 'Lead',
      'involved in': 'Contribute to',
      'participate in': 'Actively engage in'
    };

    let result = responsibility;
    Object.entries(replacements).forEach(([passive, active]) => {
      result = result.replace(new RegExp(passive, 'gi'), active);
    });

    return result;
  }

  private suggestPreferredRequirements(required: string[]): string[] {
    const commonPreferred = [
      'Experience with cloud platforms (AWS, Azure, GCP)',
      'Familiarity with agile development methodologies',
      'Strong communication and presentation skills',
      'Experience with data analysis and reporting'
    ];
    
    return commonPreferred.filter(pref => 
      !required.some(req => req.toLowerCase().includes(pref.toLowerCase()))
    );
  }

  private generateJDSkillsSuggestions(skills: JDData['skills']): DataSuggestion[] {
    const suggestions: DataSuggestion[] = [];

    if (!skills.tools || skills.tools.length === 0) {
      suggestions.push({
        id: 'add-tools',
        field: 'skills.tools',
        category: 'missing-field',
        suggestedValue: ['JIRA', 'Git', 'VS Code', 'Docker', 'Slack'],
        confidence: 80,
        source: 'industry-standard',
        reason: 'Specifying tools helps candidates understand the development environment',
        impact: 'medium'
      });
    }

    return suggestions;
  }

  private generateJDSummarySuggestions(jdData: Partial<JDData>): DataSuggestion[] {
    const suggestions: DataSuggestion[] = [];

    if (!jdData.aboutCompany) {
      suggestions.push({
        id: 'add-company-info',
        field: 'aboutCompany',
        category: 'missing-field',
        suggestedValue: 'We are a fast-growing technology company dedicated to innovation and excellence.',
        confidence: 75,
        source: 'best-practice',
        reason: 'Company information helps candidates evaluate cultural fit',
        impact: 'medium'
      });
    }

    return suggestions;
  }

  private generateJDContentQualitySuggestions(jdData: Partial<JDData>, validation: ValidationResult): DataSuggestion[] {
    const suggestions: DataSuggestion[] = [];

    // Suggest adding benefits if missing
    if (!jdData.benefits || jdData.benefits.length === 0) {
      suggestions.push({
        id: 'add-benefits',
        field: 'benefits',
        category: 'missing-field',
        suggestedValue: [
          'Health insurance (Medical, Dental, Vision)',
          'Flexible PTO and company holidays',
          '401(k) matching and stock options'
        ],
        confidence: 85,
        source: 'industry-standard',
        reason: 'Benefits information is crucial for candidate decision making',
        impact: 'medium'
      });
    }

    return suggestions;
  }

  private generateCandidateExperienceSuggestions(jdData: Partial<JDData>): DataSuggestion[] {
    const suggestions: DataSuggestion[] = [];

    // Suggest adding team size information
    if (!jdData.teamSize) {
      suggestions.push({
        id: 'add-team-size',
        field: 'teamSize',
        category: 'missing-field',
        suggestedValue: '5-10 people',
        confidence: 70,
        source: 'best-practice',
        reason: 'Team size helps candidates understand collaboration dynamics',
        impact: 'low'
      });
    }

    return suggestions;
  }
}

// Export singleton instance
export const smartSuggestionsEngine = new SmartSuggestionsEngine();

// Main functions
export async function generateSmartSuggestions(
  data: any, 
  type: 'cv' | 'jd', 
  validation: ValidationResult,
  missingData: MissingDataAnalysis
): Promise<DataSuggestion[]> {
  if (type === 'cv') {
    return smartSuggestionsEngine.generateCVSuggestions(data as Partial<CVData>, validation, missingData);
  } else {
    return smartSuggestionsEngine.generateJDSuggestions(data as Partial<JDData>, validation, missingData);
  }
}