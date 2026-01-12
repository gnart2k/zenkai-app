import type { DocumentType, PersonalInfo, ExperienceEntry, EducationEntry, SkillEntry } from './types';

export function detectDocumentType(text: string): 'resume' | 'job-description' | 'unknown' {
  if (!text || typeof text !== 'string') {
    return 'unknown';
  }

  const lowerText = text.toLowerCase();  
  const resumeIndicators = [
    'experience', 'education', 'skills', 'summary', 
    'work history', 'employment', 'qualifications',
    'career objective', 'professional summary', 'work experience',
    'academic background', 'technical skills', 'certifications'
  ];
  
  const jobDescIndicators = [
    'requirements', 'responsibilities', 'qualifications',
    'job description', 'position', 'role', 'company',
    'job duties', 'key responsibilities', 'mandatory requirements',
    'preferred qualifications', 'what you\'ll do', 'what we\'re looking for'
  ];

  // Count occurrences of indicators
  const resumeScore = resumeIndicators.filter(word => 
    lowerText.includes(word)
  ).length;
  
  const jobDescScore = jobDescIndicators.filter(word => 
    lowerText.includes(word)
  ).length;
  
  // Calculate confidence scores
  const resumeConfidence = resumeScore / resumeIndicators.length;
  const jobDescConfidence = jobDescScore / jobDescIndicators.length;
  
  // Additional heuristics
  const hasContactInfo = extractEmails(text).length > 0 || extractPhones(text).length > 0;
  const hasDates = /\b(19|20)\d{2}\b/g.test(text); // Years like 2020, 2021
  const hasBullets = /^\s*[-*•]\s*/m.test(text);
  
  // Weight the scores
  let finalResumeScore = resumeConfidence;
  let finalJobDescScore = jobDescConfidence;
  
  if (hasContactInfo && hasDates) {
    finalResumeScore += 0.3; // More likely resume
  }
  
  if (hasBullets && jobDescConfidence > 0.3) {
    finalJobDescScore += 0.2; // Job descriptions often use bullets
  }
  
  if (lowerText.includes('apply now') || lowerText.includes('equal opportunity employer')) {
    finalJobDescScore += 0.4; // Clear job description indicators
  }
  
  if (finalResumeScore > finalJobDescScore) return 'resume';
  if (finalJobDescScore > finalResumeScore) return 'job-description';
  return 'unknown';
}

export function extractEmails(text: string): string[] {
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const matches = text.match(emailPattern);
  return matches ? [...new Set(matches)] : []; // Remove duplicates
}

export function extractPhones(text: string): string[] {
  const phonePatterns = [
    /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
    /\b([0-9]{3})[-.\s]([0-9]{3})[-.\s]([0-9]{4})\b/g,
  ];
  
  const allMatches: string[] = [];
  phonePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      allMatches.push(...matches.slice(1));
    }
  });
  
  return [...new Set(allMatches)]; // Remove duplicates
}

export function extractUrls(text: string): string[] {
  const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const matches = text.match(urlPattern);
  return matches ? [...new Set(matches)] : [];
}

export function extractSkills(text: string): SkillEntry[] {
  const skills: SkillEntry[] = [];
  const lowerText = text.toLowerCase();
  
  // Technical skills
  const technicalSkills = [
    'javascript', 'typescript', 'python', 'java', 'react', 'node.js', 'nodejs',
    'angular', 'vue.js', 'html', 'css', 'sql', 'mongodb', 'postgresql',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'github',
    'ci/cd', 'devops', 'linux', 'ubuntu', 'windows', 'macos',
    'rest api', 'graphql', 'microservices', 'agile', 'scrum'
  ];
  
  // Soft skills
  const softSkills = [
    'leadership', 'communication', 'teamwork', 'problem solving',
    'critical thinking', 'project management', 'time management',
    'collaboration', 'adaptability', 'creativity', 'analytical'
  ];
  
  // Languages
  const languages = [
    'english', 'spanish', 'french', 'german', 'chinese', 'japanese',
    'korean', 'vietnamese', 'mandarin', 'cantonese'
  ];
  
  // Extract and categorize skills
  technicalSkills.forEach(skill => {
    if (lowerText.includes(skill)) {
      skills.push({ name: skill, category: 'technical' });
    }
  });
  
  softSkills.forEach(skill => {
    if (lowerText.includes(skill)) {
      skills.push({ name: skill, category: 'soft' });
    }
  });
  
  languages.forEach(skill => {
    if (lowerText.includes(skill)) {
      skills.push({ name: skill, category: 'language' });
    }
  });
  
  // Remove duplicates and sort
  const uniqueSkills = skills.filter((skill, index, self) =>
    index === self.findIndex((s) => s.name.toLowerCase() === skill.name.toLowerCase())
  );
  
  return uniqueSkills.sort((a, b) => a.name.localeCompare(b.name));
}

export function extractYears(text: string): string[] {
  const yearPattern = /\b(19|20)\d{2}\b/g;
  const matches = text.match(yearPattern);
  return matches ? [...new Set(matches)] : [];
}

