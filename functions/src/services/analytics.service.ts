/**
 * Analytics service for usage tracking and cost monitoring
 */
import { db, COLLECTIONS } from '../config/firebase.config';
import { UsageLog, MonthlyCostSummary, DailyTrend } from '../types';
import * as functions from 'firebase-functions';

// Budget configuration
const BUDGET_ALERT_USD = parseFloat(functions.config().budget?.alert_usd || process.env.BUDGET_ALERT_USD || '50');
const BUDGET_LIMIT_USD = parseFloat(functions.config().budget?.limit_usd || process.env.BUDGET_LIMIT_USD || '100');

/**
 * Log API usage
 */
export async function logUsage(
  promptType: string,
  inputLength: number,
  tokensUsed: number,
  cost: number,
  cached: boolean,
  processingTime: number,
  userId?: string,
  sessionId?: string
): Promise<void> {
  try {
    const identifier = userId || sessionId || 'anonymous';
    const timestamp = Date.now();

    const log: UsageLog = {
      userId,
      sessionId,
      promptType,
      inputLength,
      tokensUsed,
      cost,
      cached,
      timestamp,
      processingTime,
      identifier,
    };

    // Store usage log
    await db.collection(COLLECTIONS.USAGE_LOGS).add(log);

    // Update daily cost tracking
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const costDoc = db.collection(COLLECTIONS.COST_TRACKING).doc(today);
    
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(costDoc);
      
      if (!doc.exists) {
        transaction.set(costDoc, {
          date: today,
          totalCost: cost,
          totalRequests: 1,
          cachedRequests: cached ? 1 : 0,
          tokensUsed: tokensUsed,
          timestamp: timestamp,
        });
      } else {
        const data = doc.data()!;
        transaction.update(costDoc, {
          totalCost: (data.totalCost || 0) + cost,
          totalRequests: (data.totalRequests || 0) + 1,
          cachedRequests: (data.cachedRequests || 0) + (cached ? 1 : 0),
          tokensUsed: (data.tokensUsed || 0) + tokensUsed,
        });
      }
    });

    console.log('Logged usage:', {
      promptType,
      cost: cost.toFixed(6),
      cached,
      identifier,
    });
  } catch (error) {
    console.error('Error logging usage:', error);
  }
}

/**
 * Get monthly cost summary
 */
export async function getMonthlyCost(): Promise<MonthlyCostSummary> {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const monthStr = `${year}-${month}`;

    // Get all cost tracking docs for current month
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;

    const snapshot = await db
      .collection(COLLECTIONS.COST_TRACKING)
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .get();

    let totalCost = 0;
    let totalRequests = 0;
    let cachedRequests = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      totalCost += data.totalCost || 0;
      totalRequests += data.totalRequests || 0;
      cachedRequests += data.cachedRequests || 0;
    });

    const cacheHitRate = totalRequests > 0 ? cachedRequests / totalRequests : 0;
    const averageCostPerRequest = totalRequests > 0 ? totalCost / totalRequests : 0;
    const budgetExceeded = totalCost >= BUDGET_LIMIT_USD;

    // Log budget warnings
    if (totalCost >= BUDGET_ALERT_USD && totalCost < BUDGET_LIMIT_USD) {
      console.warn(`⚠️  Budget alert: $${totalCost.toFixed(2)} / $${BUDGET_LIMIT_USD} (${((totalCost / BUDGET_LIMIT_USD) * 100).toFixed(1)}%)`);
    } else if (budgetExceeded) {
      console.error(`🚨 Budget limit exceeded: $${totalCost.toFixed(2)} / $${BUDGET_LIMIT_USD}`);
    }

    return {
      month: monthStr,
      totalCost,
      totalRequests,
      cachedRequests,
      cacheHitRate,
      budgetAlertThreshold: BUDGET_ALERT_USD,
      budgetLimitThreshold: BUDGET_LIMIT_USD,
      budgetExceeded,
      averageCostPerRequest,
    };
  } catch (error) {
    console.error('Error getting monthly cost:', error);
    return {
      month: new Date().toISOString().substring(0, 7),
      totalCost: 0,
      totalRequests: 0,
      cachedRequests: 0,
      cacheHitRate: 0,
      budgetAlertThreshold: BUDGET_ALERT_USD,
      budgetLimitThreshold: BUDGET_LIMIT_USD,
      budgetExceeded: false,
      averageCostPerRequest: 0,
    };
  }
}

/**
 * Check if budget is exceeded
 */
export async function isBudgetExceeded(): Promise<boolean> {
  try {
    const monthlyCost = await getMonthlyCost();
    return monthlyCost.budgetExceeded;
  } catch (error) {
    console.error('Error checking budget:', error);
    return false;
  }
}

/**
 * Get daily usage trends
 */
export async function getDailyTrends(days: number = 30): Promise<DailyTrend[]> {
  try {
    const trends: DailyTrend[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const doc = await db.collection(COLLECTIONS.COST_TRACKING).doc(dateStr).get();

      if (doc.exists) {
        const data = doc.data()!;
        const cachePercentage = data.totalRequests > 0 
          ? (data.cachedRequests / data.totalRequests) * 100 
          : 0;

        trends.push({
          date: dateStr,
          requests: data.totalRequests || 0,
          cost: data.totalCost || 0,
          cachedRequests: data.cachedRequests || 0,
          cachePercentage,
        });
      } else {
        trends.push({
          date: dateStr,
          requests: 0,
          cost: 0,
          cachedRequests: 0,
          cachePercentage: 0,
        });
      }
    }

    return trends;
  } catch (error) {
    console.error('Error getting daily trends:', error);
    return [];
  }
}

/**
 * Monitor budget and alert if needed (called by scheduled function)
 */
export async function monitorBudget(): Promise<void> {
  try {
    const monthlyCost = await getMonthlyCost();
    
    if (monthlyCost.budgetExceeded) {
      console.error('🚨🚨🚨 BUDGET LIMIT EXCEEDED 🚨🚨🚨');
      console.error(`Current month (${monthlyCost.month}): $${monthlyCost.totalCost.toFixed(2)}`);
      console.error(`Budget limit: $${monthlyCost.budgetLimitThreshold}`);
      console.error('API requests are being blocked until next month.');
    } else if (monthlyCost.totalCost >= monthlyCost.budgetAlertThreshold) {
      console.warn('⚠️  BUDGET ALERT ⚠️');
      console.warn(`Current month (${monthlyCost.month}): $${monthlyCost.totalCost.toFixed(2)}`);
      console.warn(`Alert threshold: $${monthlyCost.budgetAlertThreshold}`);
      console.warn(`Limit: $${monthlyCost.budgetLimitThreshold}`);
      console.warn(`Usage: ${((monthlyCost.totalCost / monthlyCost.budgetLimitThreshold) * 100).toFixed(1)}%`);
    } else {
      console.log('✅ Budget status: OK');
      console.log(`Current month (${monthlyCost.month}): $${monthlyCost.totalCost.toFixed(2)} / $${monthlyCost.budgetLimitThreshold}`);
      console.log(`Cache hit rate: ${(monthlyCost.cacheHitRate * 100).toFixed(1)}%`);
    }
  } catch (error) {
    console.error('Error monitoring budget:', error);
  }
}
