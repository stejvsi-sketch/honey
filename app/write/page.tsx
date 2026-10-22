import type { Metadata } from 'next';
import WritePageClient from '@/components/WritePageClient';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Write a Letter',
  description: 'Write a short unsent letter. Approved submissions are public, and an optional sender name may be displayed.',
  alternates: { canonical: `${SITE_URL}/write` },
  openGraph: {
    title: 'Write a Letter',
    description: 'Write a short unsent letter. Approved submissions are public, and an optional sender name may be displayed.',
    url: `${SITE_URL}/write`,
  },
};

export default function WritePage() {
  return <WritePageClient />;
}
