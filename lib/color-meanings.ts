import type { CardColorId } from './constants';

export interface ColorMeaning {
  id: CardColorId;
  name: string;
  hex: string;
  shortDescription: string;
  longDescription: string;
  emotion: string;
  seoKeywords: string[];
}

export const COLOR_MEANINGS: Record<CardColorId, ColorMeaning> = {
  'parchment': {
    id: 'parchment',
    name: 'Parchment',
    hex: '#f5e6d0',
    shortDescription: 'Nostalgia, purity, and timeless love.',
    longDescription: "Parchment represents the classic, enduring nature of love and memory. People choose Parchment for letters that feel timeless—apologies that are long overdue, confessions of a pure first love, or words that have been held onto for years. It speaks to a nostalgia that isn't necessarily sad, but deeply rooted in the past.",
    emotion: 'Nostalgic & Enduring',
    seoKeywords: ['parchment color meaning', 'nostalgic love letters', 'first love confessions'],
  },
  'rose-dust': {
    id: 'rose-dust',
    name: 'Rose Dust',
    hex: '#e8c4c4',
    shortDescription: 'Romance, lingering affection, and gentle heartbreak.',
    longDescription: 'Rose Dust captures the fading but beautiful remnants of a romantic connection. It is the color of lingering affection and gentle heartbreak. Letters written in Rose Dust often contain unspoken confessions of love, "what if" scenarios, and the soft ache of missing someone who used to be everything.',
    emotion: 'Romantic & Ache',
    seoKeywords: ['rose dust color meaning', 'romantic unsent letters', 'unspoken love confessions', 'missing ex messages'],
  },
  'sage-whisper': {
    id: 'sage-whisper',
    name: 'Sage Whisper',
    hex: '#c4d4c4',
    shortDescription: 'Healing, growth, and finding peace.',
    longDescription: 'Sage Whisper is the color of moving on. It represents healing, personal growth, and the quiet peace that comes after a storm. Submitters use Sage Whisper when they are finally letting go, offering forgiveness (to themselves or others), or acknowledging how much a past relationship helped them grow.',
    emotion: 'Healing & Peaceful',
    seoKeywords: ['sage color meaning', 'healing after a breakup', 'forgiveness letters', 'letting go messages'],
  },
  'lavender-haze': {
    id: 'lavender-haze',
    name: 'Lavender Haze',
    hex: '#d4c4e0',
    shortDescription: 'Confusion, mystery, and unresolved feelings.',
    longDescription: 'Lavender Haze embodies the confusing, mystical space between friendship and love. It is the color of "almost relationships," situationships, and unresolved feelings. Letters in this color often ask "why?" or express the disorientation of a sudden ghosting or a love that never quite materialized.',
    emotion: 'Confused & Unresolved',
    seoKeywords: ['lavender color meaning', 'situationship letters', 'ghosted messages', 'unresolved feelings'],
  },
  'honey-gold': {
    id: 'honey-gold',
    name: 'Honey Gold',
    hex: '#e8d49c',
    shortDescription: 'Warmth, gratitude, and cherished memories.',
    longDescription: 'Honey Gold shines with warmth and gratitude. Even when a relationship has ended, the memories remain golden. Letters written in Honey Gold are often thank-you notes to exes, expressions of platonic love for friends who drifted away, or joyful reflections on a time that was beautiful while it lasted.',
    emotion: 'Warm & Grateful',
    seoKeywords: ['gold color meaning', 'gratitude to an ex', 'thank you letters', 'cherished memories'],
  },
  'ocean-mist': {
    id: 'ocean-mist',
    name: 'Ocean Mist',
    hex: '#b8ccd8',
    shortDescription: 'Distance, clarity, and cold truths.',
    longDescription: 'Ocean Mist carries the chill of distance and the starkness of clarity. It is used for letters that deliver cold truths, establish boundaries, or reflect on a relationship from a distant, detached perspective. It is the color of a heart that has cooled down and finally sees things exactly as they were.',
    emotion: 'Distant & Clear',
    seoKeywords: ['blue color meaning', 'distant love letters', 'setting boundaries', 'cold truths'],
  },
  'blush-coral': {
    id: 'blush-coral',
    name: 'Blush Coral',
    hex: '#e0b4a8',
    shortDescription: 'Passion, urgency, and unspoken attraction.',
    longDescription: 'Blush Coral is vibrant with passion and urgency. It is the color of sudden crushes, intense infatuations, and unspoken attraction. Letters in this hue are often desperate confessions, written by people who are bursting with feelings they cannot say out loud.',
    emotion: 'Passionate & Urgent',
    seoKeywords: ['coral color meaning', 'urgent love letters', 'crush confessions', 'intense attraction'],
  },
  'dusty-mauve': {
    id: 'dusty-mauve',
    name: 'Dusty Mauve',
    hex: '#c8a8b8',
    shortDescription: 'Regret, apologies, and the weight of mistakes.',
    longDescription: 'Dusty Mauve carries the heavy, somber weight of regret. It is the color of apologies that were never delivered and mistakes that cannot be undone. Writers choose Dusty Mauve when they are taking accountability for being the toxic partner, or when they are burdened by the guilt of how they treated someone.',
    emotion: 'Regretful & Apologetic',
    seoKeywords: ['mauve color meaning', 'apology letters', 'regret messages', 'toxic partner confessions'],
  },
  'faded-denim': {
    id: 'faded-denim',
    name: 'Faded Denim',
    hex: '#a8b8c8',
    shortDescription: 'Melancholy, everyday sadness, and missing the routine.',
    longDescription: "Faded Denim is the color of ordinary, everyday melancholy. It isn't a dramatic, screaming heartbreak; it is the quiet sadness of missing someone on a random Tuesday. Letters in Faded Denim often focus on the little things—missing a shared routine, an inside joke, or the comfortable silence of a long-term relationship.",
    emotion: 'Melancholic & Routine',
    seoKeywords: ['denim color meaning', 'everyday heartbreak', 'missing the routine', 'quiet sadness'],
  },
  'ivory-ash': {
    id: 'ivory-ash',
    name: 'Ivory Ash',
    hex: '#e0dcd4',
    shortDescription: 'Finality, emptiness, and the end of the line.',
    longDescription: 'Ivory Ash represents the absolute end. It is the color of burnout, emptiness, and finality. Letters written in Ivory Ash are often the absolute last thing a person needs to say before completely closing the door on a relationship. It is the ashes left behind after the fire has entirely burned out.',
    emotion: 'Final & Empty',
    seoKeywords: ['ash color meaning', 'final goodbyes', 'end of a relationship', 'empty feelings'],
  },
};
