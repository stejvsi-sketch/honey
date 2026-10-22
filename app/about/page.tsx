import type { Metadata } from 'next';
import Link from 'next/link';
import TrustPage from '@/components/TrustPage';
import { SITE_NAME, SITE_URL, EDITOR_BYLINE, EDITOR_BIO } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'How It Works',
  description: `Learn how ${SITE_NAME} reviews new unsent letters, what may appear publicly, and how its archive works.`,
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <TrustPage
      eyebrow="How it works"
      title="A careful home for the words people never sent."
      subtitle={`${SITE_NAME} is a public archive of short unsent letters. New letters submitted through the current form are reviewed before publication; no account is required, and an optional sender name may appear.`}
      highlights={[
        { label: 'Format', value: '25 words', detail: 'Short letters keep the archive intimate and easy to read.' },
        { label: 'Review', value: 'Current form submissions', detail: 'New submissions are reviewed before publication; older archive material may have a different history.' },
        { label: 'Identity', value: 'No account required', detail: 'An optional sender name may appear publicly if supplied. Avoid details you do not want published.' },
      ]}
      sections={[
        {
          title: 'Write the letter',
          eyebrow: 'Step one',
          children: (
            <>
              <p>
                Visit the <Link href="/write">Write a Letter</Link> page, add the recipient name, choose a paper color,
                and distill the feeling into 25 words or fewer.
              </p>
              <p>
                The format is intentionally small. It keeps the experience focused on a single honest fragment rather
                than a long confession that reveals too much.
              </p>
            </>
          ),
        },
        {
          title: 'Current submission review',
          eyebrow: 'Safety',
          children: (
            <>
              <p>
                Letters are reviewed before publication for spam, harassment, threats, explicit content, personal
                information, and anything that could make the archive unsafe for readers or the people named in letters.
              </p>
              <div className="trust-grid">
                <div className="trust-tile">
                  <strong>Allowed</strong>
                  <p>Regret, gratitude, apology, longing, closure, and emotionally honest writing.</p>
                </div>
                <div className="trust-tile">
                  <strong>Rejected</strong>
                  <p>Hate, threats, sexual content, doxxing, spam, impersonation, and targeted abuse.</p>
                </div>
              </div>
            </>
          ),
        },
        {
          title: 'Approved letters join the archive',
          eyebrow: 'Publication',
          children: (
            <p>
              Once approved, the letter appears in the <Link href="/letters">Letters</Link> archive and may also appear
              on a name page such as <code>/to/sarah</code>. The presentation is quiet on purpose: paper, space, and the
              words themselves.
            </p>
          ),
        },
        {
          title: 'Readers can browse with context',
          eyebrow: 'Navigation',
          children: (
            <p>
              Visitors can explore recent letters, search by name, browse the A-Z archive, read journal essays, and find
              trust pages from the footer and navigation. That clear structure matters for people and for advertising partner review.
            </p>
          ),
        },
        {
          title: 'Removal and abuse requests are taken seriously',
          eyebrow: 'Accountability',
          children: (
            <p>
              If a letter appears to reference you, contains personal information, or violates our rules, send the URL
              through the <Link href="/contact">contact page</Link>. We prioritize safety, privacy, and removal requests.
            </p>
          ),
        },
        {
          title: 'About the editor',
          eyebrow: 'Who runs this',
          children: (
            <>
              <p>
                <strong><Link href="/author">{EDITOR_BYLINE}</Link></strong> is the site&apos;s editorial byline. One editor reviews
                submissions and maintains {SITE_NAME} as an independent project. For more on the editorial process, see the{' '}
                <Link href="/methodology">Methodology</Link> page.
              </p>
              <p>{EDITOR_BIO}</p>
            </>
          ),
        },
      ]}
      relatedLinks={[
        { href: '/privacy', label: 'Privacy Policy', description: 'How we handle submissions, cookies, analytics, and ads.' },
        { href: '/terms', label: 'Terms', description: 'The rules for using the site and submitting letters.' },
        { href: '/contact', label: 'Contact', description: 'Reach us for removals, privacy questions, or abuse reports.' },
      ]}
    />
  );
}
