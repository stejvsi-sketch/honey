import type { Metadata } from 'next';
import Link from 'next/link';
import TrustPage from '@/components/TrustPage';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of Service for ${SITE_NAME}, including user submissions, moderation, prohibited content, advertising, and removals.`,
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <TrustPage
      eyebrow="Terms of Service"
      title="The rules that keep the archive readable and safe."
      subtitle={`By using ${SITE_NAME}, you agree to these terms. They are written plainly so contributors, readers, and reviewers can understand what belongs here.`}
      updated="May 2026"
      highlights={[
        { label: 'Content', value: 'User submitted', detail: 'Letters belong to their authors, and we host approved submissions.' },
        { label: 'Moderation', value: 'Required', detail: 'Every submission may be accepted, rejected, edited for safety, or removed.' },
        { label: 'Age', value: '13+', detail: 'Do not use the site if local law prevents you from agreeing to these terms.' },
      ]}
      sections={[
        {
          title: 'Acceptance of terms',
          children: (
            <p>
              By accessing, browsing, submitting to, or otherwise using {SITE_NAME}, you agree to these Terms of Service
              and our <Link href="/privacy">Privacy Policy</Link>. If you do not agree, do not use the site.
            </p>
          ),
        },
        {
          title: 'User-submitted letters',
          children: (
            <>
              <p>
                Letters are user-generated content. You retain ownership of the words you submit, but you give us a
                non-exclusive, worldwide, royalty-free license to host, display, reproduce, distribute, index, and promote
                your approved submission as part of the archive.
              </p>
              <p>
                Do not submit content that you do not have the right to share.
              </p>
            </>
          ),
        },
        {
          title: 'Content rules',
          children: (
            <ul>
              <li>No threats, harassment, hate speech, or targeted abuse.</li>
              <li>No sexually explicit content or exploitative material.</li>
              <li>No private personal information, including addresses, phone numbers, emails, usernames, or workplace details.</li>
              <li>No spam, scams, promotional content, affiliate links, or attempts to manipulate search engines.</li>
              <li>No impersonation, false claims of identity, or content that creates a safety risk for another person.</li>
              <li>No content that violates applicable law or encourages illegal activity.</li>
            </ul>
          ),
        },
        {
          title: 'Moderation rights',
          children: (
            <p>
              We may reject, remove, edit for formatting or safety, limit visibility, or preserve moderation records for
              any submission at our discretion. We may also restrict users or hashed identifiers connected with repeated
              abuse, spam, or policy violations.
            </p>
          ),
        },
        {
          title: 'Anonymity and privacy',
          children: (
            <p>
              We do not publicly display author identities. You are responsible for avoiding private information in your
              letter. If a published letter creates a privacy or safety issue, contact us through the
              <Link href="/contact"> contact page</Link>.
            </p>
          ),
        },
        {
          title: 'Advertising and third-party services',
          children: (
            <p>
              The site may use analytics, advertising, hosting, database, security, and other third-party services. Ads
              may be served by Google or other partners and are governed by our <Link href="/privacy">Privacy Policy</Link>
              and <Link href="/cookies"> Cookie Policy</Link>.
            </p>
          ),
        },
        {
          title: 'No warranty',
          children: (
            <p>
              The site is provided as is and as available. We do not guarantee uninterrupted operation, publication of a
              submission, preservation of content, or that every letter is accurate, complete, or authentic.
            </p>
          ),
        },
        {
          title: 'Limitation of liability',
          children: (
            <p>
              To the fullest extent permitted by law, {SITE_NAME} and its operators are not liable for damages arising
              from use of the site, submitted content, moderation decisions, third-party services, or inability to access
              the service.
            </p>
          ),
        },
        {
          title: 'Changes to these terms',
          children: (
            <p>
              We may update these terms as the site grows or legal, advertising, and safety requirements change. Continued
              use of the site after changes means you accept the updated terms.
            </p>
          ),
        },
      ]}
      relatedLinks={[
        { href: '/privacy', label: 'Privacy Policy', description: 'How submissions, analytics, advertising, and data work.' },
        { href: '/disclaimer', label: 'Disclaimer', description: 'Important notes about user-generated emotional content.' },
        { href: '/contact', label: 'Contact', description: 'Ask for help, report abuse, or request a removal.' },
      ]}
    />
  );
}
