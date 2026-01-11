# AI Interview Application

## Overview
AI-powered interview platform for job seekers practice and recruiter candidate evaluation.

## Target Users
### Job Seekers (B2C)
### Recruiters / Hiring Managers (B2B)

## Value Proposition
### Job Seekers: Practice interview to get more confident on real interview
### Recruiters: Fast evaluation, more correct step than manual screening CV

## Feature Extraction

### Job Seeker Features
- User authentication and profile management
- Document upload (CV, Job Description) with OCR processing
- Mock interview creation and configuration
- AI-powered question generation based on CV/JD matching
- Real-time interview session with video/audio recording
- AI feedback and scoring system
- Performance analytics and improvement recommendations
- Interview history and data storage

### HR Team Features
- Job description upload and OCR processing
- Job posting creation and management
- Interview configuration (question count, language, parameters)
- Public/private job posting controls
- Candidate application processing
- Automated interview scheduling and execution
- Background AI scoring and feedback generation
- Candidate database and management dashboard
- Pass/fail decision workflow
- Automated email communications

## Main Use Case Flows

### Job Seeker - Self Practice Interview Flow

```mermaid
flowchart TD
    A[Start: User Authentication] --> B[Choose Mock Interview Type]
    B --> C[Upload JD & CV]
    C --> D[OCR Processing]
    D --> E[Manual OCR Verification]
    E --> F{OCR Correct?}
    F -->|No| G[Correct OCR Data]
    G --> E
    F -->|Yes| H[Create Interview Session]
    H --> I[AI Agent Analyzes CV/JD]
    I --> J[Generate Category-Matched Questions]
    J --> K[Start Interview - Ask First Question]
    K --> L[User Provides Response]
    L --> M[AI Analyzes Response]
    M --> N[Provide Feedback & Scoring]
    N --> O{Response Clear?}
    O -->|No| P[Ask Follow-up Question]
    P --> L
    O -->|Yes| Q{More Questions?}
    Q -->|Yes| R[Ask Next Question]
    R --> L
    Q -->|No| S[Generate Final Scores]
    S --> T[Identify Improvement Points]
    T --> U[Save Interview Data]
    U --> V[Store: Video/Audio, AI Feedback, CV, JD]
    V --> W[End: Display Results to User]
```

### HR Team - Hiring Job Flow

```mermaid
flowchart TD
    A[Start: Upload Job Description] --> B[OCR Processing]
    B --> C[Manual OCR Verification]
    C --> D[Save Verified JD]
    D --> E[Configure AI Interview Section]
    E --> F[Set: Person Numbers, Question Count, Language]
    F --> G[Create Interview Post]
    G --> H[Set Post Status: Public/Private]
    H --> I[Set Post Schedule: Active/Upcoming/Expired]
    I --> J{Post Public & Not Expired?}
    J -->|Yes| K[Make Page Visible to All]
    J -->|No| L[Restrict Access]
    K --> M[Candidate Authentication Required]
    L --> M
    M --> N[Candidate Applies for Job]
    N --> O[Navigate to Configured Interview Section]
    O --> P[Start Interview Session]
    P --> Q[AI Conducts Interview]
    Q --> R[Background Scoring & Feedback]
    R --> S[Save Complete Interview Process]
    S --> T[Display in Candidate Data Table]
    T --> U[Interviewer Reviews Results]
    U --> V{Pass/Fail Decision}
    V -->|Pass| W[Send Pass Email]
    V -->|Fail| X[Send Fail Email]
    W --> Y[End: Candidate Processed]
    X --> Y
```

## Technical Requirements
- AI/ML for question generation and response analysis
- OCR for document processing
- Video/Audio recording and storage
- Secure user authentication and data protection

## Success Metrics
- Interview completion rates
- User satisfaction scores
- Time-to-hire reduction for recruiters
- Cost savings vs traditional interviews

## Future Enhancements
- Multi-language support
- ATS integration
- Advanced analytics dashboard
- Industry-specific question banks