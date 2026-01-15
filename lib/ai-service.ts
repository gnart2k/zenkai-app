import { generateWithOllama, ChatMessage } from './interview/ollama-client';

/**
 * Configuration for AI service calls
 */
export interface AIServiceConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

/**
 * Generic AI service that can handle any input type and return typed responses
 */
export class AIService<TInput, TOutput> {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig = {}) {
    this.config = {
      model: 'gpt-oss:120b-cloud',
      temperature: 0.7,
      maxTokens: 2000,
      ...config,
    };
  }

  /**
   * Create a custom prompt dynamically
   */
  private createCustomPrompt(input: TInput, prompt: string): string {
    const inputJson = JSON.stringify(input, null, 2);
    return `${prompt}

Given input: ${inputJson}

Please provide a structured JSON response based on the instructions above.`;
  }

  /**
   * Generate a response based on input data and output type
   */
  async generate(input: TInput, outputType: new () => TOutput, prompt?: string): Promise<TOutput> {
    // Create the appropriate prompt
    const finalPrompt = prompt 
      ? this.createCustomPrompt(input, prompt)
      : this.createPrompt(input, outputType);
    
    const messages: ChatMessage[] = [
      ...(this.config.systemPrompt ? [{ role: 'system' as const, content: this.config.systemPrompt }] : []),
      { role: 'user' as const, content: finalPrompt }
    ];

    try {
      const response = await generateWithOllama(messages, this.config.model);
      console.log('AIService response:', response);
      // Parse the response to match the expected output type
      return this.parseResponse(response, outputType);
    } catch (error) {
      console.error('AIService generation error:', error);
      throw new Error(`AI service failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a streaming response
   */
  async generateStream(input: TInput, outputType: new () => TOutput, prompt?: string): Promise<ReadableStream<Partial<TOutput>>> {
    // Use custom prompt if provided, otherwise create structured prompt
    const finalPrompt = prompt 
      ? this.createCustomPrompt(input, prompt)
      : this.createPrompt(input, outputType);
    
    const messages: ChatMessage[] = [
      ...(this.config.systemPrompt ? [{ role: 'system' as const, content: this.config.systemPrompt }] : []),
      { role: 'user' as const, content: finalPrompt }
    ];

    try {
      const response = await fetch(`${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}/api/chat`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          model: this.config.model,
          messages,
          stream: true,
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const encoder = new TextEncoder();
      let buffer = '';

      return new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.trim() === '') continue;
              
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  const content = data.message?.content || '';
                  
                  if (content) {
                    buffer += content;
                    
                    // Try to parse accumulated buffer as partial response
                    try {
                      const partialResponse = this.parseResponse(buffer, outputType);
                      controller.enqueue(partialResponse);
                    } catch {
                      // If parsing fails, continue accumulating
                    }
                  }
                } catch (e) {
                  // Ignore JSON parse errors for partial chunks
                }
              }
            }
          }

          // Final parse attempt
          try {
            const finalResponse = this.parseResponse(buffer, outputType);
            controller.enqueue(finalResponse);
          } catch (e) {
            console.warn('Final response parsing failed:', e);
          }
          
          controller.close();
        },
      });
    } catch (error) {
      console.error('AIService stream generation error:', error);
      throw new Error(`AI service streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a prompt based on input and expected output type
   */
  private createPrompt(input: TInput, outputType: new () => TOutput): string {
    const inputJson = JSON.stringify(input, null, 2);
    const outputTypeName = outputType.name;
    
    return `
You are an AI assistant that helps parse and generate structured data.

Given the following input:
${inputJson}

Please generate a response that matches the TypeScript type "${outputTypeName}". 
Return the response as valid JSON that can be parsed to match the expected type structure.

Requirements:
1. Return valid JSON only and nothing else, do not include json markedown or any extra text
2. Match the exact structure of the expected type
3. Use appropriate data types (string, number, boolean, array, object)
4. If a field is optional and you don't have data, either omit it or use null
5. Provide realistic and relevant data based on the input

Output format:
{
  // Your JSON response here
}
`.trim();
  }

  /**
   * Parse AI response to match expected output type
   */
  private parseResponse(response: string, outputType: new () => TOutput): TOutput {
    try {
      // Clean up the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const jsonStr = jsonMatch[0];
      const parsed = JSON.parse(jsonStr);
      
      // Basic validation that the parsed result resembles the expected structure
      return this.validateAndTransform(parsed, outputType);
    } catch (error) {
      console.error('Response parsing error:', error);
      throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Basic validation and transformation of parsed data
   */
  private validateAndTransform(data: any, outputType: new () => TOutput): TOutput {
    // For now, we'll do basic type coercion
    // In a production environment, you might want more sophisticated validation
    
    if (data === null || data === undefined) {
      return data as TOutput;
    }

    // Convert to expected type (TypeScript will handle the typing)
    return data as TOutput;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AIServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

/**
 * Convenience function to create an AI service instance
 */
export function createAIService<TInput, TOutput>(config?: AIServiceConfig): AIService<TInput, TOutput> {
  return new AIService<TInput, TOutput>(config);
}

/**
 * Quick helper function for single AI calls
 */
export async function generateAI<TInput, TOutput>(
  input: TInput,
  outputType: new () => TOutput,
  config?: AIServiceConfig,
  prompt?: string
): Promise<TOutput> {
  const service = new AIService<TInput, TOutput>(config);
  return service.generate(input, outputType, prompt);
}

/**
 * Quick helper function for streaming AI calls
 */
export async function generateAIStream<TInput, TOutput>(
  input: TInput,
  outputType: new () => TOutput,
  config?: AIServiceConfig,
  prompt?: string
): Promise<ReadableStream<Partial<TOutput>>> {
  const service = new AIService<TInput, TOutput>(config);
  return service.generateStream(input, outputType, prompt);
}