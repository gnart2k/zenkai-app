import { 
  CVData, 
  JDData, 
  MissingDataAnalysis, 
  MissingField, 
  MissingFieldCategory,
  PriorityAction,
  ValidationResult
} from './analysis';

export class MissingDataDetector {
  
  // Analyze missing data for CV
  analyzeMissingCVData(cvData: Partial<CVData>, validation: ValidationResult): MissingDataAnalysis {
    const critical: MissingField[] = [];
    const recommended: MissingField[] = [];
    const optional: MissingField[] = [];
    const priorityActions: PriorityAction[] = [];

    // Personal Information Analysis
    const personalIssues = this.analyzePersonalInfo(cvData.personalInfo || {});
    critical.push(...personalIssues.critical);
    recommended.push(...personalIssues.recommended);
    optional.push(...personalIssues.optional);

    // Experience Analysis
    const experienceIssues = this.analyzeExperience(cvData.experience || []);
    critical.push(...experienceIssues.critical);
    recommended.push(...experienceIssues.recommended);
    optional.push(...experienceIssues.optional);

    // Education Analysis
    const educationIssues = this.analyzeEducation(cvData.education || []);
    critical.push(...educationIssues.critical);
    recommended.push(...educationIssues.recommended);
    optional.push(...educationIssues.optional);

    // Skills Analysis
    const skillsIssues = this.analyzeSkills(cvData.skills || {});
    critical.push(...skillsIssues.critical);
    recommended.push(...skillsIssues.recommended);
    optional.push(...skillsIssues.optional);

    // Summary Analysis
    const summaryIssues = this.analyzeSummary(cvData.summary);
    critical.push(...summaryIssues.critical);
    recommended.push(...summaryIssues.recommended);
    optional.push(...summaryIssues.optional);

    // Calculate overall score
    const totalFields = critical.length + recommended.length + optional.length;
    const missingCriticalWeight = critical.length * 10;
    const missingRecommendedWeight = recommended.length * 5;
    const missingOptionalWeight = optional.length * 1;
    
    const maxPossibleScore = 100;
    const deduction = missingCriticalWeight + missingRecommendedWeight + missingOptionalWeight;
    const overallScore = Math.max(0, maxPossibleScore - Math.min(deduction, 100));

    // Generate priority actions
    priorityActions.push(...this.generatePriorityActions(critical, recommended, cvData));

    return {
      critical,
      recommended,
      optional,
      overallScore: Math.round(overallScore),
      priorityActions
    };
  }

  // Analyze missing data for JD
  analyzeMissingJDData(jdData: Partial<JDData>, validation: ValidationResult): MissingDataAnalysis {
    const critical: MissingField[] = [];
    const recommended: MissingField[] = [];
    const optional: MissingField[] = [];
    const priorityActions: PriorityAction[] = [];

    // Job Information Analysis
    const jobInfoIssues = this.analyzeJobInfo(jdData);
    critical.push(...jobInfoIssues.critical);
    recommended.push(...jobInfoIssues.recommended);
    optional.push(...jobInfoIssues.optional);

    // Responsibilities Analysis
    const responsibilityIssues = this.analyzeResponsibilities(jdData.responsibilities || []);
    critical.push(...responsibilityIssues.critical);
    recommended.push(...responsibilityIssues.recommended);
    optional.push(...responsibilityIssues.optional);

    // Requirements Analysis
    const requirementIssues = this.analyzeRequirements(jdData.requirements || {});
    critical.push(...requirementIssues.critical);
    recommended.push(...requirementIssues.recommended);
    optional.push(...requirementIssues.optional);

    // Skills Analysis
    const skillsIssues = this.analyzeJDSkills(jdData.skills || {});
    critical.push(...skillsIssues.critical);
    recommended.push(...skillsIssues.recommended);
    optional.push(...skillsIssues.optional);

    // Summary Analysis
    const summaryIssues = this.analyzeJDSummary(jdData.summary);
    critical.push(...summaryIssues.critical);
    recommended.push(...summaryIssues.recommended);
    optional.push(...summaryIssues.optional);

    // Calculate overall score
    const totalFields = critical.length + recommended.length + optional.length;
    const missingCriticalWeight = critical.length * 10;
    const missingRecommendedWeight = recommended.length * 5;
    const missingOptionalWeight = optional.length * 1;
    
    const maxPossibleScore = 100;
    const deduction = missingCriticalWeight + missingRecommendedWeight + missingOptionalWeight;
    const overallScore = Math.max(0, maxPossibleScore - Math.min(deduction, 100));

    // Generate priority actions
    priorityActions.push(...this.generateJDPriorityActions(critical, recommended, jdData));

    return {
      critical,
      recommended,
      optional,
      overallScore: Math.round(overallScore),
      priorityActions
    };
  }

