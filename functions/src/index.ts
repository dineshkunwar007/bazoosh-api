/**
 * Bazoosh AI Creative Writing Feedback API
 * Main entry point with Express routes and scheduled functions
 */
import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import { FeedbackRequest, FeedbackResponse, HealthCheckResponse } from './types';
import { validateRequest } from './utils/validation';
import { sendError, handleOpenAIError, ErrorCode, formatValidationError } from './utils/error-handler';
import { checkRateLimit, getRateLimitStatus, cleanupOldEntries } from './services/rate-limiter.service';
import { getCachedFeedback, cacheFeedback, getCacheStats, cleanupExpiredEntries } from './services/cache.service';
import { getFeedback, testConnection } from './services/openai.service';
import { logUsage, getMonthlyCost, getDailyTrends, isBudgetExceeded, monitorBudget } from './services/analytics.service';
import { getAllPromptTypes, PROMPT_TEMPLATES } from './config/prompts.config';

// Initialize Express app
const app = express();

// CORS configuration
const corsOrigins = functions.config().cors?.allowed_origins || process.env.CORS_ALLOWED_ORIGINS || '*';
const corsOptions = {
  origin: corsOrigins === '*' ? true : corsOrigins.split(','),
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.method === 'POST' ? '...' : undefined,
    query: req.query,
  });
  next();
});

// ========================================
// MAIN ENDPOINTS
// ========================================

/**
 * POST /feedback - Get AI feedback on writing
 */
app.post('/feedback', async (req, res) => {
  const startTime = Date.now();

  try {
    const request: FeedbackRequest = req.body;

    // Validate input
    const validation = validateRequest(request);
    if (!validation.isValid) {
      return res.status(400).json(formatValidationError(validation.error!, validation.errorCode!));
    }

    // Check budget
    const budgetExceeded = await isBudgetExceeded();
    if (budgetExceeded) {
      return sendError(res, ErrorCode.BUDGET_EXCEEDED, undefined, 503);
    }

    // Check rate limits
    const rateLimitStatus = await checkRateLimit(
      request.userId,
      request.sessionId,
      req.ip
    );

    if (!rateLimitStatus.allowed) {
      return res.status(429).json({
        success: false,
        error: rateLimitStatus.reason,
        errorCode: ErrorCode.RATE_LIMIT_EXCEEDED,
        metadata: {
          retryAfter: rateLimitStatus.retryAfter,
          hourlyUsage: rateLimitStatus.hourlyUsage,
          hourlyLimit: rateLimitStatus.hourlyLimit,
          dailyUsage: rateLimitStatus.dailyUsage,
          dailyLimit: rateLimitStatus.dailyLimit,
        },
      });
    }

    // Check cache first
    let feedback: string;
    let tokensUsed: number;
    let cost: number;
    let cached = false;

    const cachedEntry = await getCachedFeedback(
      request.promptType,
      request.userInput,
      request.imageReference
    );

    if (cachedEntry) {
      // Use cached feedback
      feedback = cachedEntry.feedback;
      tokensUsed = cachedEntry.tokensUsed;
      cost = 0; // No cost for cached responses
      cached = true;
      console.log('Using cached feedback');
    } else {
      // Get new feedback from OpenAI
      try {
        const openaiResponse = await getFeedback(
          request.promptType,
          request.userInput,
          request.imageReference
        );
        feedback = openaiResponse.feedback;
        tokensUsed = openaiResponse.tokensUsed;
        cost = openaiResponse.cost;

        // Cache the response
        await cacheFeedback(
          request.promptType,
          request.userInput,
          feedback,
          tokensUsed,
          cost,
          request.imageReference
        );
      } catch (error: any) {
        const errorInfo = handleOpenAIError(error);
        return sendError(res, errorInfo.code, errorInfo.message, errorInfo.statusCode);
      }
    }

    const processingTime = Date.now() - startTime;

    // Log usage
    await logUsage(
      request.promptType,
      request.userInput.length,
      tokensUsed,
      cost,
      cached,
      processingTime,
      request.userId,
      request.sessionId
    );

    // Get cache stats for metadata
    const cacheStats = await getCacheStats();

    // Return response
    const response: FeedbackResponse = {
      success: true,
      feedback,
      metadata: {
        tokensUsed,
        cost,
        cached,
        processingTime,
        promptType: request.promptType,
        cacheHitRate: cacheStats.hitRate,
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error('Error in /feedback:', error);
    return sendError(res, ErrorCode.INTERNAL_ERROR, undefined, 500);
  }
});

/**
 * GET /health - Health check endpoint
 */
app.get('/health', async (req, res) => {
  try {
    const openaiStatus = await testConnection();

    const response: HealthCheckResponse = {
      status: openaiStatus.connected ? 'healthy' : 'unhealthy',
      openai: openaiStatus,
      firebase: {
        connected: true,
      },
      timestamp: Date.now(),
    };

    const statusCode = openaiStatus.connected ? 200 : 503;
    res.status(statusCode).json(response);
  } catch (error: any) {
    console.error('Error in /health:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: Date.now(),
    });
  }
});

/**
 * GET /prompts - List all available prompt types
 */
app.get('/prompts', (req, res) => {
  try {
    const promptTypes = getAllPromptTypes();
    
    // Group by category
    const grouped: Record<string, string[]> = {};
    for (const promptType of promptTypes) {
      const template = PROMPT_TEMPLATES[promptType];
      if (!grouped[template.category]) {
        grouped[template.category] = [];
      }
      grouped[template.category].push(promptType);
    }

    res.json({
      success: true,
      totalPrompts: promptTypes.length,
      categories: grouped,
      prompts: PROMPT_TEMPLATES,
    });
  } catch (error: any) {
    console.error('Error in /prompts:', error);
    sendError(res, ErrorCode.INTERNAL_ERROR, undefined, 500);
  }
});

/**
 * GET /analytics/monthly - Get monthly cost summary
 */
app.get('/analytics/monthly', async (req, res) => {
  try {
    const monthlyCost = await getMonthlyCost();
    res.json({
      success: true,
      data: monthlyCost,
    });
  } catch (error: any) {
    console.error('Error in /analytics/monthly:', error);
    sendError(res, ErrorCode.INTERNAL_ERROR, undefined, 500);
  }
});

/**
 * GET /analytics/cache - Get cache performance stats
 */
app.get('/analytics/cache', async (req, res) => {
  try {
    const cacheStats = await getCacheStats();
    res.json({
      success: true,
      data: cacheStats,
    });
  } catch (error: any) {
    console.error('Error in /analytics/cache:', error);
    sendError(res, ErrorCode.INTERNAL_ERROR, undefined, 500);
  }
});

/**
 * GET /analytics/trends - Get daily usage trends
 */
app.get('/analytics/trends', async (req, res) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const trends = await getDailyTrends(days);
    res.json({
      success: true,
      days,
      data: trends,
    });
  } catch (error: any) {
    console.error('Error in /analytics/trends:', error);
    sendError(res, ErrorCode.INTERNAL_ERROR, undefined, 500);
  }
});

