/**
 * OpenAI API Configuration
 */
import OpenAI from 'openai';
import * as functions from 'firebase-functions';

// Initialize OpenAI client
const apiKey = functions.config().openai?.api_key || process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn('WARNING: OpenAI API key not configured');
}

export const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key-for-build',
});

// Model configuration
export const MODEL_CONFIG = {
  model: 'gpt-4o' as const,
  temperature: 0.7,
  maxTokens: 250,
  topP: 1,
  frequencyPenalty: 0.3,
  presencePenalty: 0.3,
};

// Token pricing (per 1M tokens in USD)
export const TOKEN_PRICING = {
  input: 2.5, // $2.50 per 1M input tokens
  output: 10, // $10 per 1M output tokens
};

/**
 * Calculate cost based on token usage
 */
export function calculateCost(inputTokens: number, outputTokens: number): number {
  const inputCost = (inputTokens / 1_000_000) * TOKEN_PRICING.input;
  const outputCost = (outputTokens / 1_000_000) * TOKEN_PRICING.output;
  return inputCost + outputCost;
}
