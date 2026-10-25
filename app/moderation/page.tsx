import type { Metadata } from 'next';
import Link from 'next/link';
import TrustPage from '@/components/TrustPage';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Moderation Policy',
  description: `How ${SITE_NAME} reviews new submissions, moderation standards, removal requests, and the limits of its archive review process.`,
  alternates: { canonical: `${SITE_URL}/moderation` },
};

export default function ModerationPage() {
  return (
    <TrustPage
      eyebrow="Moderation Policy"
      title="How new submissions are reviewed before publication."
      subtitle={`${SITE_NAME} reviews new submissions made through the current form before they appear publicly. This page explains current review standards, blocked content categories, response times, and how advertising relates to content review.`}
      updated="July 2026"
      highlights={[
        { label: 'Review', value: 'Human moderation', detail: 'New letters submitted through the current form are read before publication.' },
        { label: 'Requests', value: 'Reviewed', detail: 'Send the letter URL and a brief description of the concern.' },
        { label: 'Older archive', value: 'Different history', detail: 'Current moderation does not verify every entry preserved from the earlier archive.' },
      ]}
      sections={[
        {
          title: 'Review standards',
          eyebrow: 'What we check',
          children: (
            <>
              <p>
                New letters submitted through the <Link href="/write">Write a Letter</Link> page are read before
                it appears in the public archive. We check for:
              </p>
              <ul>
                <li>Spam, gibberish, or machine-generated submissions</li>
                <li>Targeted harassment, threats, or hate speech</li>
                <li>Sexually explicit or pornographic content</li>
                <li>Personal information (full names, addresses, phone numbers, social media handles)</li>
                <li>Impersonation or identity-based attacks</li>
                <li>Content that could endanger the person named in the letter</li>
              </ul>
              <p>
                New submissions that pass review may be published to the archive. Submissions that violate the
                current standards are rejected; older archive entries may have a different publication history.
              </p>
            </>
          ),
        },
        {
          title: 'Allowed content',
          eyebrow: 'What belongs here',
          children: (
            <p>
              Regret, gratitude, apology, longing, grief, closure, anger expressed without threats,
              and any form of emotionally honest writing directed at a person by their first name.
              Mild profanity is permitted when it serves the emotional honesty of the message.
            </p>
          ),
        },
        {
          title: 'Blocked content',
          eyebrow: 'Current submission rules',
          children: (
            <>
              <p>The following categories are not accepted through the current submission process. Older archive entries may have a different publication history.</p>
              <ul>
                <li>Submissions not written in English</li>
                <li>Threats of violence, self-harm encouragement, or suicide goading</li>
                <li>Explicit profanity, sexually explicit or pornographic language</li>
                <li>Racial slurs, homophobic slurs, or derogatory language</li>
                <li>Full names, addresses, phone numbers, or other identifying information</li>
                <li>Spam, advertising, or promotional links</li>
                <li>AI-generated or bulk-submitted content</li>
                <li>Impersonation of real people with intent to deceive</li>
              </ul>
            </>
          ),
        },
        {
          title: 'Bot and spam prevention',
          eyebrow: 'Technical safeguards',
          children: (
            <p>
              We use browser fingerprinting, rate limiting (maximum 6 submissions per day per device),
              a curated profanity filter, word count limits (25 words maximum), and character-length
              limits to prevent abuse at scale. These measures complement human review rather than
              replacing it.
            </p>
          ),
        },
        {
          title: 'Removal and abuse requests',
          eyebrow: 'Response time',
          children: (
            <p>
              If a letter references you, contains your personal information, or violates our
              standards, submit the letter URL through our <Link href="/contact">contact page</Link>.
              Requests are reviewed under the current moderation and privacy rules. Response time can vary, and contacting us does not guarantee removal.
            </p>
          ),
        },
        {
          title: 'Advertising and content review',
          eyebrow: 'Ad placement policy',
          children: (
            <p>
              Advertising eligibility and placement can depend on vendor settings and automated systems. The current submission review process does not establish the publication history of older archive material or guarantee where an ad may appear.
            </p>
          ),
        },
        {
          title: 'Editorial oversight',
          eyebrow: 'Who moderates',
          children: (
            <p>
              The site editor handles new submissions through the current moderation queue and prepares journal articles. Older archive material may have a different publication history; moderation of current submissions does not verify every existing archive entry.
            </p>
          ),
        },
        {
          title: 'Correction policy',
          eyebrow: 'Errors in journal content',
          children: (
            <>
              <p>
                If you find a factual error in any journal article, email{' '}
                <a href="mailto:ifonlyisentthis@gmail.com">ifonlyisentthis@gmail.com</a> with the article URL
                and the specific error. The editor reviews correction requests and may add a note to the article
                when a factual correction is made. Response time can vary.
              </p>
              <p>
                For more detail on how articles are written and reviewed, see the{' '}
                <Link href="/methodology">Methodology</Link> page.
              </p>
            </>
          ),
        },
      ]}
      relatedLinks={[
        { href: '/methodology', label: 'Methodology', description: 'How letters are screened, articles are written, and decisions are made.' },
        { href: '/about', label: 'How It Works', description: 'The full process from submission to publication.' },
        { href: '/privacy', label: 'Privacy Policy', description: 'How we handle data, cookies, and advertising.' },
        { href: '/terms', label: 'Terms', description: 'The rules for using the site and submitting letters.' },
        { href: '/contact', label: 'Contact', description: 'Report a letter, request removal, or ask a question.' },
      ]}
    />
  );
}
