import type { CSSProperties } from 'react';

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

type PaperTextureStyle = CSSProperties & {
  '--paper-texture': string;
  '--paper-mask': string;
  '--paper-texture-inset'?: string;
  '--paper-color-inset'?: string;
  '--paper-brand-top'?: string;
  '--paper-content-top'?: string;
  '--paper-content-bottom'?: string;
  '--paper-copy-width'?: string;
  '--paper-table-copy-width'?: string;
  '--paper-message-font-size'?: string;
  '--paper-message-line-height'?: string;
  '--paper-long-message-font-size'?: string;
  '--paper-long-message-line-height'?: string;
  '--paper-brand-font-size'?: string;
  '--paper-brand-letter-spacing'?: string;
  '--paper-brand-padding-bottom'?: string;
  '--paper-brand-rule-margin'?: string;
};

const PAPER_CARD_LAYOUT: Partial<Record<PaperId, {
  brandTop: string;
  contentTop: string;
  contentBottom?: string;
  copyWidth?: string;
  tableCopyWidth?: string;
  messageFontSize?: string;
  messageLineHeight?: string;
  longMessageFontSize?: string;
  longMessageLineHeight?: string;
  brandFontSize?: string;
  brandLetterSpacing?: string;
  brandPaddingBottom?: string;
  brandRuleMargin?: string;
}>> = {
  'aged-torn-stack': { brandTop: '10%', contentTop: '4.75rem' },
  'rough-rice-paper': { brandTop: '9%', contentTop: '4.5rem' },
  'torn-green-rough': {
    brandTop: '8%', contentTop: '5.75rem', copyWidth: '90%',
    messageFontSize: '0.95rem', messageLineHeight: '1.4',
    longMessageFontSize: '0.78rem', longMessageLineHeight: '1.28',
  },
  'vintage-scrapbook': {
    brandTop: '12%', contentTop: 'clamp(3.75rem, 16vw, 5.75rem)', contentBottom: '3.5rem',
    copyWidth: '75%', tableCopyWidth: '66%',
    messageFontSize: '0.95rem', messageLineHeight: '1.4',
    longMessageFontSize: 'clamp(0.66rem, 3.8vw, 0.76rem)', longMessageLineHeight: '1.24',
    brandFontSize: '0.68rem', brandLetterSpacing: '0.07em',
    brandPaddingBottom: '0', brandRuleMargin: '2px auto 0',
  },
  'vintage-torn-pieces': { brandTop: '10%', contentTop: '5.75rem' },
  'worn-aged-paring': { brandTop: '8%', contentTop: '5rem' },
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
          ...(cardLayout.contentBottom ? { '--paper-content-bottom': cardLayout.contentBottom } : {}),
          ...(cardLayout.copyWidth ? { '--paper-copy-width': cardLayout.copyWidth } : {}),
          ...(cardLayout.tableCopyWidth ? { '--paper-table-copy-width': cardLayout.tableCopyWidth } : {}),
          ...(cardLayout.messageFontSize ? { '--paper-message-font-size': cardLayout.messageFontSize } : {}),
          ...(cardLayout.messageLineHeight ? { '--paper-message-line-height': cardLayout.messageLineHeight } : {}),
          ...(cardLayout.longMessageFontSize ? { '--paper-long-message-font-size': cardLayout.longMessageFontSize } : {}),
          ...(cardLayout.longMessageLineHeight ? { '--paper-long-message-line-height': cardLayout.longMessageLineHeight } : {}),
          ...(cardLayout.brandFontSize ? { '--paper-brand-font-size': cardLayout.brandFontSize } : {}),
          ...(cardLayout.brandLetterSpacing ? { '--paper-brand-letter-spacing': cardLayout.brandLetterSpacing } : {}),
          ...(cardLayout.brandPaddingBottom ? { '--paper-brand-padding-bottom': cardLayout.brandPaddingBottom } : {}),
          ...(cardLayout.brandRuleMargin ? { '--paper-brand-rule-margin': cardLayout.brandRuleMargin } : {}),
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
