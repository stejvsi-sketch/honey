export const SITE_NAME = 'Honey, If Only';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.honeyifonly.com';
export const SITE_DESCRIPTION = "We all have words we couldn't say. Honey, If Only is a place for unsent letters, unsent messages, and love letters never sent. A digital archive for your grief, heartbreak, and unspoken words. Distill your truth into 25 words. Let it go.";

export const CACHE_TTL = 18000; // 5 hours in seconds
export const CACHE_REVALIDATE = 18000;

export const MAX_WORDS = 25;
export const MAX_SUBMITS_PER_DAY = 6;
export const MAX_NAME_LENGTH = 30;
export const MAX_MESSAGE_LENGTH = 250; // generous char limit, word limit is enforced

export const CARD_COLORS = [
  { id: 'parchment', name: 'Parchment', hex: '#f5e6d0' },
  { id: 'rose-dust', name: 'Rose Dust', hex: '#e8c4c4' },
  { id: 'sage-whisper', name: 'Sage Whisper', hex: '#c4d4c4' },
  { id: 'lavender-haze', name: 'Lavender Haze', hex: '#d4c4e0' },
  { id: 'honey-gold', name: 'Honey Gold', hex: '#e8d49c' },
  { id: 'ocean-mist', name: 'Ocean Mist', hex: '#b8ccd8' },
  { id: 'blush-coral', name: 'Blush Coral', hex: '#e0b4a8' },
  { id: 'dusty-mauve', name: 'Dusty Mauve', hex: '#c8a8b8' },
  { id: 'faded-denim', name: 'Faded Denim', hex: '#a8b8c8' },
  { id: 'ivory-ash', name: 'Ivory Ash', hex: '#e0dcd4' },
] as const;

export type CardColorId = typeof CARD_COLORS[number]['id'];

// Hard-banned words (submission rejected entirely)
export const HARD_BANNED_WORDS = [
  'porn', 'pornography', 'cp', 'nigga', 'nigger', 'dick', 'penis', 'vagina',
  'pussy', 'cock', 'cum', 'semen', 'rape', 'rapist', 'molest', 'pedophile',
  'paedophile', 'pedo', 'incest', 'bestiality', 'necrophilia', 'hentai',
  'xxx', 'nude', 'nudes', 'naked', 'genitals', 'genital', 'anus', 'anal',
  'blowjob', 'handjob', 'masturbate', 'masturbation', 'orgasm', 'erection',
  'ejaculate', 'ejaculation', 'whore', 'slut', 'prostitute', 'hooker',
  'faggot', 'fag', 'retard', 'retarded', 'cunt', 'twat', 'wanker',
  'kike', 'spic', 'chink', 'gook', 'wetback', 'beaner',
];

// Soft-profanity words (allowed up to 30% of total words)
export const SOFT_PROFANITY_WORDS = [
  'fuck', 'fucking', 'fucked', 'fucker', 'fucks',
  'shit', 'shitty', 'shitting', 'bullshit',
  'ass', 'asshole', 'asses',
  'damn', 'damned', 'dammit',
  'hell', 'bitch', 'bitches', 'bitchy',
  'bastard', 'bastards', 'crap', 'crappy',
  'piss', 'pissed', 'pissing',
];
