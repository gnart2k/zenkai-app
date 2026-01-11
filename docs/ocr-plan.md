# OCR Services Implementation Plan

## 🎯 Objective
Implement OCR services to extract text from Job Descriptions (JD) and CVs/resumes for parsing and analysis.

## 📋 Requirements Analysis

### Supported Document Types
- **PDF** documents
- **Image formats**: PNG, JPG, JPEG, WebP
- **Word documents**: DOCX
- **Scanned documents** with text layers

### Languages to Support
- **English** (Primary)
- **Japanese** (Secondary)
- **Korean** (Secondary) 
- **Vietnamese** (Secondary)

### Use Cases
1. **Job Description Upload** - Extract job requirements, responsibilities, qualifications
2. **CV/Resume Upload** - Extract candidate experience, skills, education
3. **Document Analysis** - Match JD requirements with CV content
4. **Data Processing** - Convert extracted text to structured data

## 🛠️ Technical Implementation

### 1. OCR Service Options

#### Option A: Tesseract.js (Client-side)
**Pros:**
- Free, open-source
- Works entirely client-side (privacy)
- No API costs
- Supports multiple languages
- Works offline

**Cons:**
- Lower accuracy than cloud services
- Limited to text recognition
- No document layout analysis

#### Option B: Cloud OCR Services
**Google Vision API:**
- High accuracy (95%+)
- Supports handwriting
- Document layout understanding
- Language auto-detection
- Scales well

**Amazon Textract:**
- Excellent for forms/documents
- Structured data extraction
- Table/form recognition
- Pricing per page

**Azure Computer Vision:**
- Good accuracy (90%+)
- Receipt/document analysis
- Reasonable pricing
- Good enterprise support

#### Option C: Hybrid Approach
- **Client-side**: Tesseract for quick previews
- **Server-side**: Cloud API for high-accuracy processing
- **Fallback**: Tesseract if cloud service fails

### 2. Recommended Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API    │    │   OCR Service  │
│                 │    │                  │    │                 │
│ File Upload     │───▶│ Upload Handler   │───▶│ Tesseract.js    │
│ Preview         │    │ File Validation  │    │ Google Vision   │
│ Progress        │    │ OCR Processing   │    │ Amazon Textract │
│ Results         │    │ Text Extraction  │    │ Azure Vision    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📁 File Structure Plan

```
lib/
├── ocr/
│   ├── services/
│   │   ├── tesseract.ts      # Client-side OCR
│   │   ├── google-vision.ts   # Google Vision API
│   │   └── aws-textract.ts    # AWS Textract API
│   ├── parsers/
│   │   ├── jd-parser.ts       # JD text parsing
│   │   ├── cv-parser.ts       # CV text parsing
│   │   └── common.ts         # Common utilities
│   ├── processors/
│   │   ├── image-prep.ts     # Image preprocessing
│   │   ├── text-cleaner.ts   # Text cleaning
│   │   └── pdf-handler.ts    # PDF processing
│   └── types.ts             # OCR type definitions
│
components/
├── ocr/
│   ├── FileUpload.tsx        # File upload component
│   ├── DocumentPreview.tsx    # Preview uploaded docs
│   ├── OcrProgress.tsx       # Processing progress
│   ├── TextExtractor.tsx      # OCR result display
│   └── DocumentAnalyzer.tsx   # JD/CV analysis
│
app/
├── api/
│   ├── ocr/
│   │   ├── upload/
│   │   │   └── route.ts       # File upload endpoint
│   │   ├── process/
│   │   │   └── route.ts       # OCR processing endpoint
│   │   └── extract/
│   │       └── route.ts       # Text extraction endpoint
│   └── upload/
│       └── route.ts           # Legacy upload endpoint
│
└── (dashboard)/
    ├── documents/
    │   ├── page.tsx           # Document management
    │   ├── upload/
    │   │   └── page.tsx       # Document upload UI
    │   └── analyze/
    │       └── page.tsx       # Document analysis
```

