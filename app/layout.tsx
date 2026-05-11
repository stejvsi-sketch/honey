import type { Metadata } from 'next';
import Script from 'next/script';
import { Lora, Inter } from 'next/font/google';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import './globals.css';

const GA_MEASUREMENT_ID = 'G-QNJ151X277';

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} - Unsent Letters`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: ['unsent letters', 'unsent messages', 'unsent texts', 'love letters', 'love letters never sent', 'things unsaid', 'things I never said', 'anonymous letters', 'anonymous messages', 'unspoken words', 'letter never sent', 'message never sent', 'unsent letter to', 'unsent message to', 'words left unsaid'],
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
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
      className={`${lora.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preload LCP-critical texture image */}
        <link rel="preload" href="/textures/rough-paper.webp" as="image" type="image/webp" fetchPriority="high" />
        {/* Google Analytics */}
        <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
      </head>
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
