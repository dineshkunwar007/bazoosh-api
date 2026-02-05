/**
 * Hash and similarity utilities for caching
 */
import * as crypto from 'crypto';

/**
 * Generate MD5 hash (fast, not for security)
 */
export function generateHash(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex');
}

/**
 * Generate cache key from prompt type and normalized inputs
 */
export function generateCacheKey(
  promptType: string,
  userInput: string,
  imageReference?: string
): string {
  const normalized = normalizeText(userInput);
  const content = `${promptType}:${normalized}:${imageReference || ''}`;
  return generateHash(content);
}

/**
 * Normalize text for comparison
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '');
}

/**
 * Calculate Jaccard similarity between two strings (0-1)
 * Used for fuzzy cache matching
 */
export function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(normalizeText(text1).split(' '));
  const words2 = new Set(normalizeText(text2).split(' '));

  // Calculate intersection
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  
  // Calculate union
  const union = new Set([...words1, ...words2]);

  // Avoid division by zero
  if (union.size === 0) {
    return 0;
  }

  return intersection.size / union.size;
}

/**
 * Generate fuzzy search tokens for similarity matching
 */
export function generateSearchTokens(text: string): string[] {
  const normalized = normalizeText(text);
  const words = normalized.split(' ');
  
  // Return unique words sorted for consistent comparison
  return [...new Set(words)].sort();
}
