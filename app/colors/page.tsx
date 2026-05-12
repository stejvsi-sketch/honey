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
    <div className="page__container">
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

      <div className="color-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '24px', padding: '0 16px' }}>
        {colors.map((color) => (
          <Link href={`/colors/${color.id}`} key={color.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="color-card" style={{ 
              backgroundColor: color.hex, 
              padding: '32px 24px', 
              borderRadius: '16px',
              transition: 'transform 0.2s ease',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px', color: 'rgba(20, 16, 12, 0.9)' }}>
                {color.name}
              </h2>
              <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, color: 'rgba(20, 16, 12, 0.6)', marginBottom: '16px', display: 'block' }}>
                {color.emotion}
              </span>
              <p style={{ color: 'rgba(20, 16, 12, 0.8)', lineHeight: 1.5, fontSize: '0.95rem' }}>
                {color.shortDescription}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
