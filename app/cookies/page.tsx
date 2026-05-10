import type { Metadata } from 'next';
import TrustPage from '@/components/TrustPage';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: `Cookie Policy for ${SITE_NAME}, including essential cookies, analytics, Google advertising cookies, and user controls.`,
  alternates: { canonical: `${SITE_URL}/cookies` },
};

export default function CookiesPage() {
  return (
    <TrustPage
      eyebrow="Cookie Policy"
      title="How cookies and similar technologies are used."
      subtitle="This page explains the cookie categories that may be used for site operation, analytics, security, advertising, and user choice."
      updated="May 2026"
      highlights={[
        { label: 'Essential', value: 'Always needed', detail: 'Security, delivery, and core site behavior.' },
        { label: 'Analytics', value: 'Google Analytics', detail: 'Aggregate usage measurement and performance insight.' },
        { label: 'Advertising', value: 'Google AdSense', detail: 'Ad delivery, measurement, fraud prevention, and personalization where allowed.' },
      ]}
      sections={[
        {
          title: 'What cookies are',
          children: (
            <p>
              Cookies are small files or identifiers stored by your browser. Similar technologies include local storage,
              pixels, web beacons, device identifiers, and server-side signals used to keep websites working, measure
              performance, and support advertising.
            </p>
          ),
        },
        {
          title: 'Essential and security cookies',
          children: (
            <p>
              These support basic site delivery, security, abuse prevention, rate limiting, and reliable operation. Some
              may be set by infrastructure providers that host, protect, cache, or deliver the website.
            </p>
          ),
        },
        {
          title: 'Analytics cookies',
          children: (
            <p>
              Google Analytics may use cookies or similar identifiers to help us understand aggregate traffic, popular
              pages, performance issues, and how visitors move through the site. This helps us improve navigation,
              readability, and the archive experience.
            </p>
          ),
        },
        {
          title: 'Advertising cookies',
          eyebrow: 'AdSense disclosure',
          children: (
            <>
              <p>
                If Google AdSense or other advertising partners are enabled, advertising cookies and similar technologies
                may be used for ad serving, frequency capping, fraud prevention, reporting, measurement, and
                personalization where permitted.
              </p>
              <p>
                Third-party vendors, including Google, may use cookies to show ads based on visits to this site or other
                sites. Other ad networks may also use cookies if they serve ads here.
              </p>
            </>
          ),
        },
        {
          title: 'Your choices',
          children: (
            <>
              <ul>
                <li>Use your browser settings to block or delete cookies.</li>
                <li>Manage Google personalized ads in <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer">Google Ad Settings</a>.</li>
                <li>Review broader industry opt-out choices at <a href="https://www.aboutads.info/" target="_blank" rel="noreferrer">AboutAds.info</a>.</li>
                <li>Where a consent prompt is shown, use it to accept, reject, or update eligible cookie choices.</li>
              </ul>
              <p>
                Blocking some cookies may affect analytics accuracy, ad relevance, or parts of the site that rely on
                security and abuse-prevention checks.
              </p>
            </>
          ),
        },
        {
          title: 'Regional consent',
          children: (
            <p>
              For visitors in regions where consent is legally required, we aim to request consent before using eligible
              non-essential cookies or personalized advertising features. For AdSense traffic in the EEA, the UK, and
              Switzerland, publishers may need a Google-certified consent management platform.
            </p>
          ),
        },
        {
          title: 'Updates',
          children: (
            <p>
              We may update this Cookie Policy as the site, analytics tools, advertising setup, or legal requirements
              change. The latest version will remain available at this page.
            </p>
          ),
        },
      ]}
      relatedLinks={[
        { href: '/privacy', label: 'Privacy Policy', description: 'The broader data handling policy for the site.' },
        { href: '/terms', label: 'Terms', description: 'Rules for contributors, readers, and moderation.' },
        { href: '/contact', label: 'Contact', description: 'Ask a privacy or cookie-related question.' },
      ]}
    />
  );
}
