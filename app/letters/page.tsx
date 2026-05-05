import type { Metadata } from 'next';
import LettersArchive from '@/components/LettersArchive';

export const metadata: Metadata = {
  title: 'Letters — All Unsent Words',
  description: 'Browse through all the unsent letters — anonymous messages from people who never got to say what they felt.',
};

export default function LettersPage() {
  return (
    <div className="page">
      <LettersArchive />
    </div>
  );
}
