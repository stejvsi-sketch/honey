import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/constants';
import BurnForm from '@/components/BurnForm';

export const metadata: Metadata = {
  title: 'Write & Burn',
  description: 'Write an anonymous unsent letter and watch it burn. Nothing is saved. Pure catharsis.',
  alternates: { canonical: `${SITE_URL}/burn` },
  openGraph: {
    title: 'Write & Burn — Honey, If Only',
    description: 'Write the words you can\'t say. Then watch them burn. Nothing is saved.',
    url: `${SITE_URL}/burn`,
  },
};

export default function BurnPage() {
  return (
    <div className="page page--narrow">
      <div className="page__header">
        <h1 className="page__title">Write &amp; Burn</h1>
        <p className="page__subtitle">
          Write it down. Watch it burn. Nothing is saved. No one will ever see it.
        </p>
      </div>
      <BurnForm />

      {/* Internal links */}
      <div style={{ marginTop: '48px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
          Want your words to last? Submit them to the archive instead.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          <Link href="/write" style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Write a Letter</Link>
          <Link href="/collections" style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Collections</Link>
          <Link href="/letters" style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Read Letters</Link>
          <Link href="/journal" style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Journal</Link>
        </div>
      </div>
    </div>
  );
}