  // Personal Information Analysis for CV
  private analyzePersonalInfo(personalInfo: CVData['personalInfo']) {
    const critical: MissingField[] = [];
    const recommended: MissingField[] = [];
    const optional: MissingField[] = [];

    if (!personalInfo.name || personalInfo.name.trim().length === 0) {
      critical.push({
        id: 'missing-name',
        category: 'personal-info',
        field: 'name',
        importance: 'critical',
        reason: 'Your name is the most basic identifier on your CV',
        example: 'John Smith',
        templates: ['First Last', 'John Michael Smith'],
        estimatedTime: '1 minute',
        impactOnScore: 15
      });
    }

    if (!personalInfo.email) {
      critical.push({
        id: 'missing-email',
        category: 'contact-info',
        field: 'email',
        importance: 'critical',
        reason: 'Recruiters need your email to contact you',
        example: 'john.smith@email.com',
        templates: ['name@gmail.com', 'firstname.lastname@company.com'],
        estimatedTime: '1 minute',
        impactOnScore: 15
      });
    } else if (!this.isValidEmail(personalInfo.email)) {
      critical.push({
        id: 'invalid-email',
        category: 'contact-info',
        field: 'email',
        importance: 'critical',
        reason: 'Invalid email format may prevent recruiters from contacting you',
        example: 'john.smith@email.com',
        templates: ['name@gmail.com', 'firstname.lastname@company.com'],
        estimatedTime: '2 minutes',
        impactOnScore: 12
      });
    }

    if (!personalInfo.phone) {
      recommended.push({
        id: 'missing-phone',
        category: 'contact-info',
        field: 'phone',
        importance: 'recommended',
        reason: 'Phone number provides an additional way for recruiters to reach you',
        example: '+1 (555) 123-4567',
        templates: ['+1 (XXX) XXX-XXXX', '(XXX) XXX-XXXX'],
        estimatedTime: '1 minute',
        impactOnScore: 8
      });
    }

    if (!personalInfo.location) {
      recommended.push({
        id: 'missing-location',
        category: 'personal-info',
        field: 'location',
        importance: 'recommended',
        reason: 'Location helps employers understand if you\'re a good fit for their office/remote positions',
        example: 'San Francisco, CA',
        templates: ['City, State', 'City, Country'],
        estimatedTime: '1 minute',
        impactOnScore: 5
      });
    }

    if (!personalInfo.linkedin) {
      optional.push({
        id: 'missing-linkedin',
        category: 'personal-info',
        field: 'linkedin',
        importance: 'optional',
        reason: 'LinkedIn profile provides more professional context and networking opportunities',
        example: 'linkedin.com/in/johnsmith',
        templates: ['linkedin.com/in/yourname'],
        estimatedTime: '2 minutes',
        impactOnScore: 3
      });
    }

    if (!personalInfo.github && this.isLikelyTechRole()) {
      optional.push({
        id: 'missing-github',
        category: 'personal-info',
        field: 'github',
        importance: 'optional',
        reason: 'GitHub showcases your coding skills and project contributions',
        example: 'github.com/johnsmith',
        templates: ['github.com/yourusername'],
        estimatedTime: '2 minutes',
        impactOnScore: 4
      });
    }

    return { critical, recommended, optional };
  }

