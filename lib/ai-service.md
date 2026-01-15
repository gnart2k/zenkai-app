# AI Service

A generic, type-safe AI service that integrates with Ollama for generating structured data responses.

## Features

- **Type-Safe**: Generic types for input and output with compile-time validation
- **Ollama Integration**: Uses existing Ollama client for AI model communication
- **Streaming Support**: Both regular and streaming response generation
- **Configurable**: Model, temperature, system prompts, and other parameters
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Domain Agnostic**: Works with any input/output types

## Basic Usage

```typescript
import { createAIService, generateAI } from '@/lib/ai-service';

// Create a service instance
const service = createAIService<string, MyOutputType>({
  model: 'ministral-3:14b-cloud',
  temperature: 0.7,
  systemPrompt: 'You are an expert data analyst.'
});

// Generate response (with default prompt)
const result1 = await service.generate(inputData, MyOutputType as any);

// Generate response (with custom prompt)
const customPrompt = 'Analyze this data and extract key insights...';
const result2 = await service.generate(inputData, MyOutputType as any, customPrompt);
```

## Quick Helper Functions

```typescript
// One-time generation
const result = await generateAI(input, OutputType, config);

// Streaming generation
const stream = await generateAIStream(input, OutputType, config);
for await (const chunk of stream) {
  console.log('Partial result:', chunk);
}
```

## Configuration Options

```typescript
interface AIServiceConfig {
  model?: string;           // Default: 'ministral-3:14b-cloud'
  temperature?: number;       // Default: 0.7
  maxTokens?: number;        // Default: 2000
  systemPrompt?: string;     // Optional system prompt
}
```

## Custom Prompts

Both service methods and helper functions now support custom prompts:

```typescript
// Using custom prompt with service instance
const result = await service.generate(input, OutputType as any, customPrompt);

// Using custom prompt with helper functions
const result1 = await generateAI(input, OutputType, config, customPrompt);
const stream = await generateAIStream(input, OutputType, config, customPrompt);
```

### Custom Prompt Examples

```typescript
// CV parsing prompt
const cvPrompt = `
You are an expert CV parser.
Extract structured information from the given resume text.
Focus on personal info, experience, education, and skills.
Return valid JSON matching CVData structure.
`;

// Sentiment analysis prompt  
const sentimentPrompt = `
You are a sentiment analysis expert.
Analyze text for: sentiment (positive/neutral/negative), key themes, confidence.
Return JSON with: summary, keyPoints[], sentiment, confidence.
`;

// Usage with custom prompts
const cvData = await service.generate(resumeText, CVDataType as any, cvPrompt);
const sentiment = await service.generate(text, SentimentType as any, sentimentPrompt);
```

## Type Examples

```typescript
// Input type
interface CVInput {
  rawText: string;
  documentType: 'cv' | 'resume';
}

// Output type
interface CVOutput {
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
  };
  experience: Array<{
    title?: string;
    company?: string;
    duration?: string;
  }>;
  skills: {
    technical?: string[];
    soft?: string[];
  };
}

// Usage
const cvService = createAIService<CVInput, CVOutput>({
  systemPrompt: 'Extract structured CV data from the given text.'
});

const cvData = await cvService.generate(cvInput, class CVOutputType {} as any);
```

## Streaming Response

The service supports streaming responses for real-time updates:

```typescript
const stream = await service.generateStream(input, OutputType as any);

for await (const chunk of stream) {
  // Each chunk is a Partial<OutputType>
  console.log('Received chunk:', chunk);
}
```

## Error Handling

The service includes comprehensive error handling:

```typescript
try {
  const result = await service.generate(input, OutputType as any);
  console.log('Success:', result);
} catch (error) {
  console.error('AI Service Error:', error.message);
  // Error includes:
  // - Model connection issues
  // - Invalid JSON responses
  // - Type parsing failures
}
```

## Best Practices

1. **Type Safety**: Always use proper TypeScript interfaces for input/output
2. **System Prompts**: Provide clear, specific system prompts for better results
3. **Temperature**: Use lower values (0.1-0.3) for structured data, higher (0.7-1.0) for creative content
4. **Error Handling**: Always wrap calls in try-catch blocks
5. **Streaming**: Use streaming for long responses or real-time UI updates
6. **Model Selection**: Choose appropriate models for your use case

## Integration with OCR Types

The AI service works seamlessly with the domain-driven OCR types:

```typescript
import { createAIService } from '@/lib/ai-service';
import { CVData, JDData } from '@/lib/ocr/analysis';

// CV generation
const cvService = createAIService<string, CVData>();
const cvResult = await cvService.generate(resumeText, class CVDataType {} as any);

// JD generation  
const jdService = createAIService<string, JDData>();
const jdResult = await jdService.generate(jobText, class JDDataType {} as any);
```

## Examples

See `lib/ai-service-examples.ts` for comprehensive usage examples including:
- CV data generation from text
- Job description generation
- Skills analysis
- Custom type usage
- Error handling examples

## Testing

Run the test suite to verify functionality:

```typescript
import AIServiceTester from '@/lib/ai-service-test';

// Run individual tests
await AIServiceTester.runBasicTest();
await AIServiceTester.runStreamingTest();

// Run all tests
await AIServiceTester.runMultipleTests();
```