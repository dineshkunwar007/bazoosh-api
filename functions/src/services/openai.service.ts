/**
 * OpenAI service for getting AI feedback
 */
import { openai, MODEL_CONFIG, calculateCost } from '../config/openai.config';
import { getPromptTemplate } from '../config/prompts.config';
import { OpenAIResponse } from '../types';

/**
 * Get feedback from OpenAI GPT-4o
 */
export async function getFeedback(
  promptType: string,
  userInput: string,
  imageReference?: string
): Promise<OpenAIResponse> {
  const startTime = Date.now();

  try {
    // Get prompt template
    const template = getPromptTemplate(promptType);
    if (!template) {
      throw new Error(`Invalid prompt type: ${promptType}`);
    }

    // Build system prompt
    let systemPrompt = template.systemPrompt;
    
    // Replace IMAGE REFERENCE placeholder if present
    if (imageReference) {
      systemPrompt = systemPrompt.replace(/IMAGE REFERENCE/g, `"${imageReference}"`);
    }

    // Replace BASE SENTENCE placeholder for ISPACED prompts
    if (template.baseSentence) {
      systemPrompt = systemPrompt.replace(/\[BASE SENTENCE\]/g, template.baseSentence);
    }

    // Build user message
    let userMessage = userInput;
    if (imageReference && template.requiresImage) {
      userMessage = `[Image: ${imageReference}]\n\n${userInput}`;
    }

    // Call OpenAI API
    console.log('Calling OpenAI API:', {
      model: MODEL_CONFIG.model,
      promptType,
      inputLength: userInput.length,
    });

    const completion = await openai.chat.completions.create({
      model: MODEL_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: MODEL_CONFIG.temperature,
      max_tokens: MODEL_CONFIG.maxTokens,
      top_p: MODEL_CONFIG.topP,
      frequency_penalty: MODEL_CONFIG.frequencyPenalty,
      presence_penalty: MODEL_CONFIG.presencePenalty,
    });

    // Extract feedback
    const feedback = completion.choices[0]?.message?.content || 'No feedback generated';

    // Get token usage
    const tokensUsed = completion.usage?.total_tokens || 0;
    const inputTokens = completion.usage?.prompt_tokens || 0;
    const outputTokens = completion.usage?.completion_tokens || 0;

    // Calculate cost
    const cost = calculateCost(inputTokens, outputTokens);

    const processingTime = Date.now() - startTime;

    console.log('OpenAI response received:', {
      tokensUsed,
      cost: cost.toFixed(6),
      processingTime: `${processingTime}ms`,
    });

    return {
      feedback,
      tokensUsed,
      cost,
      processingTime,
    };
  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    console.error('OpenAI API error:', error);
    
    // Re-throw with processing time
    const enhancedError = error;
    enhancedError.processingTime = processingTime;
    throw enhancedError;
  }
}

/**
 * Test OpenAI connection
 */
export async function testConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    // Make a minimal API call to test connection
    const completion = await openai.chat.completions.create({
      model: MODEL_CONFIG.model,
      messages: [
        {
          role: 'user',
          content: 'Test',
        },
      ],
      max_tokens: 5,
    });

    if (completion.choices && completion.choices.length > 0) {
      return {
        connected: true,
        message: 'OpenAI API is connected and working',
      };
    }

    return {
      connected: false,
      message: 'OpenAI API responded but no choices returned',
    };
  } catch (error: any) {
    console.error('OpenAI connection test failed:', error);
    return {
      connected: false,
      message: error.message || 'Failed to connect to OpenAI API',
    };
  }
}
