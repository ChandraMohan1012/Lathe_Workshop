import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StatsBanner from '@/components/StatsBanner';
import FaqAccordion from '@/components/FaqAccordion';
import CtaBand from '@/components/CtaBand';
import JsonLd from '@/components/JsonLd';
import HomeHeroSlider from '@/components/HomeHeroSlider';
import HomeServicesInteractive from '@/components/HomeServicesInteractive';
import HomeFeaturedWorks from '@/components/HomeFeaturedWorks';
import HomeLiveWorkRows from '@/components/HomeLiveWorkRows';
import IndustrialMarquee from '@/components/IndustrialMarquee';
import { getProjects, getLiveJobs, getWorkshopSettings } from '@/lib/supabase';
import { mockFaqs } from '@/lib/mockData';

export const metadata: Metadata = {
  title: 'Lathe Workshop in Erode | Precision Turning & Job Work',
  description: 'Lathe Pattarai is a lathe workshop in Perundurai Road, Erode, Tamil Nadu, doing turning, threading, boring and repair work for textile and pump industries.',
  alternates: {
    canonical: '/',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function HomePage() {
  const projects = await getProjects();
  const liveJobs = await getLiveJobs();
  const settings = await getWorkshopSettings();

  const featuredProjects = projects.filter((p) => p.featured === true).slice(0, 3);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3);
  const activeJobs = liveJobs.slice(0, 4);

  return (
    <>
      <JsonLd settings={settings} />
      <Navbar settings={settings} />

      <main className="w-full pt-16 sm:pt-20 bg-surface flex flex-col flex-grow">
        {/* 1. HERO SECTION: Full-width workshop photo slider, dark overlay, large headline */}
        <HomeHeroSlider
          phone={settings.phone}
          whatsapp={settings.whatsapp}
        />

        {/* 2. STATS SECTION: Inline line of real numbers separated by dividers */}
        <StatsBanner settings={settings} />

        {/* 3. SERVICES SECTION: Numbered rows with desktop hover photo reveal */}
        <HomeServicesInteractive />

        {/* 4. FEATURED WORKS: Editorial layout (1 large image + 2 smaller images beside it) */}
        <HomeFeaturedWorks projects={displayProjects} />

        {/* 5. LIVE WORK (ONGOING): Compact list rows with thin progress lines */}
        <HomeLiveWorkRows jobs={activeJobs} />

        {/* 6. INDUSTRIES MARQUEE: Auto-scrolling industrial sectors */}
        <IndustrialMarquee />

        {/* 7. FAQ ACCORDION: Simple accordion with thin line dividers */}
        <FaqAccordion items={mockFaqs} />

        {/* 8. FINAL CTA: Large typographic statement with Call and WhatsApp buttons */}
        <CtaBand
          title="Have a part to make?"
          subtitle="Lathe Pattarai is a lathe workshop in Perundurai Road, Erode, Tamil Nadu, doing turning, threading, boring and repair work. Call our engineering desk or send your component drawing on WhatsApp."
          phone={settings.phone}
          whatsapp={settings.whatsapp}
        />
      </main>

      <Footer settings={settings} />
    </>
  );
}
