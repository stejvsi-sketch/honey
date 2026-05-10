import type { Metadata } from 'next';
import Link from 'next/link';
import TrustPage from '@/components/TrustPage';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: `Disclaimer for ${SITE_NAME}, including user-generated content, emotional content, professional advice, external links, and advertising.`,
  alternates: { canonical: `${SITE_URL}/disclaimer` },
};

export default function DisclaimerPage() {
  return (
    <TrustPage
      eyebrow="Disclaimer"
      title="Important context before you read the archive."
      subtitle="Honey, If Only is built around anonymous, user-submitted writing. The words can be moving, imperfect, fictional, painful, or incomplete."
      updated="May 2026"
      highlights={[
        { label: 'Source', value: 'Anonymous users', detail: 'Letters do not represent the views of the site.' },
        { label: 'Review', value: 'Moderated', detail: 'Moderation reduces risk but cannot verify every claim.' },
        { label: 'Support', value: 'Not advice', detail: 'The site is not a substitute for professional help.' },
      ]}
      sections={[
        {
          title: 'User-generated content',
          children: (
            <p>
              Letters on {SITE_NAME} are submitted by anonymous users. Their views, memories, opinions, and emotions do
              not represent the views of the site, its operators, advertisers, or partners.
            </p>
          ),
        },
        {
          title: 'Accuracy and authenticity',
          children: (
            <p>
              We do not guarantee that a letter describes real events or that every detail is accurate. Letters may be
              symbolic, fictionalized, exaggerated, incomplete, or written from one person&apos;s perspective.
            </p>
          ),
        },
        {
          title: 'Emotional content',
          children: (
            <p>
              The archive may include themes of grief, regret, heartbreak, loss, longing, apology, and loneliness. Please
              read at your own pace and step away if the content feels heavy.
            </p>
          ),
        },
        {
          title: 'No professional advice',
          children: (
            <>
              <p>
                The site is not medical, mental health, legal, financial, or relationship advice. If you need help with a
                serious situation, contact a qualified professional, trusted person, or local emergency resource.
              </p>
              <div className="trust-callout">
                <strong>Immediate danger:</strong> if you or someone else may be in danger, contact emergency services
                or a crisis resource in your area now.
              </div>
            </>
          ),
        },
        {
          title: 'External links and ads',
          children: (
            <p>
              External links and advertisements may lead to third-party websites. We are not responsible for their
              content, policies, products, or practices. An ad appearing near a letter does not mean we endorse the ad,
              and an ad does not endorse the letter.
            </p>
          ),
        },
        {
          title: 'Reporting concerns',
          children: (
            <p>
              If a letter contains private information, harmful content, or appears to violate our rules, please use the
              <Link href="/contact"> contact page</Link> and include the page URL.
            </p>
          ),
        },
      ]}
      relatedLinks={[
        { href: '/terms', label: 'Terms', description: 'Rules for publishing, moderation, and site use.' },
        { href: '/privacy', label: 'Privacy Policy', description: 'How data, cookies, analytics, and ads are handled.' },
        { href: '/contact', label: 'Contact', description: 'Report a concern or request removal.' },
      ]}
    />
  );
}
