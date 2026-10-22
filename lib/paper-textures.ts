import type { CSSProperties } from 'react';

const PAPER_TEXTURE_FILES = [
  'rough-paper.webp',
  'aged-torn-stack.webp',
  'distressed-lined.webp',
  'vintage-torn-pieces.webp',
  'rough-rice-paper.webp',
  'rough-vintage-frame.webp',
  'torn-green-rough.webp',
  'vintage-scrapbook.webp',
  'worn-aged-paring.webp',
] as const;

type PaperTextureStyle = CSSProperties & {
  '--paper-texture': string;
  '--paper-texture-opacity': number;
};

function hashSeed(seed: string): number {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

/** Assign a stable paper texture to a letter without adding a database field. */
export function getPaperTextureStyle(seed?: string | null): PaperTextureStyle {
  const file = seed
    ? PAPER_TEXTURE_FILES[hashSeed(seed) % PAPER_TEXTURE_FILES.length]
    : PAPER_TEXTURE_FILES[0];

  return {
    '--paper-texture': `url('/textures/${file}')`,
    // Keep the existing paper as-is; soften the added designs behind letter text.
    '--paper-texture-opacity': file === 'rough-paper.webp' ? 1 : 0.35,
  } as PaperTextureStyle;
}