  // Experience Analysis for CV
  private analyzeExperience(experience: any[]) {
    const critical: MissingField[] = [];
    const recommended: MissingField[] = [];
    const optional: MissingField[] = [];

    if (experience.length === 0) {
      critical.push({
        id: 'no-experience',
        category: 'experience',
        field: 'experience',
        importance: 'critical',
        reason: 'Work experience is essential for most professional roles',
        example: 'Software Engineer at Tech Corp (2020-Present)',
        templates: [
          'Job Title at Company (Start Year - End Year)',
          'Role at Organization (Month Year - Present)'
        ],
        estimatedTime: '10 minutes per entry',
        impactOnScore: 20
      });
    } else {
      experience.forEach((exp, index) => {
        if (!exp.title) {
          critical.push({
            id: `missing-title-${index}`,
            category: 'experience',
            field: `experience[${index}].title`,
            importance: 'critical',
            reason: 'Job title is essential for understanding your role',
            example: 'Senior Software Engineer',
            templates: ['Software Engineer', 'Product Manager', 'Data Analyst'],
            estimatedTime: '2 minutes',
            impactOnScore: 8
          });
        }

        if (!exp.company) {
          critical.push({
            id: `missing-company-${index}`,
            category: 'experience',
            field: `experience[${index}].company`,
            importance: 'critical',
            reason: 'Company name provides context for your experience',
            example: 'Tech Corporation',
            templates: ['Company Name', 'Organization Name'],
            estimatedTime: '2 minutes',
            impactOnScore: 8
          });
        }

        if (!exp.duration && !exp.startDate) {
          critical.push({
            id: `missing-dates-${index}`,
            category: 'experience',
            field: `experience[${index}].duration`,
            importance: 'critical',
            reason: 'Employment dates show your career progression',
            example: '2020 - Present',
            templates: ['Start Year - End Year', 'Start Year - Present'],
            estimatedTime: '2 minutes',
            impactOnScore: 6
          });
        }

        if (!exp.description || exp.description.length < 20) {
          recommended.push({
            id: `missing-description-${index}`,
            category: 'experience',
            field: `experience[${index}].description`,
            importance: 'recommended',
            reason: 'Detailed descriptions help recruiters understand your responsibilities and achievements',
            example: 'Developed and maintained web applications using React and Node.js, resulting in 30% improved performance.',
            templates: [
              'Developed [technology] to achieve [result]',
              'Managed [project] leading to [outcome]',
              'Improved [process] by [metric]'
            ],
            estimatedTime: '5 minutes',
            impactOnScore: 5
          });
        }
      });
    }

    return { critical, recommended, optional };
  }

  // Education Analysis for CV
  private analyzeEducation(education: any[]) {
    const critical: MissingField[] = [];
    const recommended: MissingField[] = [];
    const optional: MissingField[] = [];

    if (education.length === 0) {
      recommended.push({
        id: 'no-education',
        category: 'education',
        field: 'education',
        importance: 'recommended',
        reason: 'Educational background is important for many roles',
        example: 'Bachelor of Science in Computer Science from University of Technology (2020)',
        templates: [
          'Degree in Field from University (Year)',
          'Certificate in Subject from Institution (Year)'
        ],
        estimatedTime: '5 minutes',
        impactOnScore: 10
      });
    } else {
      education.forEach((edu, index) => {
        if (!edu.degree) {
          recommended.push({
            id: `missing-degree-${index}`,
            category: 'education',
            field: `education[${index}].degree`,
            importance: 'recommended',
            reason: 'Degree shows your educational qualifications',
            example: 'Bachelor of Science in Computer Science',
            templates: [
              'Bachelor of Science in Field',
              'Master of Arts in Subject',
              'Certificate in Specialization'
            ],
            estimatedTime: '2 minutes',
            impactOnScore: 5
          });
        }

        if (!edu.institution) {
          recommended.push({
            id: `missing-institution-${index}`,
            category: 'education',
            field: `education[${index}].institution`,
            importance: 'recommended',
            reason: 'Institution name provides credibility to your education',
            example: 'University of Technology',
            templates: ['University Name', 'College Name', 'Institution Name'],
            estimatedTime: '2 minutes',
            impactOnScore: 5
          });
        }
      });
    }

    return { critical, recommended, optional };
  }

