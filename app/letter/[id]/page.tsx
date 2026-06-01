import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getMemoryById, getNameCountForSlug } from '@/lib/data';
import { CARD_COLORS, SITE_NAME, SITE_URL } from '@/lib/constants';
import { formatSubmittedName } from '@/lib/names';

export const revalidate = 18000;

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await props.params;
  const memory = await getMemoryById(id);
  if (!memory) return { title: 'Letter Not Found' };

  const displayName = formatSubmittedName(memory.name);
  const letterUrl = `${SITE_URL}/letter/${memory.id}`;
  const snippet = memory.message.slice(0, 140);
  const description = `"${snippet}" - an anonymous unsent letter, message, and unspoken words to ${displayName} on ${SITE_NAME}. Things never said, love letters and messages never sent.`;

  // Canonical consolidation: if this name has a live aggregation page (≥5 letters
  // and real name), point canonical to /to/{slug} to consolidate SEO signals.
  const nameCount = await getNameCountForSlug(memory.slug);
  const isRealName = memory.slug.replace(/-/g, '').length >= 3;
  const hasAggregationPage = isRealName && nameCount >= 5;
  const canonicalUrl = hasAggregationPage
    ? `${SITE_URL}/to/${memory.slug}`
    : letterUrl;

  return {
    title: `Unsent Letters and Messages to ${displayName}`,
    description,
    keywords: [
      `unsent letter to ${displayName}`,
      `unsent message to ${displayName}`,
      `unsent messages to ${displayName}`,
      `unsent text to ${displayName}`,
      `message to ${displayName}`,
      `messages to ${displayName}`,
      `love letter to ${displayName}`,
      `letter to ${displayName} never sent`,
      `things I never said to ${displayName}`,
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `Unsent Letters and Messages to ${displayName}`,
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
    name: `Unsent Letters and Messages to ${displayName}`,
    headline: `Unsent Letters and Messages to ${displayName}`,
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
      <div className="page__header" style={{ marginBottom: '32px' }}>
        <h1 className="page__title">Unsent Letters and Messages to {displayName}</h1>
        <p className="page__subtitle">An anonymous unsent letter, message, and unspoken words to {displayName}.</p>
      </div>
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
