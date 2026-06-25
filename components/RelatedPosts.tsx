import Link from 'next/link';
import { JOURNAL_POSTS, type JournalPost } from '@/lib/journal-data';

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'your', 'you', 'are', 'why', 'how', 'what',
  'his', 'her', 'him', 'she', 'they', 'this', 'that', 'its', 'not', 'vs',
  'after', 'from', 'does', 'was', 'were', 'will', 'can', 'about', 'when',
  'who', 'our', 'their', 'into', 'have', 'has', 'but', 'all',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

/**
 * Renders a "Continue Reading" block of related journal posts. Uses an explicit
 * `related` list when present, otherwise falls back to slug/title token overlap.
 */
export default function RelatedPosts({ slug, limit = 4 }: { slug: string; limit?: number }) {
  const current = JOURNAL_POSTS.find(p => p.slug === slug);
  if (!current) return null;

  let related: JournalPost[];

  if (current.related && current.related.length > 0) {
    related = current.related
      .map(s => JOURNAL_POSTS.find(p => p.slug === s))
      .filter((p): p is JournalPost => Boolean(p))
      .slice(0, limit);
  } else {
    const currentTokens = new Set(tokenize(`${current.slug} ${current.title}`));
    related = JOURNAL_POSTS
      .filter(p => p.slug !== slug)
      .map(p => ({
        post: p,
        score: tokenize(`${p.slug} ${p.title}`).reduce((n, t) => n + (currentTokens.has(t) ? 1 : 0), 0),
      }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(x => x.post);
  }

  if (related.length === 0) return null;

  return (
    <section style={{ marginTop: '64px', paddingTop: '40px', borderTop: '1px solid var(--border-light)' }}>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '24px', color: 'var(--text)' }}>
        Continue Reading
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {related.map(post => (
          <Link key={post.slug} href={`/journal/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <article>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '6px', color: 'var(--text)' }}>
                {post.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                {post.excerpt.length > 140 ? `${post.excerpt.slice(0, 140).trimEnd()}…` : post.excerpt}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
