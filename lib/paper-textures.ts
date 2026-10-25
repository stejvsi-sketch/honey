import type { CSSProperties } from 'react';

export const DEFAULT_PAPER = {
  id: 'rough-paper', name: 'Classic paper',
  image: 'rough-paper.webp', preview: 'rough-paper.webp', mask: 'rough-paper.webp',
} as const;

export const PAPER_DESIGNS = [
  { id: 'aged-torn-stack', name: 'Torn parchment', image: 'aged-torn-stack.webp', preview: 'aged-torn-stack-thumb.webp', mask: 'aged-torn-stack-mask.webp' },
  { id: 'distressed-lined', name: 'Lined notebook', image: 'distressed-lined.webp', preview: 'distressed-lined-thumb.webp', mask: 'distressed-lined-mask.webp' },
  { id: 'vintage-torn-pieces', name: 'Folded letter', image: 'vintage-torn-pieces.webp', preview: 'vintage-torn-pieces-thumb.webp', mask: 'vintage-torn-pieces-mask.webp' },
  { id: 'rough-rice-paper', name: 'Rice paper', image: 'rough-rice-paper.webp', preview: 'rough-rice-paper-thumb.webp', mask: 'rough-rice-paper-mask.webp' },
  { id: 'torn-green-rough', name: 'Rough torn paper', image: 'torn-green-rough.webp', preview: 'torn-green-rough-thumb.webp', mask: 'torn-green-rough-mask.webp' },
  { id: 'worn-aged-paring', name: 'Aged note', image: 'worn-aged-paring.webp', preview: 'worn-aged-paring-thumb.webp', mask: 'worn-aged-paring-mask.webp' },
] as const;

export const DEFAULT_PAPER_ID = DEFAULT_PAPER.id;
export type PaperId = typeof DEFAULT_PAPER_ID | typeof PAPER_DESIGNS[number]['id'];

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
  'vintage-torn-pieces': { brandTop: '10%', contentTop: '6.25rem', brandShiftY: '2px' },
  'worn-aged-paring': { brandTop: '8%', contentTop: '5.5rem' },
};

/** Unknown or retired paper IDs render as the original default design. */
export function getPaperTextureStyle(paperId?: string | null): PaperTextureStyle {
  const optionalDesign = PAPER_DESIGNS.find(paper => paper.id === paperId);
  const isDefaultPaper = paperId === DEFAULT_PAPER_ID;
  const isRetiredPaper = paperId != null && !isDefaultPaper && optionalDesign == null;
  const effectivePaperId = isRetiredPaper ? null : paperId;
  const design = isDefaultPaper ? DEFAULT_PAPER : optionalDesign ?? DEFAULT_PAPER;
  const cardLayout = effectivePaperId == null ? undefined : PAPER_CARD_LAYOUT[design.id];

  return {
    '--paper-texture': `url('/textures/${design.image}')`,
    '--paper-mask': `url('/textures/${design.mask}')`,
    ...(effectivePaperId != null && cardLayout
      ? {
          '--paper-brand-top': cardLayout.brandTop,
          '--paper-content-top': cardLayout.contentTop,
          ...(cardLayout.brandShiftX ? { '--paper-brand-shift-x': cardLayout.brandShiftX } : {}),
          ...(cardLayout.brandShiftY ? { '--paper-brand-shift-y': cardLayout.brandShiftY } : {}),
          ...(cardLayout.copyWidth ? { '--paper-copy-width': cardLayout.copyWidth } : {}),
          ...(cardLayout.tableCopyWidth ? { '--paper-table-copy-width': cardLayout.tableCopyWidth } : {}),
        }
      : {}),
    ...(effectivePaperId != null && design.id !== DEFAULT_PAPER_ID
      ? {
          // Match every new paper's visible footprint to the original asset.
          '--paper-art-inset-x': '4.75%',
          '--paper-art-inset-y': '2.5%',
        }
      : {}),
    // Missing and retired IDs retain the original default insets.
    ...(effectivePaperId == null
      ? {}
      : {
          '--paper-texture-inset': '0px',
          ...(design.id === DEFAULT_PAPER_ID ? {} : { '--paper-color-inset': '0px' }),
        }),
  } as PaperTextureStyle;
}
