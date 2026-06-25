import Link from 'next/link';
import type { ReactNode } from 'react';
import { COLOR_MEANINGS } from '@/lib/color-meanings';

type Rule = { match: string; href: string };

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Build the ordered set of auto-link rules. Each href is linked at most once per
 * article (first occurrence), so the order here is the priority order.
 */
function buildRules(currentSlug: string): Rule[] {
  const rules: Rule[] = [];

  // Color meanings -> /colors/[id]
  for (const c of Object.values(COLOR_MEANINGS)) {
    rules.push({ match: c.name, href: `/colors/${c.id}` });
  }

  // Curated collection phrases -> /collections/[slug]
  rules.push(
    { match: 'unsent messages to an ex', href: '/collections/unsent-messages-to-ex' },
    { match: 'unsent messages to a crush', href: '/collections/unsent-messages-to-crush' },
    { match: 'anonymous love messages', href: '/collections/anonymous-love-messages' },
    { match: 'messages you never sent', href: '/collections/messages-you-never-sent' },
    { match: 'apologies never sent', href: '/collections/apologies-never-sent' },
    { match: 'final goodbyes', href: '/collections/final-goodbyes' },
  );

  // Pillar / cluster + conversion CTAs
  rules.push(
    { match: 'unsent project alternative', href: '/journal/unsent-project-alternative' },
    { match: 'websites similar to the unsent project', href: '/journal/websites-similar-to-the-unsent-project' },
    { match: 'sites like the unsent project', href: '/journal/websites-similar-to-the-unsent-project' },
    { match: 'write a letter', href: '/write' },
  );

  // Never let a post link to itself.
  return rules.filter(r => r.href !== `/journal/${currentSlug}`);
}

const MAX_LINKS = 8;

const linkStyle = {
  color: 'var(--text)',
  textDecoration: 'underline',
  textUnderlineOffset: '2px',
  textDecorationColor: 'var(--border-light)',
} as const;

type Ctx = {
  used: Set<string>;
  rules: Rule[];
  count: { n: number };
  key: { i: number };
};

/** Recursively replace the earliest unused link term in `text` with a <Link>. */
function linkify(text: string, ctx: Ctx): ReactNode[] {
  if (!text || ctx.count.n >= MAX_LINKS) return [text];

  let bestIdx = -1;
  let bestLen = 0;
  let bestHref = '';
  let bestText = '';

  for (const rule of ctx.rules) {
    if (ctx.used.has(rule.href)) continue;
    const re = new RegExp(`\\b${escapeRegExp(rule.match)}\\b`, 'i');
    const m = re.exec(text);
    if (m && (bestIdx === -1 || m.index < bestIdx)) {
      bestIdx = m.index;
      bestLen = m[0].length;
      bestHref = rule.href;
      bestText = m[0];
    }
  }

  if (bestIdx === -1) return [text];

  ctx.used.add(bestHref);
  ctx.count.n++;

  const before = text.slice(0, bestIdx);
  const after = text.slice(bestIdx + bestLen);

  return [
    before,
    <Link key={`l${ctx.key.i++}`} href={bestHref} style={linkStyle}>{bestText}</Link>,
    ...linkify(after, ctx),
  ];
}

/** Render *italics* / **bold** and apply auto-linking within plain runs. */
function renderInline(text: string, ctx: Ctx): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  const out: ReactNode[] = [];

  for (const part of parts) {
    if (!part) continue;
    if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
      out.push(<strong key={`b${ctx.key.i++}`}>{linkify(part.slice(2, -2), ctx)}</strong>);
    } else if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
      out.push(<em key={`i${ctx.key.i++}`}>{linkify(part.slice(1, -1), ctx)}</em>);
    } else {
      out.push(...linkify(part, ctx));
    }
  }

  return out;
}

/**
 * Renders journal article body text as real paragraphs with inline markdown
 * (*italics*, **bold**) and a small number of contextual internal links.
 */
export default function JournalContent({ content, slug }: { content: string; slug: string }) {
  const ctx: Ctx = {
    used: new Set<string>(),
    rules: buildRules(slug),
    count: { n: 0 },
    key: { i: 0 },
  };

  const paragraphs = content.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);

  return (
    <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-muted)' }}>
      {paragraphs.map((p, i) => (
        <p key={i} style={{ margin: '0 0 1.5em' }}>{renderInline(p, ctx)}</p>
      ))}
    </div>
  );
}