export function extractCompanies(text: string): string[] {
  // This is a simplified extraction - in production, you'd want a more sophisticated approach
  const companyPatterns = [
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+Inc\.?|Corporation|Corp\.?|LLC|Ltd\.?)?)/g,
    /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Technologies?|Solutions?|Systems?|Services?|Labs)\b/g,
  ];
  
  const allMatches: string[] = [];
  companyPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      allMatches.push(...matches);
    }
  });
  
  return [...new Set(allMatches)];
}

export function extractPersonalInfo(text: string): PersonalInfo {
  const emails = extractEmails(text);
  const phones = extractPhones(text);
  const urls = extractUrls(text);
  
  // Simple name extraction - look for patterns like "John Doe" at the beginning
  const nameLines = text.split('\n').slice(0, 3); // Check first 3 lines
  const namePattern = /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/;
  let name = '';
  
  for (const line of nameLines) {
    const cleanLine = line.trim();
    if (namePattern.test(cleanLine) && cleanLine.split(' ').length <= 4) {
      name = cleanLine;
      break;
    }
  }
  
  // Extract location
  const locationPatterns = [
    /,\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2})\s*\d{5}/, // City, State ZIP
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*[A-Z]{2}\b/, // City, State
  ];
  
  let location = '';
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      location = match[1];
      break;
    }
  }
  
  // Check for LinkedIn/GitHub URLs specifically
  const linkedinMatch = urls.find(url => url.includes('linkedin.com'));
  const githubMatch = urls.find(url => url.includes('github.com'));
  
  return {
    name: name || undefined,
    email: emails[0] || undefined,
    phone: phones[0] || undefined,
    location: location || undefined,
    linkedin: linkedinMatch || undefined,
    github: githubMatch || undefined,
  };
}

export function extractExperience(text: string): ExperienceEntry[] {
  const experiences: ExperienceEntry[] = [];
  const lines = text.split('\n');
  
  let currentExperience: Partial<ExperienceEntry> = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();
    
    // Look for date patterns
    const dateMatch = line.match(/(\d{4}|\d{2}\/\d{2})\s*[-–—]\s*(\d{4}|present|current)/i);
    if (dateMatch) {
      if (Object.keys(currentExperience).length > 0) {
        experiences.push(currentExperience as ExperienceEntry);
      }
      
      currentExperience = {
        startDate: dateMatch[1],
        endDate: dateMatch[2] === 'present' || dateMatch[2] === 'current' ? 'Present' : dateMatch[2],
      };
      continue;
    }
    
    // Look for company/title patterns (lines with strong indicators)
    if (line.length > 10 && (
      lowerLine.includes('engineer') || lowerLine.includes('developer') || 
      lowerLine.includes('manager') || lowerLine.includes('analyst') ||
      lowerLine.includes('designer') || lowerLine.includes('consultant')
    )) {
      if (!currentExperience.title) {
        currentExperience.title = line;
      } else if (!currentExperience.company) {
        currentExperience.company = line;
      }
    }
  }
  
  // Add the last experience if it exists
  if (Object.keys(currentExperience).length > 0) {
    experiences.push(currentExperience as ExperienceEntry);
  }
  
  return experiences;
}

export function extractEducation(text: string): EducationEntry[] {
  const education: EducationEntry[] = [];
  const lines = text.split('\n');
  
  let currentEducation: Partial<EducationEntry> = {};
  
  for (const line of lines) {
    const trimLine = line.trim();
    const lowerLine = trimLine.toLowerCase();
    
    // Look for degree indicators
    if (lowerLine.includes('bachelor') || lowerLine.includes('master') || 
        lowerLine.includes('phd') || lowerLine.includes('associate') ||
        lowerLine.includes('diploma') || lowerLine.includes('certificate')) {
      
      if (Object.keys(currentEducation).length > 0) {
        education.push(currentEducation as EducationEntry);
      }
      
      currentEducation = { degree: trimLine };
      continue;
    }
    
    // Look for university/institution names (simplified)
    if (trimLine.length > 10 && (
      lowerLine.includes('university') || lowerLine.includes('college') ||
      lowerLine.includes('institution') || lowerLine.includes('academy')
    )) {
      currentEducation.institution = trimLine;
    }
    
    // Look for GPA
    const gpaMatch = trimLine.match(/gpa[:\s]*([0-4]\.?\d*)/i);
    if (gpaMatch) {
      currentEducation.gpa = gpaMatch[1];
    }
    
    // Look for year
    const yearMatch = trimLine.match(/\b(19|20)\d{2}\b/);
    if (yearMatch && !currentEducation.year) {
      currentEducation.year = yearMatch[0];
    }
  }
  
  // Add the last education if it exists
  if (Object.keys(currentEducation).length > 0) {
    education.push(currentEducation as EducationEntry);
  }
  
  return education;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

export function calculateTextStats(text: string): { characters: number; words: number; lines: number; sentences: number } {
  if (!text) return { characters: 0, words: 0, lines: 0, sentences: 0 };
  
  const characters = text.length;
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const lines = text.split('\n').length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  
  return { characters, words, lines, sentences };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}