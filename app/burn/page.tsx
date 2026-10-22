import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';
import BurnForm from '@/components/BurnForm';

export const metadata: Metadata = {
  title: 'Write & Burn',
  description: 'Write a temporary draft in the burn tool and watch it disappear. Text is not submitted to the public archive.',
  alternates: { canonical: `${SITE_URL}/burn` },
  openGraph: {
    title: 'Write & Burn — Honey, If Only',
    description: 'Write a draft in the burn tool and watch it disappear. Text is not submitted to the public archive.',
    url: `${SITE_URL}/burn`,
  },
};

export default function BurnPage() {
  return (
    <div className="page page--narrow">
      <div className="page__header">
        <h1 className="page__title">Write &amp; Burn</h1>
        <p className="page__subtitle">
          Write it down and watch it burn. This tool does not submit your text to the public archive; avoid details you do not want others to see on your screen.
        </p>
      </div>
      <BurnForm />
    </div>
  );
}
