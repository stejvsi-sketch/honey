import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { COLOR_MEANINGS } from '@/lib/color-meanings';
import type { CardColorId } from '@/lib/constants';
import { getMemoriesByColor } from '@/lib/data';
import ColorArchive from '@/components/ColorArchive';

type Props = {
  params: Promise<{ color: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { color } = await params;
  const meaning = COLOR_MEANINGS[color as CardColorId];

  if (!meaning) return { title: 'Not Found' };

  return {
    title: `${meaning.name} Color Meaning in Unsent Messages | ${SITE_NAME}`,
    description: `Explore what ${meaning.name} represents in unsent messages and read anonymous letters expressing ${meaning.emotion.toLowerCase()}.`,
    keywords: meaning.seoKeywords.join(', '),
    alternates: {
      canonical: `${SITE_URL}/colors/${color}`,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(COLOR_MEANINGS).map((color) => ({
    color,
  }));
}

export default async function ColorPage({ params }: Props) {
  const { color } = await params;
  const meaning = COLOR_MEANINGS[color as CardColorId];

  if (!meaning) {
    notFound();
  }

  // Pre-fetch the first page to pass down as initial total
  const { total } = await getMemoriesByColor(color, 1, 10);

  return (
    <div className="page__container">
      <div className="page__header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: meaning.hex, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
          <h1 className="page__title" style={{ margin: 0 }}>{meaning.name}</h1>
        </div>
        <p className="page__subtitle" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, fontSize: '0.85rem' }}>
          {meaning.emotion}
        </p>
      </div>

      <div className="prose" style={{ marginBottom: '48px', textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
          {meaning.longDescription}
        </p>
        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>
          Browsing {total} {total === 1 ? 'letter' : 'letters'}
        </p>
      </div>

      <ColorArchive colorId={color} colorName={meaning.name} initialTotal={total} />
    </div>
  );
}
