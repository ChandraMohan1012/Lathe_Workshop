import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lathepattarai.com';
const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Lathe Pattarai | Precision Machining & Lathe Workshop Guindy',
    template: '%s | Lathe Pattarai',
  },
  description: 'Subtractive precision manufacturing, single-piece prototype retooling, and high-tolerance batch component production in Guindy SIDCO Industrial Estate, Chennai.',
  keywords: [
    'Lathe Pattarai',
    'Precision Lathe Workshop',
    'CNC Turning Chennai',
    'Guindy SIDCO Lathe',
    'Machining Workshop',
    'Subtractive Engineering',
    'Brass Components',
    'Heavy Duty Lathe Turning',
  ],
  authors: [{ name: 'Lathe Pattarai Workshop' }],
  creator: 'Lathe Pattarai Precision Engineering',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    title: 'Lathe Pattarai | Precision Machining Workshop',
    description: 'Subtractive precision manufacturing & high-tolerance batch component production in Guindy SIDCO.',
    siteName: 'Lathe Pattarai Precision Workshop',
    images: [
      {
        url: '/images/hero-macro-cnc.png',
        width: 1200,
        height: 630,
        alt: 'Lathe Pattarai Precision Lathe Turning',
      },
    ],
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
