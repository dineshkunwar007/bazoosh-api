/**
 * Input validation and sanitization utilities
 */
import { FeedbackRequest, ValidationResult } from '../types';
import { getPromptTemplate } from '../config/prompts.config';

/**
 * Validate feedback request
 */
export function validateRequest(request: FeedbackRequest): ValidationResult {
  // Check required fields
  if (!request.promptType) {
    return {
      isValid: false,
      error: 'Oops! We need to know which type of writing you\'re working on.',
      errorCode: 'MISSING_PROMPT_TYPE',
    };
  }

  if (!request.userInput || request.userInput.trim().length === 0) {
    return {
      isValid: false,
      error: 'Please share your writing with us so we can give you feedback!',
      errorCode: 'MISSING_INPUT',
    };
  }

  // Sanitize input
  const sanitizedInput = sanitizeInput(request.userInput);
  request.userInput = sanitizedInput;

  // Check if prompt type exists
  const template = getPromptTemplate(request.promptType);
  if (!template) {
    return {
      isValid: false,
      error: `Hmm, we don't recognize "${request.promptType}". Please check the prompt type and try again.`,
      errorCode: 'INVALID_PROMPT_TYPE',
    };
  }

  // Check if image reference is required but missing
  if (template.requiresImage && !request.imageReference) {
    return {
      isValid: false,
      error: 'This writing task needs an image reference. Please tell us which image you\'re writing about!',
      errorCode: 'MISSING_IMAGE_REFERENCE',
    };
  }

  // Count words
  const wordCount = countWords(sanitizedInput);

  // Check minimum word count
  if (template.minWords && wordCount < template.minWords) {
    return {
      isValid: false,
      error: `Your writing is a bit short! This task needs at least ${template.minWords} words, but you have ${wordCount}. Try adding more details!`,
      errorCode: 'INPUT_TOO_SHORT',
      wordCount,
    };
  }

  // Check maximum word count
  if (template.maxWords && wordCount > template.maxWords) {
    return {
      isValid: false,
      error: `Your writing is a bit too long! This task should be no more than ${template.maxWords} words, but you have ${wordCount}. Try to be more concise!`,
      errorCode: 'INPUT_TOO_LONG',
      wordCount,
    };
  }

  // Check for gibberish/spam
  if (isGibberish(sanitizedInput)) {
    return {
      isValid: false,
      error: 'Hmm, we couldn\'t understand your writing. Please check that you\'ve entered real words and sentences!',
      errorCode: 'INVALID_INPUT_GIBBERISH',
    };
  }

  return {
    isValid: true,
    wordCount,
  };
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  // Trim whitespace
  let sanitized = input.trim();

  // Remove HTML tags (basic protection)
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  // Limit length to prevent abuse (10,000 characters)
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }

  return sanitized;
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  
  // Split by whitespace and filter out empty strings
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

/**
 * Detect gibberish/spam input
 */
function isGibberish(text: string): boolean {
  if (!text || text.length < 10) return false;

  // Check for excessive character repetition
  const repeatedChars = /(.)\1{10,}/;
  if (repeatedChars.test(text)) {
    return true;
  }

  // Check for low alpha character ratio
  const alphaChars = text.replace(/[^a-zA-Z]/g, '').length;
  const totalChars = text.length;
  const alphaRatio = alphaChars / totalChars;
  
  // If less than 50% alphabetic characters, likely gibberish
  if (alphaRatio < 0.5) {
    return true;
  }

  return false;
}
