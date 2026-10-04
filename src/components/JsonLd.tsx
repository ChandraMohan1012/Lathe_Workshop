import { WorkshopSettings } from '@/types';
import { initialSettings, mockFaqs } from '@/lib/mockData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lathepattarai.com';
const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

interface JsonLdProps {
  settings?: WorkshopSettings;
}

export default function JsonLd({ settings = initialSettings }: JsonLdProps) {
  // Don't emit structured data in demo mode — prevents fake phone/address being indexed
  if (isDemo) return null;

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    name: settings.workshopName,
    description: settings.tagline,
    url: siteUrl,
    telephone: settings.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address || 'Perundurai Road, Erode Industrial Area',
      addressLocality: 'Erode',
      addressRegion: 'Tamil Nadu',
      postalCode: '638011',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 11.3410,
      longitude: 77.7172,
    },
    areaServed: [
      { '@type': 'City', name: 'Erode' },
      { '@type': 'City', name: 'Tiruppur' },
      { '@type': 'City', name: 'Coimbatore' },
      { '@type': 'City', name: 'Salem' },
      { '@type': 'City', name: 'Namakkal' },
      { '@type': 'City', name: 'Karur' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:30',
        closes: '19:30',
      },
    ],
    priceRange: '₹₹',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: mockFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
