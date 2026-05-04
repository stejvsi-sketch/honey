import { z } from 'zod';
import { CARD_COLORS, MAX_WORDS, MAX_NAME_LENGTH, MAX_MESSAGE_LENGTH } from './constants';

const validColorIds = CARD_COLORS.map(c => c.id) as [string, ...string[]];

export const submitMemorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(MAX_NAME_LENGTH, `Name must be ${MAX_NAME_LENGTH} characters or less`)
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(MAX_MESSAGE_LENGTH, `Message must be ${MAX_MESSAGE_LENGTH} characters or less`)
    .refine((val) => {
      const wordCount = val.split(/\s+/).filter(w => w.length > 0).length;
      return wordCount <= MAX_WORDS;
    }, `Message must be ${MAX_WORDS} words or less`)
    .refine((val) => {
      const words = val.split(/\s+/).filter(w => w.length > 0);
      return words.every(w => w.length <= 20);
    }, 'Each word must be 20 characters or less'),
  color_id: z.enum(validColorIds),
});

export type SubmitMemoryInput = z.infer<typeof submitMemorySchema>;

// Sanitize text to prevent XSS — strips HTML tags and trims
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>"'&]/g, (char) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return entities[char] || char;
    })
    .trim();
}

// Generate a URL-friendly slug from a name
export function generateNameSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Hash IP address using Web Crypto API (works in Edge Runtime)
export async function hashIP(ip: string): Promise<string> {
  const salt = process.env.ADMIN_SECRET || 'honey-if-only-salt';
  const data = new TextEncoder().encode(ip + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get country from IP using free API (fallback to 'Unknown')
export async function getCountryFromIP(ip: string): Promise<string> {
  try {
    // Use Cloudflare headers first (free, no API call needed)
    return 'Unknown'; // Will be set from CF-IPCountry header in API route
  } catch {
    return 'Unknown';
  }
}

// Generate a simple UUID v4
export function generateUUID(): string {
  return crypto.randomUUID();
}
