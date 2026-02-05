/**
 * Child-friendly error handler for 11+ students
 */
import { Response } from 'express';
import { FeedbackResponse } from '../types';

// Error codes enum
export enum ErrorCode {
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_INPUT = 'INVALID_INPUT',
  BUDGET_EXCEEDED = 'BUDGET_EXCEEDED',
  OPENAI_ERROR = 'OPENAI_ERROR',
  MISSING_PROMPT_TYPE = 'MISSING_PROMPT_TYPE',
  MISSING_INPUT = 'MISSING_INPUT',
  INVALID_PROMPT_TYPE = 'INVALID_PROMPT_TYPE',
  MISSING_IMAGE_REFERENCE = 'MISSING_IMAGE_REFERENCE',
  INPUT_TOO_SHORT = 'INPUT_TOO_SHORT',
  INPUT_TOO_LONG = 'INPUT_TOO_LONG',
  INVALID_INPUT_GIBBERISH = 'INVALID_INPUT_GIBBERISH',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

// Map error codes to child-friendly messages
const ERROR_MESSAGES: Record<string, string> = {
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Whoa! You\'re writing so much today! To keep things fair for everyone, please take a short break and try again later. We\'ll be ready for more of your awesome writing soon! 📝',
  [ErrorCode.BUDGET_EXCEEDED]: 'We\'re taking a quick break to make sure everything runs smoothly. Please try again in a little while. Your patience helps us help everyone! 🌟',
  [ErrorCode.OPENAI_ERROR]: 'Oops! We had a little technical hiccup on our end. Don\'t worry - your writing is great! Please try again in a moment. 🔧',
  [ErrorCode.INTERNAL_ERROR]: 'Something unexpected happened, but it\'s not your fault! Please try again, and if it keeps happening, let your teacher know. 🤔',
};

/**
 * Send error response with child-friendly message
 */
export function sendError(
  res: Response,
  errorCode: ErrorCode | string,
  customMessage?: string,
  statusCode: number = 400
): void {
  const message = customMessage || ERROR_MESSAGES[errorCode] || ERROR_MESSAGES[ErrorCode.INTERNAL_ERROR];

  const response: FeedbackResponse = {
    success: false,
    error: message,
    errorCode: errorCode,
  };

  res.status(statusCode).json(response);
}

/**
 * Handle OpenAI-specific errors
 */
export function handleOpenAIError(error: any): { message: string; code: string; statusCode: number } {
  console.error('OpenAI Error:', error);

  // Rate limit error (429)
  if (error.status === 429 || error.code === 'rate_limit_exceeded') {
    return {
      message: 'We\'re getting lots of requests right now! Please wait a moment and try again. Thanks for being patient! ⏳',
      code: ErrorCode.OPENAI_ERROR,
      statusCode: 429,
    };
  }

  // Timeout error
  if (error.code === 'ETIMEDOUT' || error.code === 'timeout') {
    return {
      message: 'That took a bit too long! Let\'s try again - sometimes the internet gets busy. 🌐',
      code: ErrorCode.OPENAI_ERROR,
      statusCode: 504,
    };
  }

  // Invalid API key
  if (error.status === 401 || error.code === 'invalid_api_key') {
    return {
      message: 'There\'s a technical issue we need to fix. Please let your teacher know! 🔑',
      code: ErrorCode.OPENAI_ERROR,
      statusCode: 500,
    };
  }

  // Content filter error
  if (error.code === 'content_filter') {
    return {
      message: 'We noticed something in your writing that we can\'t give feedback on. Please check your work and try again with appropriate content. 🛡️',
      code: ErrorCode.INVALID_INPUT,
      statusCode: 400,
    };
  }

  // Generic OpenAI error
  return {
    message: ERROR_MESSAGES[ErrorCode.OPENAI_ERROR],
    code: ErrorCode.OPENAI_ERROR,
    statusCode: 500,
  };
}

/**
 * Format validation error
 */
export function formatValidationError(error: string, errorCode: string): FeedbackResponse {
  return {
    success: false,
    error: error,
    errorCode: errorCode,
  };
}
