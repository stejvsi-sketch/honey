import type { Metadata } from 'next';
import { Lora, Inter, Caveat } from 'next/font/google';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AnalyticsScript from '@/components/AnalyticsScript';
import Script from 'next/script';
import './globals.css';

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-handwriting',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} - Unsent Letters`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: ['unsent letters', 'unsent messages', 'unsent texts', 'love letters', 'love letters never sent', 'things unsaid', 'things I never said', 'anonymous letters', 'anonymous messages', 'unspoken words', 'letter never sent', 'message never sent', 'messages never sent', 'unsent letter to', 'unsent message to', 'unsent messages to', 'words left unsaid'],
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website', siteName: SITE_NAME, title: SITE_NAME,
    description: SITE_DESCRIPTION, url: SITE_URL,
    images: [{ url: '/opengraph-image.png', width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: { card: 'summary_large_image', title: SITE_NAME, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${lora.variable} ${inter.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preload LCP-critical texture image (crossorigin matches the CSS mask fetch) */}
        <link rel="preload" href="/textures/rough-paper.webp" as="image" type="image/webp" fetchPriority="high" crossOrigin="anonymous" />
        {/* Preconnect to Grow (Mediavine) origin */}
        <link rel="preconnect" href="https://faves.grow.me" crossOrigin="anonymous" />
      </head>
      <body>
        {/* Ezoic Privacy Scripts — beforeInteractive to load in head without hydration issues */}
        <Script id="ezoic-gatekeeper-cmp" src="https://cmp.gatekeeperconsent.com/min.js" strategy="beforeInteractive" data-cfasync="false" />
        <Script id="ezoic-gatekeeper-min" src="https://the.gatekeeperconsent.com/cmp.min.js" strategy="beforeInteractive" data-cfasync="false" />
        {/* Ezoic Header Script */}
        <Script id="ezoic-sa" src="//www.ezojs.com/ezoic/sa.min.js" strategy="beforeInteractive" />
        <Script id="ezoic-standalone-init" strategy="beforeInteractive">{`window.ezstandalone = window.ezstandalone || {}; ezstandalone.cmd = ezstandalone.cmd || [];`}</Script>
        <Script id="ezoic-analytics" src="//ezoicanalytics.com/analytics.js" strategy="beforeInteractive" />
        {/* Google AdSense */}
        <Script id="google-adsense" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4151123662328725" strategy="beforeInteractive" crossOrigin="anonymous" />

        <Navigation />
        <main>{children}</main>
        <Footer />
        {/* Grow by Mediavine initializer — injected via next/script (afterInteractive) so it
            runs after hydration. The snippet inserts a script before the first <script> tag,
            which reorders <head> and breaks hydration if rendered inline by React. */}
        <Script
          id="grow-initializer"
          strategy="afterInteractive"
          data-grow-initializer=""
          dangerouslySetInnerHTML={{
            __html: `!(function(){window.growMe||((window.growMe=function(e){window.growMe._.push(e);}),(window.growMe._=[]));var e=document.createElement("script");(e.type="text/javascript"),(e.src="https://faves.grow.me/main.js"),(e.defer=!0),e.setAttribute("data-grow-faves-site-id","U2l0ZTo2OGVmOGIwMy0wMTRjLTQwZmItODYwYi1lODI0MGI3OGM4NmI=");var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t);})();`,
          }}
        />
        {/* Google Analytics — conditionally loaded */}
        <AnalyticsScript />
      </body>
    </html>
  );
}
