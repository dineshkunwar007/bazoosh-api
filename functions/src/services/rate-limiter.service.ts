/**
 * Rate limiting service to prevent abuse
 * Per-user/session/IP limits
 */
import { db, COLLECTIONS } from '../config/firebase.config';
import { RateLimitEntry, RateLimitStatus } from '../types';
import * as functions from 'firebase-functions';

// Rate limit configuration
const MAX_PER_HOUR = parseInt(functions.config().rate_limit?.max_per_hour || process.env.RATE_LIMIT_MAX_PER_HOUR || '10', 10);
const MAX_PER_DAY = parseInt(functions.config().rate_limit?.max_per_day || process.env.RATE_LIMIT_MAX_PER_DAY || '30', 10);

/**
 * Check if user/session is within rate limits
 */
export async function checkRateLimit(
  userId?: string,
  sessionId?: string,
  ipAddress?: string
): Promise<RateLimitStatus> {
  // Determine identifier (priority: userId > sessionId > ipAddress)
  const identifier = userId || sessionId || ipAddress || 'anonymous';

  try {
    // Check hourly limit
    const hourlyStatus = await checkWindowLimit(identifier, 'hourly', MAX_PER_HOUR);
    if (!hourlyStatus.allowed) {
      return hourlyStatus;
    }

    // Check daily limit
    const dailyStatus = await checkWindowLimit(identifier, 'daily', MAX_PER_DAY);
    if (!dailyStatus.allowed) {
      return dailyStatus;
    }

    // Both limits passed - increment counters
    await incrementRateLimit(identifier, 'hourly');
    await incrementRateLimit(identifier, 'daily');

    return {
      allowed: true,
      hourlyUsage: hourlyStatus.hourlyUsage + 1,
      hourlyLimit: MAX_PER_HOUR,
      dailyUsage: dailyStatus.dailyUsage + 1,
      dailyLimit: MAX_PER_DAY,
    };
  } catch (error) {
    console.error('Error checking rate limit:', error);
    // Allow on error to prevent blocking legitimate users
    return {
      allowed: true,
      hourlyUsage: 0,
      hourlyLimit: MAX_PER_HOUR,
      dailyUsage: 0,
      dailyLimit: MAX_PER_DAY,
    };
  }
}

/**
 * Check rate limit for a specific time window
 */
async function checkWindowLimit(
  identifier: string,
  window: 'hourly' | 'daily',
  maxRequests: number
): Promise<RateLimitStatus> {
  const docId = `${identifier}_${window}`;
  const docRef = db.collection(COLLECTIONS.RATE_LIMITS).doc(docId);
  const doc = await docRef.get();

  const now = Date.now();
  const windowMs = window === 'hourly' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

  if (!doc.exists) {
    // No rate limit entry - user is allowed
    return {
      allowed: true,
      hourlyUsage: 0,
      hourlyLimit: MAX_PER_HOUR,
      dailyUsage: 0,
      dailyLimit: MAX_PER_DAY,
    };
  }

  const entry = doc.data() as RateLimitEntry;

  // Check if window has expired
  if (entry.windowEnd < now) {
    // Window expired - reset and allow
    await docRef.delete();
    return {
      allowed: true,
      hourlyUsage: 0,
      hourlyLimit: MAX_PER_HOUR,
      dailyUsage: 0,
      dailyLimit: MAX_PER_DAY,
    };
  }

  // Check if limit exceeded
  if (entry.requestCount >= maxRequests) {
    const retryAfter = Math.ceil((entry.windowEnd - now) / 1000); // seconds

    return {
      allowed: false,
      reason: window === 'hourly' 
        ? `You've reached your hourly limit of ${maxRequests} requests. Please try again later!`
        : `You've reached your daily limit of ${maxRequests} requests. Come back tomorrow for more!`,
      retryAfter,
      hourlyUsage: window === 'hourly' ? entry.requestCount : 0,
      hourlyLimit: MAX_PER_HOUR,
      dailyUsage: window === 'daily' ? entry.requestCount : 0,
      dailyLimit: MAX_PER_DAY,
    };
  }

  // Within limits
  return {
    allowed: true,
    hourlyUsage: window === 'hourly' ? entry.requestCount : 0,
    hourlyLimit: MAX_PER_HOUR,
    dailyUsage: window === 'daily' ? entry.requestCount : 0,
    dailyLimit: MAX_PER_DAY,
  };
}