  // Skills Analysis for CV
  private analyzeSkills(skills: CVData['skills']) {
    const critical: MissingField[] = [];
    const recommended: MissingField[] = [];
    const optional: MissingField[] = [];

    const hasTechnicalSkills = skills.technical && skills.technical.length > 0;
    const hasSoftSkills = skills.soft && skills.soft.length > 0;
    const hasAnySkills = hasTechnicalSkills || hasSoftSkills;

    if (!hasAnySkills) {
      critical.push({
        id: 'no-skills',
        category: 'skills',
        field: 'skills',
        importance: 'critical',
        reason: 'Skills section is crucial for ATS systems and quick recruiter scanning',
        example: 'JavaScript, React, Node.js, Communication, Leadership',
        templates: [
          'Technical: JavaScript, Python, React, Node.js, AWS',
          'Soft: Communication, Leadership, Problem-solving, Teamwork'
        ],
        estimatedTime: '10 minutes',
        impactOnScore: 15
      });
    }

    if (!hasTechnicalSkills) {
      critical.push({
        id: 'no-technical-skills',
        category: 'skills',
        field: 'skills.technical',
        importance: 'critical',
        reason: 'Technical skills are essential for most roles and ATS scanning',
        example: 'JavaScript, Python, React, Node.js, Git, Docker',
        templates: [
          'Programming: JavaScript, Python, Java',
          'Web Technologies: React, Angular, Node.js',
          'Tools: Git, Docker, Jenkins, AWS'
        ],
        estimatedTime: '8 minutes',
        impactOnScore: 10
      });
    }

    if (!hasSoftSkills) {
      recommended.push({
        id: 'no-soft-skills',
        category: 'skills',
        field: 'skills.soft',
        importance: 'recommended',
        reason: 'Soft skills demonstrate your ability to work effectively with others',
        example: 'Communication, Leadership, Problem-solving, Teamwork',
        templates: [
          'Communication: Written, Verbal, Presentation',
          'Leadership: Team Management, Project Leadership',
          'Problem-solving: Analytical, Creative, Strategic'
        ],
        estimatedTime: '5 minutes',
        impactOnScore: 6
      });
    }

    if (hasTechnicalSkills && skills.technical!.length < 5) {
      recommended.push({
        id: 'few-technical-skills',
        category: 'skills',
        field: 'skills.technical',
        importance: 'recommended',
        reason: 'More technical skills increase your chances of matching job requirements',
        example: 'Add 2-3 more relevant technologies',
        templates: [
          'Consider adding: Testing frameworks, CI/CD tools, Cloud platforms',
          'Include: Version control, Database technologies, API skills'
        ],
        estimatedTime: '5 minutes',
        impactOnScore: 4
      });
    }

    return { critical, recommended, optional };
  }

  // Summary Analysis for CV
  private analyzeSummary(summary?: string) {
    const critical: MissingField[] = [];
    const recommended: MissingField[] = [];
    const optional: MissingField[] = [];

    if (!summary) {
      recommended.push({
        id: 'missing-summary',
        category: 'summary',
        field: 'summary',
        importance: 'recommended',
        reason: 'A summary helps recruiters quickly understand your background and goals',
        example: 'Experienced Software Engineer with 5+ years in full-stack development, passionate about creating scalable web applications and leading cross-functional teams.',
        templates: [
          'Professional with [X] years of experience in [field], specializing in [skills]',
          'Results-driven [role] with expertise in [technologies] and [achievements]',
          'Dedicated [professional] focused on [goals] with proven track record in [accomplishments]'
        ],
        estimatedTime: '8 minutes',
        impactOnScore: 7
      });
    } else if (summary.length < 30) {
      recommended.push({
        id: 'short-summary',
        category: 'summary',
        field: 'summary',
        importance: 'recommended',
        reason: 'Summary should be 2-4 sentences to provide meaningful context',
        example: 'Expand your summary to include years of experience, key skills, and career goals',
        templates: [
          'Add your years of experience and key technical skills',
          'Include 1-2 major achievements or career highlights',
          'Mention your industry specialization or expertise area'
        ],
        estimatedTime: '5 minutes',
        impactOnScore: 4
      });
    }

    return { critical, recommended, optional };
  }

