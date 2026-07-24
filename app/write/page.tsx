import type { Metadata } from 'next';
import WritePageClient from '@/components/WritePageClient';
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
  return <WritePageClient />;
}
