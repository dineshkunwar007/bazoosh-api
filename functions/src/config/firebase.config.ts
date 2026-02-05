/**
 * Firebase Admin Configuration
 */
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = admin.firestore();
export const auth = admin.auth();

// Firestore collections
export const COLLECTIONS = {
  FEEDBACK_CACHE: 'feedbackCache',
  RATE_LIMITS: 'rateLimits',
  USAGE_LOGS: 'usageLogs',
  COST_TRACKING: 'costTracking',
};

export default admin;
