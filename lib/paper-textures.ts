import type { CSSProperties } from 'react';

export const PAPER_DESIGNS = [
  { id: 'rough-paper', name: 'Classic paper', image: 'rough-paper.webp', preview: 'rough-paper.webp' },
  { id: 'aged-torn-stack', name: 'Torn parchment', image: 'aged-torn-stack.webp', preview: 'aged-torn-stack-thumb.webp' },
  { id: 'distressed-lined', name: 'Lined notebook', image: 'distressed-lined.webp', preview: 'distressed-lined-thumb.webp' },
  { id: 'vintage-torn-pieces', name: 'Folded letter', image: 'vintage-torn-pieces.webp', preview: 'vintage-torn-pieces-thumb.webp' },
  { id: 'rough-rice-paper', name: 'Rice paper', image: 'rough-rice-paper.webp', preview: 'rough-rice-paper-thumb.webp' },
  { id: 'rough-vintage-frame', name: 'Weathered paper', image: 'rough-vintage-frame.webp', preview: 'rough-vintage-frame-thumb.webp' },
  { id: 'torn-green-rough', name: 'Rough torn paper', image: 'torn-green-rough.webp', preview: 'torn-green-rough-thumb.webp' },
  { id: 'vintage-scrapbook', name: 'Scrapbook paper', image: 'vintage-scrapbook.webp', preview: 'vintage-scrapbook-thumb.webp' },
  { id: 'worn-aged-paring', name: 'Aged note', image: 'worn-aged-paring.webp', preview: 'worn-aged-paring-thumb.webp' },
] as const;

export type PaperId = typeof PAPER_DESIGNS[number]['id'];
export const DEFAULT_PAPER_ID: PaperId = 'rough-paper';

type PaperTextureStyle = CSSProperties & {
  '--paper-texture': string;
  '--paper-texture-inset'?: string;
  '--paper-texture-opacity'?: string;
};

/** Existing letters have no paper_id, so they keep the original paper design. */
export function getPaperTextureStyle(paperId?: string | null): PaperTextureStyle {
  const design = PAPER_DESIGNS.find(paper => paper.id === paperId)
    ?? PAPER_DESIGNS[0];

  return {
    '--paper-texture': `url('/textures/${design.image}')`,
    // New submissions store a paper_id. Legacy letters and the burn card do
    // not, so they keep the original inset and appearance.
    ...(paperId == null ? {} : { '--paper-texture-inset': '0px' }),
    // Softer blending keeps each selected card color visible through the
    // darker textures, both in the picker and on the published card.
    ...(design.id === DEFAULT_PAPER_ID ? {} : { '--paper-texture-opacity': '0.42' }),
  } as PaperTextureStyle;
}
