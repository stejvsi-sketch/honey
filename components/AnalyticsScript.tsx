'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

const GA_MEASUREMENT_ID = 'G-QNJ151X277';

/** Path prefixes that must NOT send analytics data */
const NO_ANALYTICS_PREFIXES = ['/xqvjkl'];

export default function AnalyticsScript() {
  const pathname = usePathname();

  // Check if we should block analytics on this path
  const shouldBlock = NO_ANALYTICS_PREFIXES.some(prefix => pathname.startsWith(prefix));

  if (shouldBlock) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
