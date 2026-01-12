# OCR Service Integration Plan for Zenkai

## 🎯 Objective
Integrate OCR services to extract text from documents (resumes, job descriptions) **without touching main interview flow**. Focus on implementing common services and UI components for document processing.

## 📋 Current Setup Analysis

### Existing Architecture
- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based with HTTP-only cookies
- **File Handling**: Using formidable for form parsing
- **Interview System**: Video recording + transcription + AI feedback
- **OCR Service**: External service at `http://localhost:8000/extract-text`

### Integration Scope
- **✅ Implement**: OCR services, file upload, text extraction, document analysis
- **❌ Don't Touch**: Main interview flow, existing transcription, feedback generation
- **🎯 Focus**: Standalone OCR functionality with test page

### Current OCR Test Script
```bash
# Test script available at docs/ocr-test.sh
OCR_SERVICE_URL="http://localhost:8000/extract-text"
PDF_FILE="Trang_Duong_Resume.pdf"

curl -X POST \
    -F "file=@$PDF_FILE" \
    -F "extract_text=true" \
    -F "extract_tables=true" \
    -F "extract_images=true" \
    "$OCR_SERVICE_URL"
```

## 🛠️ Technical Implementation Strategy

### 1. Server Actions Approach
Following Zenkai's existing patterns, we'll use Server Actions for OCR functionality:

### 2. File Structure Plan

```
lib/
├── ocr/
│   ├── actions.ts              # Server actions for OCR
│   ├── types.ts                # OCR type definitions
│   ├── utils.ts                # OCR utility functions
│   └── validation.ts           # File validation
│
components/
├── ocr/
│   ├── DocumentUpload.tsx      # File upload component
│   ├── ExtractedText.tsx       # Extracted text display
│   └── DocumentAnalysis.tsx    # Document analysis results
│
app/
├── (dashboard)/
│   └── ocr-test/              # OCR test page
│       └── page.tsx           # Standalone OCR testing interface
```

## 📋 Implementation Backlog

### Core OCR Infrastructure
- [ ] **Set up OCR server actions** (`lib/ocr/actions.ts`)
- [ ] **Create OCR type definitions** (`lib/ocr/types.ts`) 
- [ ] **Create OCR utility functions** (`lib/ocr/utils.ts`)
- [ ] **Add file validation utilities** (`lib/ocr/validation.ts`)

### UI Components
- [ ] **Implement document upload component** (`components/ocr/DocumentUpload.tsx`)
- [ ] **Create extracted text display component** (`components/ocr/ExtractedText.tsx`)

### Test Page
- [ ] **Create OCR test page** (`app/(dashboard)/ocr-test/page.tsx`)

### Configuration
- [ ] **Add environment variables for OCR service configuration**

## 🚀 Core Implementation Details

### Type Definitions
```typescript
// lib/ocr/types.ts
export interface OCRRequest {
  file: File;
  extractText: boolean;
  extractTables: boolean;
  extractImages: boolean;
}

export interface OCRResult {
  text: string;
  tables?: TableData[];
  images?: ImageData[];
  metadata: {
    fileName: string;
    fileSize: number;
    processingTime: number;
    extractedAt: Date;
  };
}

export interface DocumentAnalysis {
  type: 'resume' | 'job-description' | 'unknown';
  extractedData: {
    personalInfo?: PersonalInfo;
    experience?: ExperienceEntry[];
    education?: EducationEntry[];
    skills?: string[];
    requirements?: string[];
    responsibilities?: string[];
  };
  confidence: number;
}

export interface PersonalInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export interface ExperienceEntry {
  title?: string;
  company?: string;
  duration?: string;
  description?: string;
}

export interface EducationEntry {
  degree?: string;
  institution?: string;
  year?: string;
  gpa?: string;
}
```

### Server Actions Implementation
```typescript
// lib/ocr/actions.ts
'use server';

import { z } from 'zod';

export async function extractDocumentText(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    
    if (!file) {
      return { error: 'No file provided' };
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return { error: 'Invalid file type. Only PDF and images are allowed.' };
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { error: 'File size too large. Maximum size is 10MB.' };
    }

    // Prepare form data for OCR service
    const ocrFormData = new FormData();
    ocrFormData.append('file', file);
    ocrFormData.append('extract_text', 'true');
    ocrFormData.append('extract_tables', 'true');
    ocrFormData.append('extract_images', 'true');

    // Call OCR service
    const ocrServiceUrl = process.env.OCR_SERVICE_URL || 'http://localhost:8000/extract-text';
    
    const response = await fetch(ocrServiceUrl, {
      method: 'POST',
      body: ocrFormData,
    });

    if (!response.ok) {
      throw new Error(`OCR service error: ${response.statusText}`);
    }

    const result = await response.json();
    
    return { success: true, data: result };

  } catch (error) {
    console.error('OCR processing error:', error);
    return { 
      error: 'Failed to process document. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
```

### Document Upload Component
```typescript
// components/ocr/DocumentUpload.tsx
'use client';

import { useState } from 'react';
import { extractDocumentText } from '@/lib/ocr/actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function DocumentUpload({ onTextExtracted }: { 
  onTextExtracted: (text: string) => void 
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await extractDocumentText(formData);
      
      if (result.success) {
        onTextExtracted(result.data.text);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (error) {
      setError('Upload error occurred');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="space-y-4">
            <div className="text-4xl">📄</div>
            <div>
              <p className="text-lg font-medium">Upload Document</p>
              <p className="text-sm text-gray-500">
                PDF, JPG, or PNG files up to 10MB
              </p>
            </div>
            <Button disabled={uploading}>
              {uploading ? 'Processing...' : 'Choose File'}
            </Button>
          </div>
        </label>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
```

