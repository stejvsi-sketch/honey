import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { COLOR_MEANINGS } from '@/lib/color-meanings';

export const metadata: Metadata = {
  title: `Unsent Messages Color Meanings | ${SITE_NAME}`,
  description: 'Learn how color meanings work in the archive and explore the emotions people associate with love, loss, and memory in their unsent messages.',
  alternates: {
    canonical: `${SITE_URL}/colors`,
  },
};

export default function ColorsIndexPage() {
  const colors = Object.values(COLOR_MEANINGS);

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">What Do the Colors Mean?</h1>
        <p className="page__subtitle">
          Explore the emotional context behind the colors of the archive.
        </p>
      </div>

      <div className="prose" style={{ marginBottom: '40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
        <p>
          Every unsent letter in the archive is tied to a specific color chosen by the writer. 
          While color is deeply subjective, these tags offer a glimpse into the emotional 
          state behind the unspoken words. From the passionate urgency of Blush Coral to the 
          quiet finality of Ivory Ash, discover what these colors represent and browse 
          messages that share the same feeling.
        </p>
      </div>

      <div className="hub-grid">
        {colors.map((color) => (
          <Link href={`/colors/${color.id}`} key={color.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="hub-card" style={{ 
              backgroundColor: color.hex, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{ color: 'rgba(20, 16, 12, 0.9)' }}>
                {color.name}
              </h2>
              <span style={{ color: 'rgba(20, 16, 12, 0.6)' }}>
                {color.emotion}
              </span>
              <p style={{ color: 'rgba(20, 16, 12, 0.8)' }}>
                {color.shortDescription}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