  // Job Info Analysis for JD
  private analyzeJobInfo(jdData: Partial<JDData>) {
    const critical: MissingField[] = [];
    const recommended: MissingField[] = [];
    const optional: MissingField[] = [];

    if (!jdData.jobTitle) {
      critical.push({
        id: 'missing-job-title',
        category: 'personal-info',
        field: 'jobTitle',
        importance: 'critical',
        reason: 'Job title is essential for candidates to understand the role',
        example: 'Senior Software Engineer',
        templates: [
          'Senior/Lead [Role]',
          '[Role] Engineer/Developer',
          '[Position] Manager/Coordinator'
        ],
        estimatedTime: '2 minutes',
        impactOnScore: 15
      });
    }

    if (!jdData.company) {
      recommended.push({
        id: 'missing-company',
        category: 'personal-info',
        field: 'company',
        importance: 'recommended',
        reason: 'Company name helps candidates evaluate the opportunity',
        example: 'Tech Corporation',
        templates: ['Company Name', 'Organization Name'],
        estimatedTime: '1 minute',
        impactOnScore: 8
      });
    }

    if (!jdData.location) {
      recommended.push({
        id: 'missing-location',
        category: 'personal-info',
        field: 'location',
        importance: 'recommended',
        reason: 'Location helps candidates determine commute/relocation feasibility',
        example: 'San Francisco, CA (Remote/Hybrid)',
        templates: [
          'City, State (Remote/On-site/Hybrid)',
          'Remote - [Time Zone]',
          'Multiple Locations Available'
        ],
        estimatedTime: '2 minutes',
        impactOnScore: 6
      });
    }

    if (!jdData.employmentType) {
      optional.push({
        id: 'missing-employment-type',
        category: 'personal-info',
        field: 'employmentType',
        importance: 'optional',
        reason: 'Employment type helps candidates understand job expectations',
        example: 'Full-time',
        templates: ['Full-time', 'Part-time', 'Contract', 'Freelance'],
        estimatedTime: '1 minute',
        impactOnScore: 3
      });
    }

    return { critical, recommended, optional };
  }

  // Responsibilities Analysis for JD
  private analyzeResponsibilities(responsibilities: string[]) {
    const critical: MissingField[] = [];
    const recommended: MissingField[] = [];
    const optional: MissingField[] = [];

    if (responsibilities.length === 0) {
      critical.push({
        id: 'no-responsibilities',
        category: 'experience',
        field: 'responsibilities',
        importance: 'critical',
        reason: 'Responsibilities help candidates understand what they\'ll be doing day-to-day',
        example: '- Develop and maintain web applications\n- Collaborate with cross-functional teams\n- Code review and mentorship',
        templates: [
          '- [Action verb] [task/deliverable] to achieve [result]',
          '- Manage/Oversee [process/system] ensuring [outcome]',
          '- Design/Implement [solution/feature] for [purpose]'
        ],
        estimatedTime: '10 minutes',
        impactOnScore: 20
      });
    } else if (responsibilities.length < 3) {
      recommended.push({
        id: 'few-responsibilities',
        category: 'experience',
        field: 'responsibilities',
        importance: 'recommended',
        reason: 'Aim for 3-7 responsibilities to give candidates a complete picture',
        example: 'Add 2-4 more key responsibilities covering different aspects of the role',
        templates: [
          'Include team collaboration responsibilities',
          'Add technical development tasks',
          'Consider including client/stakeholder interaction'
        ],
        estimatedTime: '8 minutes',
        impactOnScore: 8
      });
    }

    return { critical, recommended, optional };
  }