## 🚀 Implementation Phases

### Phase 1: Core Infrastructure (Week 1)

#### 1.1 Dependencies Setup
```bash
# OCR Libraries
npm install tesseract.js
npm install @aws-sdk/client-textract
npm install @google-cloud/vision
npm install azure-cognitiveservices-computervision

# PDF/Image Processing
npm install pdf-parse
npm install pdf2pic
npm install sharp
npm install canvas

# File Upload
npm install multer
npm install file-type
npm install @types/multer
```

#### 1.2 Type Definitions
```typescript
// lib/ocr/types.ts
export interface OcrResult {
  text: string;
  confidence: number;
  language: string;
  blocks?: TextBlock[];
  metadata: {
    pageCount: number;
    processingTime: number;
    service: string;
  };
}

export interface TextBlock {
  text: string;
  boundingBox: BoundingBox;
  confidence: number;
  type: 'paragraph' | 'heading' | 'list' | 'table';
}

export interface JDData {
  title: string;
  company: string;
  location: string;
  requirements: string[];
  responsibilities: string[];
  qualifications: string[];
  skills: string[];
  salary?: string;
  experience: string;
}

export interface CVData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: string[];
  certifications: Certification[];
}
```

#### 1.3 Basic OCR Service
```typescript
// lib/ocr/services/tesseract.ts
import Tesseract from 'tesseract.js';

export class TesseractService {
  async extractText(imageFile: File): Promise<OcrResult> {
    const result = await Tesseract.recognize(imageFile, 'eng+jpn+kor+vie', {
      logger: m => console.log(m),
    });
    
    return {
      text: result.data.text,
      confidence: result.data.confidence,
      language: 'auto',
      blocks: this.parseTextBlocks(result.data),
      metadata: {
        pageCount: 1,
        processingTime: result.data.time,
        service: 'tesseract'
      }
    };
  }
}
```

### Phase 2: File Processing (Week 2)

#### 2.1 File Upload Handler
```typescript
// app/api/ocr/upload/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  // Validate file type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    return Response.json({ error: 'Invalid file type' }, { status: 400 });
  }
  
  // Process file with appropriate OCR
  const ocrResult = await processFile(file);
  
  return Response.json({ success: true, data: ocrResult });
}
```

#### 2.2 Document Processing Pipeline
```typescript
// lib/ocr/processors/pipeline.ts
export async function processDocument(file: File): Promise<OcrResult> {
  // 1. Determine file type and preprocessing
  const processedFile = await preprocessFile(file);
  
  // 2. Choose OCR service
  const ocrService = selectOcrService(file);
  
  // 3. Extract text
  const ocrResult = await ocrService.extractText(processedFile);
  
  // 4. Post-process text
  const cleanedText = await cleanExtractedText(ocrResult.text);
  
  return { ...ocrResult, text: cleanedText };
}
```

### Phase 3: JD/CV Parsing (Week 3)

#### 3.1 Job Description Parser
```typescript
// lib/ocr/parsers/jd-parser.ts
export class JDParser {
  parse(text: string): JDData {
    return {
      title: this.extractTitle(text),
      company: this.extractCompany(text),
      requirements: this.extractRequirements(text),
      responsibilities: this.extractResponsibilities(text),
      skills: this.extractSkills(text),
      // ... other fields
    };
  }
  
  private extractTitle(text: string): string {
    // Use regex patterns to find job titles
    const titlePatterns = [
      /(?:job title|position):\s*(.+)/i,
      /^(.+)\s+(manager|developer|engineer|analyst)/i
    ];
    // Implementation...
  }
}
```

