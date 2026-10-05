import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Workshop & Quotes | Lathe Pattarai Erode',
  description: 'Contact Lathe Pattarai workshop in Perundurai Road, Erode, Tamil Nadu for lathe turning, threading, boring, pump shafts, and emergency breakdown repairs.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
