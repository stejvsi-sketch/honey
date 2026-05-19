import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { STORIES } from '@/lib/stories';
import { SITE_URL } from '@/lib/constants';

export async function generateMetadata(
  props: { params: Promise<{ slug: string; chapter: string }> }
): Promise<Metadata> {
  const { slug, chapter: chapterNum } = await props.params;
  const story = STORIES.find(s => s.slug === slug);
  if (!story) return { title: 'Not Found' };

  const chapter = story.chapters.find(c => c.number === parseInt(chapterNum, 10));
  if (!chapter) return { title: 'Not Found' };

  const title = `Chapter ${chapter.number}: ${chapter.title}`;
  const description = `${title} from "${story.title}" by ${story.author}. ${story.synopsis}`;
  const canonicalUrl = `${SITE_URL}/stories/${story.slug}/${chapter.number}`;

  return {
    title: `${title} | ${story.title}`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${title} | ${story.title}`,
      description,
      url: canonicalUrl,
    },
  };
}

export async function generateStaticParams() {
  const params: { slug: string; chapter: string }[] = [];
  for (const story of STORIES) {
    for (const chapter of story.chapters) {
      params.push({ slug: story.slug, chapter: String(chapter.number) });
    }
  }
  return params;
}

export default async function ChapterPage(
  props: { params: Promise<{ slug: string; chapter: string }> }
) {
  const { slug, chapter: chapterNum } = await props.params;
  const story = STORIES.find(s => s.slug === slug);
  if (!story) notFound();

  const chapterIndex = parseInt(chapterNum, 10);
  const chapter = story.chapters.find(c => c.number === chapterIndex);
  if (!chapter) notFound();

  const prevChapter = story.chapters.find(c => c.number === chapterIndex - 1);
  const nextChapter = story.chapters.find(c => c.number === chapterIndex + 1);
  const isFirst = !prevChapter;
  const isLast = !nextChapter;

  return (
    <div className="page page--narrow">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '48px',
      }}>
        <Link
          href={`/stories/${story.slug}`}
          style={{ fontSize: '0.85rem', color: 'var(--text-light)', textDecoration: 'none' }}
        >
          {story.title}
        </Link>
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--text-light)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          {chapter.number} of {story.chapters.length}
        </span>
      </div>

      <article>
        <header style={{
          marginBottom: '48px',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '32px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--text-light)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            Chapter {chapter.number}
          </div>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.2rem',
            lineHeight: 1.2,
            color: 'var(--text)',
          }}>
            {chapter.title}
          </h1>
        </header>

        {chapter.epigraph && (
          <blockquote style={{
            fontStyle: 'italic',
            color: 'var(--text-light)',
            borderLeft: '2px solid var(--border-light)',
            paddingLeft: '20px',
            marginBottom: '48px',
            fontSize: '0.95rem',
            lineHeight: 1.7,
          }}>
            {chapter.epigraph}
          </blockquote>
        )}

        <div style={{
          fontSize: '1.05rem',
          lineHeight: 1.9,
          color: 'var(--text-muted)',
          whiteSpace: 'pre-wrap',
          fontFamily: 'var(--font-serif)',
        }}>
          {chapter.content}
        </div>
      </article>

      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '80px',
        paddingTop: '32px',
        borderTop: '1px solid var(--border-light)',
        gap: '16px',
      }}>
        {!isFirst ? (
          <Link
            href={`/stories/${story.slug}/${prevChapter.number}`}
            style={{
              textDecoration: 'none',
              color: 'var(--text)',
              fontSize: '0.85rem',
            }}
          >
            <span style={{
              display: 'block',
              fontSize: '0.7rem',
              color: 'var(--text-light)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}>
              Previous
            </span>
            {prevChapter.title}
          </Link>
        ) : (
          <div />
        )}

        {!isLast ? (
          <Link
            href={`/stories/${story.slug}/${nextChapter.number}`}
            style={{
              textDecoration: 'none',
              color: 'var(--text)',
              fontSize: '0.85rem',
              textAlign: 'right',
            }}
          >
            <span style={{
              display: 'block',
              fontSize: '0.7rem',
              color: 'var(--text-light)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}>
              Next
            </span>
            {nextChapter.title}
          </Link>
        ) : (
          <Link
            href={`/stories/${story.slug}`}
            style={{
              textDecoration: 'none',
              color: 'var(--text)',
              fontSize: '0.85rem',
              textAlign: 'right',
            }}
          >
            <span style={{
              display: 'block',
              fontSize: '0.7rem',
              color: 'var(--text-light)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}>
              Finished
            </span>
            Back to {story.title}
          </Link>
        )}
      </nav>

      {isLast && (
        <div style={{ marginTop: '80px', padding: '40px', background: 'rgba(255,255,255,0.4)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '16px' }}>Did this move you?</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
            Write your own truth. Distill it into 25 words. Let it go.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/write" className="btn" style={{ display: 'inline-block', width: 'auto', padding: '12px 32px' }}>
              Write a Letter
            </Link>
            <Link href="/stories" className="btn btn--outline" style={{ display: 'inline-block', width: 'auto', padding: '12px 32px' }}>
              More Stories
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