  // Requirements Analysis for JD
  private analyzeRequirements(requirements: JDData['requirements']) {
    const critical: MissingField[] = [];
    const recommended: MissingField[] = [];
    const optional: MissingField[] = [];

    const hasRequired = requirements.required && requirements.required.length > 0;
    const hasPreferred = requirements.preferred && requirements.preferred.length > 0;

    if (!hasRequired && !hasPreferred) {
      critical.push({
        id: 'no-requirements',
        category: 'education',
        field: 'requirements',
        importance: 'critical',
        reason: 'Requirements help candidates understand if they\'re qualified for the role',
        example: 'Required: 3+ years experience with React, Bachelor\'s degree in CS\nPreferred: AWS experience, TypeScript',
        templates: [
          'Required: [must-have qualifications], [essential skills]',
          'Preferred: [nice-to-have skills], [bonus experience]',
          'Education: [degree level] in [relevant field]'
        ],
        estimatedTime: '12 minutes',
        impactOnScore: 15
      });
    }

    if (!hasRequired) {
      critical.push({
        id: 'no-required-requirements',
        category: 'education',
        field: 'requirements.required',
        importance: 'critical',
        reason: 'Required qualifications help filter candidates effectively',
        example: '3+ years of software development experience, Bachelor\'s degree in Computer Science',
        templates: [
          '[Number]+ years of [skill/experience]',
          'Degree in [field] or related field',
          'Experience with [specific technologies/tools]'
        ],
        estimatedTime: '8 minutes',
        impactOnScore: 10
      });
    }

    if (!hasPreferred) {
      recommended.push({
        id: 'no-preferred-requirements',
        category: 'education',
        field: 'requirements.preferred',
        importance: 'recommended',
        reason: 'Preferred qualifications help candidates stand out and show growth potential',
        example: 'AWS experience, TypeScript, Mentoring experience',
        templates: [
          'Experience with [advanced technologies]',
          '[Certification] or similar qualification',
          '[Industry] knowledge or background'
        ],
        estimatedTime: '5 minutes',
        impactOnScore: 5
      });
    }

    return { critical, recommended, optional };
  }

  // JD Skills Analysis
  private analyzeJDSkills(skills: JDData['skills']) {
    const critical: MissingField[] = [];
    const recommended: MissingField[] = [];
    const optional: MissingField[] = [];

    const hasTechnicalSkills = skills.technical && skills.technical.length > 0;

    if (!hasTechnicalSkills) {
      recommended.push({
        id: 'no-technical-skills-jd',
        category: 'skills',
        field: 'skills',
        importance: 'recommended',
        reason: 'Technical skills help candidates understand the technology requirements',
        example: 'JavaScript, React, Node.js, Python, AWS, Docker',
        templates: [
          'Frontend: [frameworks/libraries]',
          'Backend: [languages/frameworks]',
          'Infrastructure: [cloud/devops tools]'
        ],
        estimatedTime: '8 minutes',
        impactOnScore: 8
      });
    }

    return { critical, recommended, optional };
  }

  // JD Summary Analysis
  private analyzeJDSummary(summary?: string) {
    const critical: MissingField[] = [];
    const recommended: MissingField[] = [];
    const optional: MissingField[] = [];

    if (!summary) {
      recommended.push({
        id: 'missing-job-summary',
        category: 'summary',
        field: 'summary',
        importance: 'recommended',
        reason: 'Job summary provides context about the role and company culture',
        example: 'We are seeking a talented Software Engineer to join our innovative team, working on cutting-edge web applications that serve millions of users globally.',
        templates: [
          'We are looking for a [role] to join our [team type] team',
          '[Company] is seeking a [role] to help [achieve goal]',
          'Join our [adjective] team as a [role] and [contribute to]'
        ],
        estimatedTime: '10 minutes',
        impactOnScore: 7
      });
    }

    return { critical, recommended, optional };
  }

