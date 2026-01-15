// Main type exports and compatibility
// This file re-exports all types for backward compatibility

// Re-export all domain types
export type { PersonalInfo, ContactInfo, ReferenceEntry } from './personal';
export type { ExperienceEntry, VolunteerEntry, EmploymentType, ExperienceLevel, RemoteOption } from './experience';
export type { EducationEntry, EducationRequirement, ExperienceRequirement, EducationLevel, ExperienceLevel as ExpLevel, LanguageEntry, LanguageProficiency } from './education';
export type { SkillsData, CertificationEntry, BenefitCategory, BenefitEntry } from './skills';
export type { ProjectEntry, AwardEntry, PublicationEntry } from './projects';
export type { JDData, JDRequirements, SalaryRange } from './job-description';
export type { CVData } from './cv';
export type { ValidationResult, ValidationIssue, DataSuggestion, CompletenessScore, QualityScore, ValidationCategory, SuggestionCategory, SuggestionSource } from './validation';
export type { ProcessingPipeline, ProcessingStage, ProcessingError } from './processing';
export type { MissingDataAnalysis, MissingField, PriorityAction, MissingFieldCategory } from './missing-data';
export type { DocumentCompatibility, SkillMatch, ExperienceMatch, EducationMatch, CompatibilityRecommendation } from './compatibility';

// Legacy exports for existing code compatibility
export interface CVDataLegacy extends CVData {}
export interface JDDataLegacy extends JDData {}