### Extracted Text Display Component
```typescript
// components/ocr/ExtractedText.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ExtractedTextProps {
  text: string;
  type?: 'resume' | 'job-description' | 'unknown';
}

export function ExtractedText({ text, type }: ExtractedTextProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDocumentTypeColor = () => {
    switch (type) {
      case 'resume': return 'bg-blue-100 text-blue-800';
      case 'job-description': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Extracted Text</h3>
        <div className="flex items-center gap-2">
          {type && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentTypeColor()}`}>
              {type === 'resume' ? 'Resume' : type === 'job-description' ? 'Job Description' : 'Unknown'}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
          {text}
        </pre>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        Characters: {text.length} | Words: {text.split(/\s+/).filter(word => word.length > 0).length}
      </div>
    </Card>
  );
}
```

### OCR Test Page
```typescript
// app/(dashboard)/ocr-test/page.tsx
'use client';

import { useState } from 'react';
import { DocumentUpload } from '@/components/ocr/DocumentUpload';
import { ExtractedText } from '@/components/ocr/ExtractedText';
import { detectDocumentType } from '@/lib/ocr/utils';

export default function OCRTestPage() {
  const [extractedText, setExtractedText] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleTextExtracted = (text: string) => {
    setExtractedText(text);
    setProcessing(false);
  };

  const documentType = extractedText ? detectDocumentType(extractedText) : null;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">OCR Test Page</h1>
        <p className="text-gray-600">
          Test OCR functionality by uploading documents and viewing extracted text.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Documents are processed using the external OCR service at {process.env.OCR_SERVICE_URL || 'http://localhost:8000/extract-text'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <DocumentUpload onTextExtracted={handleTextExtracted} />
          
          {processing && (
            <Card className="p-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3">Processing document...</span>
              </div>
            </Card>
          )}
        </div>
        
        <div>
          {extractedText && (
            <ExtractedText text={extractedText} type={documentType} />
          )}
        </div>
      </div>
    </div>
  );
}
```

## 🔧 Configuration

### Environment Variables
```env
# OCR Service Configuration
OCR_SERVICE_URL=http://localhost:8000/extract-text
OCR_SERVICE_TIMEOUT=30000

# File Upload Settings
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png
```

### OCR Service Utilities
```typescript
// lib/ocr/utils.ts
export function detectDocumentType(text: string): 'resume' | 'job-description' | 'unknown' {
  const resumeIndicators = [
    'experience', 'education', 'skills', 'summary', 
    'work history', 'employment', 'qualifications'
  ];
  
  const jobDescIndicators = [
    'requirements', 'responsibilities', 'qualifications',
    'job description', 'position', 'role', 'company'
  ];
  
  const resumeScore = resumeIndicators.filter(word => 
    text.toLowerCase().includes(word)).length;
  const jobDescScore = jobDescIndicators.filter(word => 
    text.toLowerCase().includes(word)).length;
  
  if (resumeScore > jobDescScore) return 'resume';
  if (jobDescScore > resumeScore) return 'job-description';
  return 'unknown';
}

export function extractEmails(text: string): string[] {
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const matches = text.match(emailPattern);
  return matches || [];
}

export function extractPhones(text: string): string[] {
  const phonePattern = /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g;
  const matches = text.match(phonePattern);
  return matches || [];
}
```

## 📊 Success Metrics

### Technical Metrics
- **OCR Processing Time**: < 10 seconds for standard documents
- **File Upload Success Rate**: > 95%
- **Document Detection Accuracy**: > 90%
- **Integration Stability**: < 1% error rate

### User Experience Metrics
- **Upload Completion Rate**: > 85%
- **Test Page Usage**: Track usage of OCR test functionality

## 📋 Key Requirements

1. **Server Actions**: Use Next.js server actions, not API routes
2. **TypeScript**: Full type safety with proper interfaces
3. **Error Handling**: Graceful failures with user feedback
4. **Validation**: File type and size validation
5. **Standalone**: No modifications to main interview flow
6. **Test Page**: Dedicated testing interface
7. **Security**: Proper file validation and sanitization

## 🧪 Testing Strategy

### Unit Tests
```typescript
// tests/ocr/utils.test.ts
describe('OCR Utils', () => {
  test('detectDocumentType should identify resumes correctly', () => {
    const resumeText = 'John Doe\nExperience: 5 years at Company\nEducation: BS Computer Science';
    const result = detectDocumentType(resumeText);
    expect(result).toBe('resume');
  });
});
```

### Integration Tests
```typescript
// tests/ocr/actions.test.ts
describe('OCR Actions', () => {
  test('extractDocumentText should process files correctly', async () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', mockFile);
    
    const result = await extractDocumentText(formData);
    expect(result.success).toBe(true);
  });
});
```

## 📁 Implementation Priority

### High Priority
1. Server Actions implementation
2. Type definitions  
3. Document upload component
4. OCR test page

### Medium Priority
5. Utility functions
6. Extracted text display component
7. File validation utilities

### Low Priority
8. Environment variables configuration
9. Error handling improvements
10. Progress indicators

---

This plan provides a focused roadmap for implementing OCR services in Zenkai as a standalone feature with a dedicated test page, without affecting the main interview flow.