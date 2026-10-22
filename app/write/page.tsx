import type { Metadata } from 'next';
import WritePageClient from '@/components/WritePageClient';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Write an Unsent Letter Online',
  description: 'Write an unsent letter online without an account; leave the optional sender name blank. Approved submissions are public, and details in the text can still identify you.',
  alternates: { canonical: `${SITE_URL}/write` },
  openGraph: {
    title: 'Write an Unsent Letter Online',
    description: 'Write an unsent letter online without an account; leave the optional sender name blank. Approved submissions are public, and details in the text can still identify you.',
    url: `${SITE_URL}/write`,
  },
};

export default function WritePage() {
  return <WritePageClient />;
}
