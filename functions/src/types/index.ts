/**
 * Type definitions for Bazoosh AI Creative Writing Feedback API
 */

export interface FeedbackRequest {
  promptType: string;
  userInput: string;
  imageReference?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface FeedbackResponse {
  success: boolean;
  feedback?: string;
  error?: string;
  errorCode?: string;
  metadata?: {
    tokensUsed?: number;
    cost?: number;
    cached?: boolean;
    processingTime?: number;
    promptType?: string;
    cacheHitRate?: number;
  };
}

export interface PromptTemplate {
  category: string;
  systemPrompt: string;
  requiresImage: boolean;
  minWords?: number;
  maxWords?: number;
  expectedElements?: string[];
  baseSentence?: string;
}

export interface CacheEntry {
  cacheKey: string;
  feedback: string;
  tokensUsed: number;
  cost: number;
  timestamp: number;
  hitCount: number;
  expiresAt: number;
  promptType: string;
  inputHash: string;
}

export interface UsageLog {
  userId?: string;
  sessionId?: string;
  promptType: string;
  inputLength: number;
  tokensUsed: number;
  cost: number;
  cached: boolean;
  timestamp: number;
  processingTime: number;
  identifier: string;
}

export interface RateLimitEntry {
  identifier: string;
  requestCount: number;
  firstRequest: number;
  lastRequest: number;
  windowEnd: number;
  window: 'hourly' | 'daily';
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  errorCode?: string;
  wordCount?: number;
}

export interface OpenAIResponse {
  feedback: string;
  tokensUsed: number;
  cost: number;
  processingTime: number;
}

export interface CacheStats {
  totalEntries: number;
  totalHits: number;
  totalCost: number;
  totalSavings: number;
  hitRate: number;
}

export interface RateLimitStatus {
  allowed: boolean;
  reason?: string;
  retryAfter?: number;
  hourlyUsage: number;
  hourlyLimit: number;
  dailyUsage: number;
  dailyLimit: number;
}

export interface MonthlyCostSummary {
  month: string;
  totalCost: number;
  totalRequests: number;
  cachedRequests: number;
  cacheHitRate: number;
  budgetAlertThreshold: number;
  budgetLimitThreshold: number;
  budgetExceeded: boolean;
  averageCostPerRequest: number;
}

export interface DailyTrend {
  date: string;
  requests: number;
  cost: number;
  cachedRequests: number;
  cachePercentage: number;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  openai: {
    connected: boolean;
    message: string;
  };
  firebase: {
    connected: boolean;
  };
  timestamp: number;
}

export type PromptTemplates = Record<string, PromptTemplate>;
