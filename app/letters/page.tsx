import type { Metadata } from 'next';
import LettersArchive from '@/components/LettersArchive';

export const metadata: Metadata = {
  title: 'Letters — All Unsent Words',
  description: 'Browse through all the unsent letters — anonymous messages from people who never got to say what they felt.',
};

export default function LettersPage() {
  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">All Letters</h1>
        <p className="page__subtitle">Every unsent word, every unspoken thought — all gathered here.</p>
      </div>
      <LettersArchive />
    </div>
  );
}