#### 3.2 CV Parser
```typescript
// lib/ocr/parsers/cv-parser.ts
export class CVParser {
  parse(text: string): CVData {
    return {
      personalInfo: this.extractPersonalInfo(text),
      experience: this.extractExperience(text),
      education: this.extractEducation(text),
      skills: this.extractSkills(text),
      // ... other fields
    };
  }
  
  private extractExperience(text: string): Experience[] {
    // Use patterns to find work experience sections
    // Handle different CV formats
  }
}
```

### Phase 4: UI Components (Week 4)

#### 4.1 File Upload Component
```typescript
// components/ocr/FileUpload.tsx
export function FileUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ocrResults, setOcrResults] = useState<OcrResult | null>(null);
  
  const handleFileUpload = async (file: File) => {
    // 1. Validate file
    if (!validateFile(file)) return;
    
    // 2. Upload to API
    const formData = new FormData();
    formData.append('file', file);
    
    const result = await fetch('/api/ocr/upload', {
      method: 'POST',
      body: formData,
    }).then(res => res.json());
    
    // 3. Parse results
    if (result.success) {
      setOcrResults(result.data);
    }
  };
  
  return (
    <div>
      <FileInput onFileSelect={handleFileUpload} />
      <ProgressBar progress={uploadProgress} />
      {ocrResults && <OcrResultsDisplay results={ocrResults} />}
    </div>
  );
}
```

#### 4.2 Document Analysis Component
```typescript
// components/ocr/DocumentAnalyzer.tsx
export function DocumentAnalyzer() {
  const [jdData, setJdData] = useState<JDData | null>(null);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [matchResults, setMatchResults] = useState<MatchResults | null>(null);
  
  const analyzeMatch = () => {
    if (jdData && cvData) {
      const results = calculateMatch(jdData, cvData);
      setMatchResults(results);
    }
  };
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <JDDisplay data={jdData} />
      <CVDisplay data={cvData} />
      <MatchAnalysis results={matchResults} />
    </div>
  );
}
```

### Phase 5: Advanced Features (Week 5-6)

#### 5.1 Multiple OCR Services Integration
```typescript
// lib/ocr/services/orchestrator.ts
export class OcrOrchestrator {
  async processWithFallback(file: File): Promise<OcrResult> {
    const services = [
      new GoogleVisionService(),
      new TesseractService(),
      new AzureVisionService()
    ];
    
    for (const service of services) {
      try {
        const result = await service.extractText(file);
        if (result.confidence > 80) {
          return result;
        }
      } catch (error) {
        console.log(`Service ${service.name} failed, trying next...`);
      }
    }
    
    throw new Error('All OCR services failed');
  }
}
```

#### 5.2 Language Detection & Translation
```typescript
// lib/ocr/processors/language-detector.ts
export async function detectAndTranslate(text: string): Promise<{
  detectedLanguage: string;
  translatedText: string;
}> {
  // Detect language
  const detected = await detectLanguage(text);
  
  // Translate if not English
  if (detected !== 'en') {
    const translated = await translateText(text, 'en');
    return { detectedLanguage: detected, translatedText: translated };
  }
  
  return { detectedLanguage: detected, translatedText: text };
}
```

## 🔧 Configuration & Environment

### Environment Variables
```env
# Google Vision
GOOGLE_VISION_API_KEY=your_api_key_here
GOOGLE_VISION_PROJECT_ID=your_project_id

# AWS Textract
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# Azure Vision
AZURE_COGNITIVE_SERVICES_KEY=your_key
AZURE_COGNITIVE_SERVICES_ENDPOINT=your_endpoint

# File Upload Limits
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,docx
```

### OCR Service Configuration
```typescript
// config/ocr.ts
export const OCR_CONFIG = {
  defaultService: 'tesseract',
  fallbackServices: ['google', 'azure'],
  confidenceThreshold: 75,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedLanguages: ['en', 'ja', 'ko', 'vi'],
  preprocessing: {
    enableContrastEnhancement: true,
    enableNoiseReduction: true,
    enableSkewCorrection: true
  }
};
```

## 📊 Performance & Scaling

