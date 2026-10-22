import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getMemoryById } from '@/lib/data';
import { CARD_COLORS, SITE_NAME, SITE_URL } from '@/lib/constants';
import { formatSubmittedName } from '@/lib/names';
import ReportButton from '@/components/ReportButton';
import LetterFlipCard from '@/components/cards/LetterFlipCard';


export const revalidate = 18000;

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await props.params;
  const memory = await getMemoryById(id);
  if (!memory) return { title: 'Letter Not Found' };

  const displayName = formatSubmittedName(memory.name);
  const letterUrl = `${SITE_URL}/letter/${memory.id}`;
  const snippet = memory.message.slice(0, 140);
  const description = `"${snippet}" - a public unsent letter addressed to ${displayName} in the ${SITE_NAME} archive. Sender names may appear when supplied.`;

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
    robots: { index: false, follow: true },
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
    '@type': 'CreativeWork',
    url: letterUrl,
    name: `Unsent Letters and Messages to ${displayName}`,
    headline: `Unsent Letters and Messages to ${displayName}`,
    genre: 'unsent letter',
    inLanguage: 'en',
    datePublished: memory.created_at,
    text: memory.message,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Letters', item: `${SITE_URL}/letters` },
      { '@type': 'ListItem', position: 3, name: `Unsent Letters and Messages to ${displayName}`, item: letterUrl },
    ],
  };

  return (
    <div className="letter-single">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="page__header" style={{ marginBottom: '32px' }}>
        <h1 className="page__title">Unsent Letters and Messages to {displayName}</h1>
        <p className="page__subtitle">A public unsent letter addressed to {displayName}. A sender name may appear if supplied.</p>
      </div>
      <div className="letter-single__card">
        <LetterFlipCard
          hex={hex}
          slug={memory.slug}
          displayName={displayName}
          message={memory.message}
          paperId={memory.paper_id}
          fromName={memory.from_name}
          wishReply={memory.wish_reply}
        />
      </div>
      <div className="letter-single__meta">
        <p>{formattedDate} at {formattedTime}</p>
      </div>

      <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        <Link
          href="/letters"
          className="letter-single__back"
        >
          ← Back to Letters
        </Link>
        <ReportButton letterUrl={letterUrl} />
      </div>

    </div>
  );
}
