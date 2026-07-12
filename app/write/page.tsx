import type { Metadata } from 'next';
import SubmitForm from '@/components/SubmitForm';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Write a Letter',
  description: 'Write an anonymous unsent letter to someone you never got to tell. Your words will be kept safe.',
  alternates: { canonical: `${SITE_URL}/write` },
  openGraph: {
    title: 'Write a Letter',
    description: 'Write an anonymous unsent letter to someone you never got to tell.',
    url: `${SITE_URL}/write`,
  },
};

export default function WritePage() {
  return (
    <div className="page page--narrow">
      <div className="page__header">
        <h1 className="page__title">Write a Letter</h1>
        <p className="page__subtitle">
          Say what you never could. Your letter will be written on paper and shared anonymously.
        </p>
      </div>
      <SubmitForm />
    </div>
  );
}
