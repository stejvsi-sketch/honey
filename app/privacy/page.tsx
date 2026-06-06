import type { Metadata } from 'next';
import Link from 'next/link';
import TrustPage from '@/components/TrustPage';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${SITE_NAME}, including submissions, moderation data, Google Analytics, AdSense, cookies, and user choices.`,
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <TrustPage
      eyebrow="Privacy Policy"
      title="Privacy that matches how the archive actually works."
      subtitle="We collect the minimum information needed to publish anonymous letters, prevent abuse, understand site performance, and comply with advertising and analytics requirements."
      updated="May 2026"
      highlights={[
        { label: 'Authors', value: 'Anonymous', detail: 'We do not ask letter authors for an account, profile, or public identity.' },
        { label: 'Submissions', value: 'Reviewed first', detail: 'Letters are stored for moderation before they can appear publicly.' },
        { label: 'Ads and analytics', value: 'Disclosed here', detail: 'Google services may use cookies and similar identifiers.' },
      ]}
      sections={[
        {
          title: 'Information we collect',
          children: (
            <>
              <p>When you use {SITE_NAME}, we may collect:</p>
              <ul>
                <li>Letter content, recipient name, selected paper color, and submission time.</li>
                <li>A generated URL slug for recipient-name pages.</li>
                <li>A hashed network identifier used for rate limiting, abuse prevention, and moderation.</li>
                <li>Hashed browser-abuse signals (such as canvas rendering, device and screen attributes, and GPU identifiers) used to detect ban evasion and automated abuse. These signals are processed as a one-way hash and are never used to identify individual users publicly.</li>
                <li>General country information when provided by hosting or security infrastructure.</li>
                <li>A random submission identifier used to manage moderation records.</li>
                <li>Basic technical, security, and performance data processed by our hosting, database, analytics, and advertising providers.</li>
              </ul>
            </>
          ),
        },
        {
          title: 'Information we do not ask for',
          children: (
            <ul>
              <li>We do not require accounts.</li>
              <li>We do not ask submitters for an email address to publish a letter.</li>
              <li>We do not publish author names, profiles, or contact details.</li>
              <li>We do not sell letter submissions or author identities.</li>
            </ul>
          ),
        },
        {
          title: 'How we use information',
          children: (
            <ul>
              <li>To review, approve, reject, display, and organize letters.</li>
              <li>To keep the archive searchable by recipient name.</li>
              <li>To prevent spam, abusive submissions, automated flooding, and repeat policy violations.</li>
              <li>To understand site performance and reader behavior in aggregate.</li>
              <li>To operate advertising, measurement, security, hosting, and database services.</li>
            </ul>
          ),
        },
        {
          title: 'Google Analytics and Google advertising',
          eyebrow: 'Required AdSense disclosure',
          children: (
            <>
              <p>
                We use Google Analytics to understand aggregate usage. If Google AdSense or other Google advertising
                products are enabled, Google and other ad technology partners may use cookies, web beacons, IP addresses,
                device identifiers, and similar technologies to provide ads, measure performance, prevent fraud, and
                improve ad relevance.
              </p>
              <p>
                Third-party vendors, including Google, may serve ads based on previous visits to this site or other
                websites. Google advertising cookies help Google and its partners deliver ads that may be relevant to a
                user&apos;s visits across the internet.
              </p>
              <p>
                You can manage personalized advertising through
                <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer"> Google Ad Settings</a>. You
                can also learn about broader third-party opt-out choices at
                <a href="https://www.aboutads.info/" target="_blank" rel="noreferrer"> AboutAds.info</a>.
              </p>
            </>
          ),
        },
        {
          title: 'Cookies and similar technologies',
          children: (
            <>
              <p>
                Cookies may be used for essential site operation, analytics, security, rate limiting, ad delivery,
                frequency capping, fraud prevention, and aggregate reporting.
              </p>
              <p>
                See our <Link href="/cookies">Cookie Policy</Link> for a clearer breakdown of cookie categories and
                control options.
              </p>
            </>
          ),
        },
        {
          title: 'Consent and regional privacy requirements',
          children: (
            <p>
              Where laws require consent for analytics, advertising cookies, local storage, or personalized ads, we aim
              to request and respect that consent. For users in the EEA, the UK, and Switzerland, AdSense publishers may
              need a Google-certified consent management platform before serving personalized ads.
            </p>
          ),
        },
        {
          title: 'Data sharing',
          children: (
            <p>
              We share information only with service providers that help us run the site, such as hosting, database,
              analytics, security, moderation, and advertising providers. These providers process information under their
              own terms and privacy commitments.
            </p>
          ),
        },
        {
          title: 'Data retention',
          children: (
            <p>
              Approved letters may remain in the public archive indefinitely. Rejected submissions and moderation records
              may be retained for a limited period when needed for abuse prevention, safety review, or operational
              integrity.
            </p>
          ),
        },
        {
          title: 'Removal and privacy requests',
          children: (
            <p>
              If you want to ask about a specific letter, request removal, or raise a privacy concern, contact us through
              the <Link href="/contact">contact page</Link> with the relevant URL.
            </p>
          ),
        },
      ]}
      relatedLinks={[
        { href: '/cookies', label: 'Cookie Policy', description: 'Cookie categories, ad disclosures, and control options.' },
        { href: '/terms', label: 'Terms', description: 'Rules for submissions, moderation, and site use.' },
        { href: '/contact', label: 'Contact', description: 'Reach us for privacy, removal, or safety requests.' },
      ]}
    />
  );
}
