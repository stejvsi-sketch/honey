import type { Metadata } from 'next';
import Link from 'next/link';
import TrustPage from '@/components/TrustPage';
import { SITE_NAME, SITE_URL, EDITOR_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Moderation Policy',
  description: `How ${SITE_NAME} reviews, moderates, and publishes anonymous unsent letters. Standards, blocked content, response times, and ad placement rules.`,
  alternates: { canonical: `${SITE_URL}/moderation` },
};

export default function ModerationPage() {
  return (
    <TrustPage
      eyebrow="Moderation Policy"
      title="How we review every letter before it goes live."
      subtitle={`${SITE_NAME} is a moderated archive. Every submission is reviewed by a human before it appears publicly. This page explains our review standards, blocked content categories, response times, and how advertising relates to content review.`}
      updated="July 2026"
      highlights={[
        { label: 'Review', value: 'Human moderation', detail: 'Every letter is read and approved by a person before publication.' },
        { label: 'Response time', value: 'Within 48 hours', detail: 'Removal and abuse reports are acted on within 48 hours.' },
        { label: 'Ads on unreviewed content', value: 'Never', detail: 'Ads are not served on any page until content has been reviewed.' },
      ]}
      sections={[
        {
          title: 'Review standards',
          eyebrow: 'What we check',
          children: (
            <>
              <p>
                Every letter submitted through the <Link href="/write">Write a Letter</Link> page is read before
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
                Letters that pass review are published to the archive. Letters that violate these standards
                are rejected and never appear publicly.
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
          eyebrow: 'What is never published',
          children: (
            <>
              <p>The following categories are always rejected:</p>
              <ul>
                <li>Threats of violence, self-harm encouragement, or suicide goading</li>
                <li>Sexually explicit or pornographic language</li>
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
              We aim to respond to all removal and abuse requests within 48 hours.
            </p>
          ),
        },
        {
          title: 'Advertising and content review',
          eyebrow: 'Ad placement policy',
          children: (
            <p>
              Advertisements are never displayed on pages containing unreviewed or pending content.
              Ads appear only on pages where all visible content has been reviewed and approved by
              {' '}{EDITOR_NAME} or the editorial team. We follow Google AdSense program policies
              and do not serve ads on legal pages, the submission form, or any content flagged for review.
            </p>
          ),
        },
        {
          title: 'Editorial oversight',
          eyebrow: 'Who moderates',
          children: (
            <p>
              All moderation and editorial decisions are made by <strong>{EDITOR_NAME}</strong>,
              founder and editor of {SITE_NAME}. Journal articles, stories, and all user-submitted
              content are reviewed under the same editorial standards described on this page.
            </p>
          ),
        },
      ]}
      relatedLinks={[
        { href: '/about', label: 'How It Works', description: 'The full process from submission to publication.' },
        { href: '/privacy', label: 'Privacy Policy', description: 'How we handle data, cookies, and advertising.' },
        { href: '/terms', label: 'Terms', description: 'The rules for using the site and submitting letters.' },
        { href: '/contact', label: 'Contact', description: 'Report a letter, request removal, or ask a question.' },
      ]}
    />
  );
}