/**
 * Increment rate limit counter
 */
async function incrementRateLimit(identifier: string, window: 'hourly' | 'daily'): Promise<void> {
  const docId = `${identifier}_${window}`;
  const docRef = db.collection(COLLECTIONS.RATE_LIMITS).doc(docId);
  const doc = await docRef.get();

  const now = Date.now();
  const windowMs = window === 'hourly' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

  if (!doc.exists) {
    // Create new rate limit entry
    const entry: RateLimitEntry = {
      identifier,
      requestCount: 1,
      firstRequest: now,
      lastRequest: now,
      windowEnd: now + windowMs,
      window,
    };
    await docRef.set(entry);
  } else {
    // Update existing entry
    const entry = doc.data() as RateLimitEntry;
    
    // Check if window expired
    if (entry.windowEnd < now) {
      // Reset window
      const newEntry: RateLimitEntry = {
        identifier,
        requestCount: 1,
        firstRequest: now,
        lastRequest: now,
        windowEnd: now + windowMs,
        window,
      };
      await docRef.set(newEntry);
    } else {
      // Increment counter
      await docRef.update({
        requestCount: entry.requestCount + 1,
        lastRequest: now,
      });
    }
  }
}

/**
 * Get rate limit status for a user
 */
export async function getRateLimitStatus(
  userId?: string,
  sessionId?: string,
  ipAddress?: string
): Promise<RateLimitStatus> {
  const identifier = userId || sessionId || ipAddress || 'anonymous';

  try {
    // Get hourly status
    const hourlyDoc = await db
      .collection(COLLECTIONS.RATE_LIMITS)
      .doc(`${identifier}_hourly`)
      .get();

    // Get daily status
    const dailyDoc = await db
      .collection(COLLECTIONS.RATE_LIMITS)
      .doc(`${identifier}_daily`)
      .get();

    const now = Date.now();

    let hourlyUsage = 0;
    if (hourlyDoc.exists) {
      const entry = hourlyDoc.data() as RateLimitEntry;
      if (entry.windowEnd >= now) {
        hourlyUsage = entry.requestCount;
      }
    }

    let dailyUsage = 0;
    if (dailyDoc.exists) {
      const entry = dailyDoc.data() as RateLimitEntry;
      if (entry.windowEnd >= now) {
        dailyUsage = entry.requestCount;
      }
    }

    return {
      allowed: hourlyUsage < MAX_PER_HOUR && dailyUsage < MAX_PER_DAY,
      hourlyUsage,
      hourlyLimit: MAX_PER_HOUR,
      dailyUsage,
      dailyLimit: MAX_PER_DAY,
    };
  } catch (error) {
    console.error('Error getting rate limit status:', error);
    return {
      allowed: true,
      hourlyUsage: 0,
      hourlyLimit: MAX_PER_HOUR,
      dailyUsage: 0,
      dailyLimit: MAX_PER_DAY,
    };
  }
}

/**
 * Cleanup old rate limit entries
 */
export async function cleanupOldEntries(): Promise<number> {
  try {
    const now = Date.now();
    const oldSnapshot = await db
      .collection(COLLECTIONS.RATE_LIMITS)
      .where('windowEnd', '<', now)
      .get();

    if (oldSnapshot.empty) {
      console.log('No old rate limit entries to cleanup');
      return 0;
    }

    const batch = db.batch();
    let count = 0;

    oldSnapshot.forEach(doc => {
      batch.delete(doc.ref);
      count++;
    });

    await batch.commit();
    console.log(`Cleaned up ${count} old rate limit entries`);
    return count;
  } catch (error) {
    console.error('Error cleaning up old rate limit entries:', error);
    return 0;
  }
}