  // Priority Actions Generation
  private generatePriorityActions(
    critical: MissingField[], 
    recommended: MissingField[], 
    cvData: Partial<CVData>
  ): PriorityAction[] {
    const actions: PriorityAction[] = [];

    // Most critical action first
    if (critical.length > 0) {
      actions.push({
        id: 'fix-critical-missing-data',
        title: `Add ${critical.length} Critical Missing Fields`,
        description: 'Complete essential information that recruiters expect to see immediately',
        estimatedTime: `${critical.length * 3} minutes`,
        impactScore: 15,
        difficulty: 'easy'
      });
    }

    // Experience gaps
    if (!cvData.experience || cvData.experience.length === 0) {
      actions.push({
        id: 'add-work-experience',
        title: 'Add Work Experience',
        description: 'Include at least one work experience entry with role, company, and dates',
        estimatedTime: '15 minutes',
        impactScore: 20,
        difficulty: 'medium'
      });
    }

    // Skills enhancement
    if (!cvData.skills?.technical || cvData.skills.technical.length < 5) {
      actions.push({
        id: 'enhance-technical-skills',
        title: 'Add More Technical Skills',
        description: 'List at least 5-8 relevant technical skills for better ATS matching',
        estimatedTime: '10 minutes',
        impactScore: 10,
        difficulty: 'easy'
      });
    }

    // Summary addition
    if (!cvData.summary) {
      actions.push({
        id: 'add-professional-summary',
        title: 'Write Professional Summary',
        description: 'Add a compelling 2-3 sentence summary to grab recruiter attention',
        estimatedTime: '12 minutes',
        impactScore: 8,
        difficulty: 'medium'
      });
    }

    return actions.slice(0, 5); // Top 5 priority actions
  }

  private generateJDPriorityActions(
    critical: MissingField[], 
    recommended: MissingField[], 
    jdData: Partial<JDData>
  ): PriorityAction[] {
    const actions: PriorityAction[] = [];

    // Most critical action first
    if (critical.length > 0) {
      actions.push({
        id: 'fix-critical-jd-data',
        title: `Add ${critical.length} Critical Job Details`,
        description: 'Complete essential information that candidates need to apply confidently',
        estimatedTime: `${critical.length * 2} minutes`,
        impactScore: 15,
        difficulty: 'easy'
      });
    }

    // Responsibilities
    if (!jdData.responsibilities || jdData.responsibilities.length < 3) {
      actions.push({
        id: 'add-responsibilities',
        title: 'Add Key Responsibilities',
        description: 'Include 3-7 clear responsibilities to help candidates understand the role',
        estimatedTime: '15 minutes',
        impactScore: 20,
        difficulty: 'medium'
      });
    }

    // Requirements
    if (!jdData.requirements?.required || jdData.requirements.required.length === 0) {
      actions.push({
        id: 'add-required-qualifications',
        title: 'Define Required Qualifications',
        description: 'List essential skills, experience, and education requirements',
        estimatedTime: '12 minutes',
        impactScore: 15,
        difficulty: 'medium'
      });
    }

    // Skills section
    if (!jdData.skills?.technical || jdData.skills.technical.length === 0) {
      actions.push({
        id: 'add-technical-skills',
        title: 'List Technical Requirements',
        description: 'Specify key technologies, tools, and frameworks required for the role',
        estimatedTime: '8 minutes',
        impactScore: 10,
        difficulty: 'easy'
      });
    }

    // Job summary
    if (!jdData.summary) {
      actions.push({
        id: 'add-job-summary',
        title: 'Write Job Summary',
        description: 'Add a compelling summary about the role and company culture',
        estimatedTime: '10 minutes',
        impactScore: 8,
        difficulty: 'medium'
      });
    }

    return actions.slice(0, 5); // Top 5 priority actions
  }

  // Helper Methods
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    return emailRegex.test(email);
  }

  private isLikelyTechRole(): boolean {
    // This is a simplified heuristic - in practice, you might analyze
    // the actual CV content or user role to determine this
    return true;
  }
}

// Export singleton instance
export const missingDataDetector = new MissingDataDetector();

// Main functions
export async function analyzeMissingData(
  data: any, 
  type: 'cv' | 'jd', 
  validation: ValidationResult
): Promise<MissingDataAnalysis> {
  if (type === 'cv') {
    return missingDataDetector.analyzeMissingCVData(data as Partial<CVData>, validation);
  } else {
    return missingDataDetector.analyzeMissingJDData(data as Partial<JDData>, validation);
  }
}