import type { Metadata } from 'next';
import ConfessionMode from '@/components/ConfessionMode';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Confess',
  description: 'Write into the void. Say what you never said. Your words will glow in the dark — and reveal the words of others.',
  alternates: { canonical: `${SITE_URL}/confess` },
  openGraph: {
    title: 'Confess — Honey, If Only',
    description: 'Write into the void. Say what you never said.',
    url: `${SITE_URL}/confess`,
  },
};

export default function ConfessPage() {
  return <ConfessionMode />;
}