### Client-side Processing
- **Pros**: Privacy, no server costs, offline capability
- **Cons**: Limited by device performance
- **Best for**: Small files, privacy-sensitive docs

### Server-side Processing  
- **Pros**: Higher accuracy, unlimited power, async processing
- **Cons**: Server costs, privacy considerations
- **Best for**: Large files, high accuracy needs

### Hybrid Strategy
```typescript
export async function selectProcessingStrategy(file: File): Promise<'client' | 'server'> {
  // Small files < 2MB: Client-side (Tesseract)
  if (file.size < 2 * 1024 * 1024) return 'client';
  
  // Large files or low accuracy needed: Server-side
  return 'server';
}
```

## 🧪 Testing Strategy

### Unit Tests
```typescript
// tests/ocr/tesseract.test.ts
describe('TesseractService', () => {
  test('should extract text from image', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const result = await tesseractService.extractText(mockFile);
    
    expect(result.text).toContain('test');
    expect(result.confidence).toBeGreaterThan(50);
  });
});
```

### Integration Tests
```typescript
// tests/ocr/api.test.ts
describe('OCR API', () => {
  test('POST /api/ocr/upload', async () => {
    const formData = new FormData();
    formData.append('file', mockPdfFile);
    
    const response = await fetch('/api/ocr/upload', {
      method: 'POST',
      body: formData
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});
```

### Performance Tests
- **Benchmark OCR accuracy** across different document types
- **Test file size limits** and performance degradation
- **Validate language support** for all 4 languages
- **Stress test** with concurrent uploads

## 📈 Success Metrics

### Accuracy Targets
- **English documents**: 95%+ accuracy
- **Japanese documents**: 90%+ accuracy  
- **Korean documents**: 90%+ accuracy
- **Vietnamese documents**: 90%+ accuracy

### Performance Targets
- **File upload**: < 2 seconds for 5MB files
- **OCR processing**: < 10 seconds for standard documents
- **API response**: < 15 seconds total processing time
- **UI responsiveness**: No blocking during processing

### User Experience Goals
- **Intuitive upload**: Drag & drop, progress bars
- **Real-time feedback**: Processing status updates
- **Error handling**: Graceful failures with alternatives
- **Mobile support**: Responsive design for all devices

## 🚦 Deployment Considerations

### Security
- **File validation**: Type, size, content scanning
- **Rate limiting**: Prevent abuse of OCR services
- **Data privacy**: Auto-delete processed files after 24h
- **API key security**: Environment variables, rotation

### Monitoring & Logging
- **OCR success rates** by service and language
- **Processing times** and bottlenecks
- **Error rates** and failure patterns
- **User analytics**: Document types, success rates

### Cost Management
- **OCR service costs**: Monitor API usage
- **Storage costs**: Automatic cleanup policies  
- **Bandwidth costs**: Optimize file sizes
- **Backup services**: Fallback strategies

## 📋 Implementation Checklist

### Phase 1: Core Infrastructure ☐
- [ ] Install OCR dependencies
- [ ] Set up type definitions
- [ ] Implement Tesseract service
- [ ] Create basic API endpoints

### Phase 2: File Processing ☐
- [ ] File upload handler
- [ ] Document preprocessing pipeline
- [ ] PDF processing support
- [ ] Image preprocessing

### Phase 3: JD/CV Parsing ☐
- [ ] JD parser implementation
- [ ] CV parser implementation
- [ ] Structured data extraction
- [ ] Validation and error handling

### Phase 4: UI Components ☐
- [ ] File upload component
- [ ] OCR progress display
- [ ] Results visualization
- [ ] Document analysis interface

### Phase 5: Advanced Features ☐
- [ ] Multiple OCR services
- [ ] Language detection
- [ ] Translation support
- [ ] Performance optimization

---

**Timeline**: 6 weeks total
**Team Size**: 1-2 developers
**Budget**: $0-500/month (depending on OCR services chosen)