/**
 * GET /rate-limit-status - Check rate limit status
 */
app.get('/rate-limit-status', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    const sessionId = req.query.sessionId as string;
    
    const status = await getRateLimitStatus(userId, sessionId, req.ip);
    res.json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    console.error('Error in /rate-limit-status:', error);
    sendError(res, ErrorCode.INTERNAL_ERROR, undefined, 500);
  }
});

// ========================================
// EXPORT API
// ========================================

export const api = functions.https.onRequest(app);

// ========================================
// SCHEDULED FUNCTIONS
// ========================================

/**
 * Cleanup expired cache entries daily at 2 AM London time
 */
export const cleanupCache = functions.pubsub
  .schedule('0 2 * * *')
  .timeZone('Europe/London')
  .onRun(async (context) => {
    console.log('Running scheduled cache cleanup...');
    const count = await cleanupExpiredEntries();
    console.log(`Cache cleanup complete: ${count} entries removed`);
    return null;
  });

/**
 * Cleanup old rate limit entries daily at 3 AM London time
 */
export const cleanupRateLimitsScheduled = functions.pubsub
  .schedule('0 3 * * *')
  .timeZone('Europe/London')
  .onRun(async (context) => {
    console.log('Running scheduled rate limit cleanup...');
    const count = await cleanupOldEntries();
    console.log(`Rate limit cleanup complete: ${count} entries removed`);
    return null;
  });

/**
 * Monitor budget hourly
 */
export const budgetAlert = functions.pubsub
  .schedule('0 * * * *')
  .onRun(async (context) => {
    console.log('Running scheduled budget monitoring...');
    await monitorBudget();
    console.log('Budget monitoring complete');
    return null;
  });
