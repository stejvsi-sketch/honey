import type { CSSProperties } from 'react';
import { MAX_WORDS } from './constants';

export const PAPER_DESIGNS = [
  { id: 'rough-paper', name: 'Classic paper', image: 'rough-paper.webp', preview: 'rough-paper.webp', mask: 'rough-paper.webp' },
  { id: 'aged-torn-stack', name: 'Torn parchment', image: 'aged-torn-stack.webp', preview: 'aged-torn-stack-thumb.webp', mask: 'aged-torn-stack-mask.webp' },
  { id: 'distressed-lined', name: 'Lined notebook', image: 'distressed-lined.webp', preview: 'distressed-lined-thumb.webp', mask: 'distressed-lined-mask.webp' },
  { id: 'vintage-torn-pieces', name: 'Folded letter', image: 'vintage-torn-pieces.webp', preview: 'vintage-torn-pieces-thumb.webp', mask: 'vintage-torn-pieces-mask.webp' },
  { id: 'rough-rice-paper', name: 'Rice paper', image: 'rough-rice-paper.webp', preview: 'rough-rice-paper-thumb.webp', mask: 'rough-rice-paper-mask.webp' },
  { id: 'rough-vintage-frame', name: 'Weathered paper', image: 'rough-vintage-frame.webp', preview: 'rough-vintage-frame-thumb.webp', mask: 'rough-vintage-frame-mask.webp' },
  { id: 'torn-green-rough', name: 'Rough torn paper', image: 'torn-green-rough.webp', preview: 'torn-green-rough-thumb.webp', mask: 'torn-green-rough-mask.webp' },
  { id: 'vintage-scrapbook', name: 'Scrapbook paper', image: 'vintage-scrapbook.webp', preview: 'vintage-scrapbook-thumb.webp', mask: 'vintage-scrapbook-mask.webp' },
  { id: 'worn-aged-paring', name: 'Aged note', image: 'worn-aged-paring.webp', preview: 'worn-aged-paring-thumb.webp', mask: 'worn-aged-paring-mask.webp' },
] as const;

export type PaperId = typeof PAPER_DESIGNS[number]['id'];
export const DEFAULT_PAPER_ID: PaperId = 'rough-paper';
export const SCRAPBOOK_MAX_WORDS = 15;

export function getPaperWordLimit(paperId: string): number {
  return paperId === 'vintage-scrapbook' ? SCRAPBOOK_MAX_WORDS : MAX_WORDS;
}

type PaperTextureStyle = CSSProperties & {
  '--paper-texture': string;
  '--paper-mask': string;
  '--paper-texture-inset'?: string;
  '--paper-color-inset'?: string;
  '--paper-brand-top'?: string;
  '--paper-brand-shift-x'?: string;
  '--paper-brand-shift-y'?: string;
  '--paper-content-top'?: string;
  '--paper-copy-width'?: string;
  '--paper-table-copy-width'?: string;
  '--paper-art-inset-x'?: string;
  '--paper-art-inset-y'?: string;
};

const PAPER_CARD_LAYOUT: Partial<Record<PaperId, {
  brandTop: string;
  contentTop: string;
  copyWidth?: string;
  tableCopyWidth?: string;
  brandShiftX?: string;
  brandShiftY?: string;
}>> = {
  'aged-torn-stack': { brandTop: '10%', contentTop: '6.25rem' },
  'rough-rice-paper': { brandTop: '9%', contentTop: '6rem' },
  'torn-green-rough': {
    brandTop: '8%', contentTop: '5.75rem', copyWidth: '90%',
  },
  'vintage-scrapbook': {
    brandTop: '12%', contentTop: 'clamp(6rem, 27vw, 7rem)',
    copyWidth: '86%', tableCopyWidth: '80%', brandShiftX: '18px', brandShiftY: '8px',
  },
  'vintage-torn-pieces': { brandTop: '10%', contentTop: '6.25rem' },
  'worn-aged-paring': { brandTop: '8%', contentTop: '5.5rem' },
};

/** Existing letters have no paper_id, so they keep the original paper design. */
export function getPaperTextureStyle(paperId?: string | null): PaperTextureStyle {
  const design = PAPER_DESIGNS.find(paper => paper.id === paperId)
    ?? PAPER_DESIGNS[0];
  const cardLayout = PAPER_CARD_LAYOUT[design.id];

  return {
    '--paper-texture': `url('/textures/${design.image}')`,
    '--paper-mask': `url('/textures/${design.mask}')`,
    ...(paperId != null && cardLayout
      ? {
          '--paper-brand-top': cardLayout.brandTop,
          '--paper-content-top': cardLayout.contentTop,
          ...(cardLayout.brandShiftX ? { '--paper-brand-shift-x': cardLayout.brandShiftX } : {}),
          ...(cardLayout.brandShiftY ? { '--paper-brand-shift-y': cardLayout.brandShiftY } : {}),
          ...(cardLayout.copyWidth ? { '--paper-copy-width': cardLayout.copyWidth } : {}),
          ...(cardLayout.tableCopyWidth ? { '--paper-table-copy-width': cardLayout.tableCopyWidth } : {}),
        }
      : {}),
    ...(paperId != null && design.id !== 'rough-paper'
      ? {
          // Match every new paper's visible footprint to the original asset.
          '--paper-art-inset-x': '4.75%',
          '--paper-art-inset-y': '2.5%',
        }
      : {}),
    // New submissions store a paper_id. Legacy letters and the burn card do
    // not, so they keep the original inset and appearance.
    ...(paperId == null
      ? {}
      : {
          '--paper-texture-inset': '0px',
          ...(design.id === 'rough-paper' ? {} : { '--paper-color-inset': '0px' }),
        }),
  } as PaperTextureStyle;
}
