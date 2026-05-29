import { HARD_BANNED_WORDS, SOFT_PROFANITY_WORDS } from './constants';

export interface ProfanityCheckResult {
  passed: boolean;
  reason?: string;
}

export function checkProfanity(text: string): ProfanityCheckResult {
  // Normalize whitespace so multi-word phrases like "kill yourself"
  // can't be bypassed with extra spaces/tabs/newlines
  const lower = text.toLowerCase().replace(/\s+/g, ' ').trim();
  const words = lower.split(' ').filter(w => w.length > 0);

  // Check for hard-banned words
  for (const banned of HARD_BANNED_WORDS) {
    // Match whole words only using regex
    const regex = new RegExp(`\\b${escapeRegex(banned)}\\b`, 'i');
    if (regex.test(lower)) {
      return { passed: false, reason: 'Your message contains words that are not allowed.' };
    }
  }

  // Check soft profanity ratio (max 30%)
  if (words.length > 0) {
    let profanityCount = 0;
    for (const word of words) {
      const cleaned = word.replace(/[^a-z]/g, '');
      if (SOFT_PROFANITY_WORDS.includes(cleaned)) {
        profanityCount++;
      }
    }
    const ratio = profanityCount / words.length;
    if (ratio > 0.3) {
      return { passed: false, reason: 'Your message contains too much profanity. Please tone it down a bit.' };
    }
  }

  return { passed: true };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
