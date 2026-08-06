import type { Metadata } from 'next';
import { Lora, Inter, Caveat } from 'next/font/google';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AnalyticsScript from '@/components/AnalyticsScript';
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
        {/* Google Funding Choices CMP for GDPR consent (EEA/UK/Switzerland) */}
        <script async src="https://fundingchoicesmessages.google.com/i/pub-4151123662328725?ers=1" suppressHydrationWarning></script>
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `(function(){function s(){if(!window.frames['googlefcPresent']){if(document.body){var i=document.createElement('iframe');i.style='width:0;height:0;border:none;z-index:-1000;left:-1000px;top:-1000px;';i.style.display='none';i.name='googlefcPresent';document.body.appendChild(i);}else{setTimeout(s,0);}}}s();})();` }} />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4151123662328725" crossOrigin="anonymous" suppressHydrationWarning></script>
      </head>
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
        {/* Google Analytics — conditionally loaded */}
        <AnalyticsScript />
      </body>
    </html>
  );
}
