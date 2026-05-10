import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getMemoryById } from '@/lib/data';
import { CARD_COLORS, SITE_NAME, SITE_URL } from '@/lib/constants';
import { formatSubmittedName } from '@/lib/names';

export const revalidate = 18000;

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await props.params;
  const memory = await getMemoryById(id);
  if (!memory) return { title: 'Letter Not Found' };

  const displayName = formatSubmittedName(memory.name);
  const letterUrl = `${SITE_URL}/letter/${memory.id}`;
  const description = `"${memory.message.slice(0, 140)}" - an anonymous unsent letter and message to ${displayName} on ${SITE_NAME}.`;

  return {
    title: `Unsent Letter to ${displayName}`,
    description,
    alternates: { canonical: letterUrl },
    openGraph: {
      title: `Unsent Letter to ${displayName}`,
      description,
      url: letterUrl,
    },
  };
}

export default async function LetterPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const memory = await getMemoryById(id);
  if (!memory) notFound();

  const color = CARD_COLORS.find(c => c.id === memory.color_id);
  const hex = color?.hex || '#f5e6d0';
  const displayName = formatSubmittedName(memory.name);
  const letterUrl = `${SITE_URL}/letter/${memory.id}`;
  const recipientUrl = `${SITE_URL}/to/${memory.slug}`;
  const date = new Date(memory.created_at);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SocialMediaPosting',
    url: letterUrl,
    name: `Unsent letter to ${displayName}`,
    headline: `Unsent letter to ${displayName}`,
    datePublished: memory.created_at,
    text: memory.message,
    author: {
      '@type': 'Person',
      name: 'Anonymous contributor',
    },
    about: {
      '@type': 'Person',
      name: displayName,
      url: recipientUrl,
    },
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <div className="letter-single">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="letter-single__card">
        <div className="memory-card card-animate" style={{ margin: '0 auto' }}>
          <div className="memory-card__bg">
            <div className="memory-card__color" style={{ backgroundColor: hex }} />
            <div className="memory-card__texture" />
          </div>
          <div className="memory-card__content">
            <div className="memory-card__header">
              <span className="memory-card__brand">{SITE_NAME.toLowerCase()}</span>
            </div>
            <Link href={`/to/${memory.slug}`} className="memory-card__name">
              To {displayName}
            </Link>
            <div className="memory-card__message"><span>{memory.message}</span></div>
          </div>
        </div>
      </div>
      <div className="letter-single__meta">
        <p>{formattedDate} at {formattedTime}</p>
      </div>
      <div style={{ marginTop: 32 }}>
        <Link href="/letters" className="btn btn--outline" style={{ width: 'auto', display: 'inline-flex' }}>
          Back to Letters
        </Link>
      </div>
    </div>
  );
}
