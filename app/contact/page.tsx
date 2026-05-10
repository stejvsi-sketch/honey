import type { Metadata } from 'next';
import TrustPage from '@/components/TrustPage';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

const CONTACT_EMAIL = 'ifonlyisentthis@gmail.com';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Contact ${SITE_NAME} for support, letter removals, privacy requests, abuse reports, and partnership inquiries.`,
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <TrustPage
      eyebrow="Contact"
      title="Reach the people behind the archive."
      subtitle="Use this page for removal requests, moderation concerns, privacy questions, business inquiries, and anything that helps keep the site trustworthy."
      highlights={[
        { label: 'Email', value: CONTACT_EMAIL, detail: 'The same inbox handles support, privacy, and safety reports.' },
        { label: 'Safety review', value: '48 hours', detail: 'Removal and abuse reports are treated as priority requests.' },
        { label: 'Best detail', value: 'Send the URL', detail: 'Include the exact letter or page link so we can act quickly.' },
      ]}
      sections={[
        {
          title: 'General contact',
          children: (
            <p>
              Email us at <a href={`mailto:${CONTACT_EMAIL}`}><strong>{CONTACT_EMAIL}</strong></a>. A clear subject line
              helps us route your message faster.
            </p>
          ),
        },
        {
          title: 'Letter removal requests',
          children: (
            <>
              <p>
                If you believe a letter references you, includes private information, or should not be public, send us
                the letter URL and a short explanation.
              </p>
              <div className="trust-callout">
                <strong>Fastest path:</strong> include the page URL, the recipient name shown on the letter, and the
                reason you are requesting removal.
              </div>
            </>
          ),
        },
        {
          title: 'Report harmful content',
          children: (
            <p>
              Report harassment, threats, hate speech, sexual content, personal information, impersonation, spam, or any
              other violation by sending the URL to the contact email above. We review these reports seriously.
            </p>
          ),
        },
        {
          title: 'Privacy and data questions',
          children: (
            <p>
              For privacy questions, cookie concerns, or data-related requests, use the same email and mention
              &quot;Privacy&quot; in the subject line.
            </p>
          ),
        },
        {
          title: 'Business and media inquiries',
          children: (
            <p>
              For advertising, partnerships, press, or editorial inquiries, email
              <a href={`mailto:${CONTACT_EMAIL}`}> <strong>{CONTACT_EMAIL}</strong></a> with the context and your
              preferred reply address.
            </p>
          ),
        },
      ]}
      relatedLinks={[
        { href: '/about', label: 'How It Works', description: 'Understand submissions, moderation, and publication.' },
        { href: '/privacy', label: 'Privacy Policy', description: 'Review data, cookies, and third-party services.' },
        { href: '/terms', label: 'Terms', description: 'Read the content rules and user responsibilities.' },
      ]}
    />
  );
}
