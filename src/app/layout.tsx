import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lathepattarai.com';
const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Lathe Workshop in Erode | Precision Turning & Job Work',
    template: '%s | Lathe Pattarai Erode',
  },
  description: 'Lathe Pattarai is a precision lathe workshop in Perundurai Road, Erode, Tamil Nadu specializing in lathe turning, pump shafts, textile machinery parts, brass bushings, and custom job work for Erode, Tiruppur, Coimbatore & Salem.',
  keywords: [
    'Lathe work Erode',
    'Turning job work Erode',
    'Lathe workshop near me',
    'Textile machinery lathe work Erode',
    'Pump shaft machining Erode',
    'Tiruppur lathe works',
    'Coimbatore lathe job work',
    'Salem lathe workshop',
    'Brass bushing turning Erode',
    'Submersible pump shaft machining',
    'Motor shaft lathe turning',
    'லேத் பட்டறை ஈரோடு',
    'டேர்னிங் ஜாப் ஒர்க்',
  ],
  authors: [{ name: 'Lathe Pattarai Workshop' }],
  creator: 'Lathe Pattarai Precision Engineering',
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/images/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    title: 'Lathe Workshop in Erode | Precision Turning & Job Work',
    description: 'Precision lathe turning, pump shafts, textile machine parts, and custom job work in Erode district.',
    siteName: 'Lathe Pattarai Workshop Erode',
    images: [
      {
        url: '/images/hero-macro-cnc.png',
        width: 1200,
        height: 630,
        alt: 'Lathe Pattarai Precision Lathe Turning in Erode',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lathe Workshop in Erode | Precision Turning & Job Work',
    description: 'Precision lathe turning, pump shafts, textile machine parts, and custom job work in Erode district.',
    images: ['/images/hero-macro-cnc.png'],
  },
  robots: isDemo
    ? {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      }
    : { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {isDemo && <meta name="robots" content="noindex, nofollow, noimageindex" />}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
