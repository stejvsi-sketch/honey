import type { Metadata } from 'next';
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
    </div>
  );
}
