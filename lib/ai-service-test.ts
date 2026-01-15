// Test and demonstration of AI service

import { AIService, createAIService, generateAI, generateAIStream } from './ai-service';

// Test interfaces
interface TestInput {
  text: string;
  context?: string;
}

interface TestOutput {
  summary: string;
  keywords: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
}

interface ComplexInput {
  jobTitle: string;
  requirements: string[];
  experience: string;
}

interface ComplexOutput {
  jobDescription: {
    title: string;
    responsibilities: string[];
    requirements: {
      required: string[];
      preferred: string[];
    };
    qualifications: string[];
  };
  interviewQuestions: string[];
  matchScore: number;
}

// Test class to demonstrate AI service usage
export class AIServiceTester {
  static async runBasicTest(): Promise<void> {
    console.log('Running basic AI service test...');
    
    const service = createAIService<TestInput, TestOutput>({
      model: 'ministral-3:14b-cloud',
      temperature: 0.5,
      systemPrompt: 'You are an expert text analyzer. Analyze the given text and provide structured insights.'
    });

    const input: TestInput = {
      text: 'I love working with React and TypeScript. The company culture is amazing and the benefits are great!',
      context: 'employee feedback'
    };

    try {
      const result = await service.generate(input, class TestOutputType {} as any);
      console.log('Basic test result:', result);
    } catch (error) {
      console.error('Basic test failed:', error);
    }
  }

  static async runStreamingTest(): Promise<void> {
    console.log('Running streaming AI service test...');
    
    const service = new AIService<TestInput, TestOutput>({
      model: 'ministral-3:14b-cloud',
      temperature: 0.3,
    });

    const input: TestInput = {
      text: 'The new features are impressive and the user interface is very intuitive.',
    };

    try {
      const stream = await service.generateStream(input, class TestOutputType {} as any);
      
      for await (const chunk of stream) {
        console.log('Streaming chunk:', chunk);
      }
    } catch (error) {
      console.error('Streaming test failed:', error);
    }
  }

  static async runComplexTest(): Promise<void> {
    console.log('Running complex AI service test...');
    
    const input: ComplexInput = {
      jobTitle: 'Senior Frontend Developer',
      requirements: ['React', 'TypeScript', '5+ years experience'],
      experience: 'Senior developer with expertise in React ecosystem'
    };

    try {
      const result = await generateAI(
        input,
        class ComplexOutputType {} as any,
        {
          model: 'ministral-3:14b-cloud',
          temperature: 0.4,
          systemPrompt: 'You are an expert HR assistant. Generate comprehensive job descriptions and interview materials.',
          maxTokens: 3000,
        }
      );
      
      console.log('Complex test result:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Complex test failed:', error);
    }
  }

  static async runMultipleTests(): Promise<void> {
    console.log('Running multiple tests...');
    
    const tests = [
      this.runBasicTest(),
      this.runComplexTest(),
    ];

    try {
      const results = await Promise.allSettled(tests);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(`Test ${index + 1} succeeded`);
        } else {
          console.error(`Test ${index + 1} failed:`, result.reason);
        }
      });
    } catch (error) {
      console.error('Multiple tests failed:', error);
    }
  }

  static async runErrorHandlingTest(): Promise<void> {
    console.log('Running error handling test...');
    
    const service = createAIService<TestInput, TestOutput>({
      model: 'invalid-model-name', // This should cause an error
    });

    const input: TestInput = {
      text: 'This should fail with invalid model'
    };

    try {
      const result = await service.generate(input, class TestOutputType {} as any);
      console.log('Unexpected success:', result);
    } catch (error) {
      console.log('Expected error caught:', error.message);
    }
  }
}

// Helper type for tests
class TestOutputType {}
class ComplexOutputType {}

// Export the test runner
export default AIServiceTester;