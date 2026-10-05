import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CtaBand from '@/components/CtaBand';
import PortfolioDetailGallery from '@/components/PortfolioDetailGallery';
import { getProjectBySlug, getProjects, getWorkshopSettings } from '@/lib/supabase';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.title} | Technical Specification`,
    description: project.description,
    alternates: {
      canonical: `/portfolio/${project.slug}`,
    },
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function PortfolioDetailPage({ params }: PageProps) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const allProjects = await getProjects();
  const settings = await getWorkshopSettings();
  const relatedProjects = allProjects.filter((p) => p.slug !== project.slug).slice(0, 3);

  // Breadcrumb structured data
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://lathepattarai.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Portfolio',
        item: 'https://lathepattarai.com/portfolio',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.title,
        item: `https://lathepattarai.com/portfolio/${project.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <Navbar settings={settings} />

      <main className="w-full pt-16 sm:pt-20 bg-surface flex flex-col flex-grow pb-16 lg:pb-0">
        {/* Breadcrumb strip with thin divider */}
        <section className="w-full bg-surface px-4 sm:px-6 lg:px-8 py-4 border-b border-outline-variant/40">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 font-label-technical text-xs uppercase tracking-wider text-on-surface-variant">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link href="/portfolio" className="hover:text-primary transition-colors">Portfolio</Link>
              <span>/</span>
              <span className="text-on-surface font-semibold truncate max-w-xs">{project.title}</span>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <span>Tolerance</span>
              <span className="text-primary font-bold">{project.tolerance}</span>
            </div>
          </div>
        </section>

        {/* Top Section: Overview & Gallery */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-surface">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left: Gallery with Lightbox */}
            <div className="lg:col-span-6">
              <PortfolioDetailGallery
                primaryImage={project.image}
                title={project.title}
                phone={settings.phone}
                whatsapp={settings.whatsapp}
              />
            </div>

            {/* Right: Technical Specs Table */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div>
                <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
                  {project.category}
                </span>
                <h1 className="font-display-xl text-2xl sm:text-4xl uppercase tracking-tight text-on-surface font-bold mt-1">
                  {project.title}
                </h1>
                <p className="font-body-md text-base text-on-surface-variant leading-relaxed mt-3">
                  {project.description}
                </p>
              </div>

              {/* Specs as a Simple Two-Column Table with Thin Lines (No Boxes) */}
              <div className="flex flex-col border-t border-b border-outline-variant/40 divide-y divide-outline-variant/40">
                <div className="py-3 flex justify-between items-center text-sm font-body-md">
                  <span className="text-on-surface-variant">Raw Material Grade</span>
                  <span className="text-on-surface font-semibold">{project.material}</span>
                </div>
                <div className="py-3 flex justify-between items-center text-sm font-body-md">
                  <span className="text-on-surface-variant">Calibrated Tolerance</span>
                  <span className="text-primary font-bold font-mono">{project.tolerance}</span>
                </div>
                <div className="py-3 flex justify-between items-center text-sm font-body-md">
                  <span className="text-on-surface-variant">Batch Quantity Produced</span>
                  <span className="text-on-surface font-semibold">{project.quantity}</span>
                </div>
                <div className="py-3 flex justify-between items-center text-sm font-body-md">
                  <span className="text-on-surface-variant">Application Sector</span>
                  <span className="text-on-surface font-semibold">{project.clientIndustry}</span>
                </div>
                {project.specs.map((spec, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center text-sm font-body-md">
                    <span className="text-on-surface-variant">{spec.label}</span>
                    <span className="text-on-surface font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Machining Challenge & Tooling Solution if available */}
              {(project.challenge || project.solution) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {project.challenge && (
                    <div className="flex flex-col gap-1">
                      <span className="font-label-technical text-xs uppercase tracking-wider text-error font-bold">
                        Machining Challenge
                      </span>
                      <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                        {project.challenge}
                      </p>
                    </div>
                  )}
                  {project.solution && (
                    <div className="flex flex-col gap-1">
                      <span className="font-label-technical text-xs uppercase tracking-wider text-primary font-bold">
                        Tooling Solution
                      </span>
                      <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                        {project.solution}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Desktop Direct Action Buttons */}
              <div className="hidden lg:flex items-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${(settings.whatsapp || settings.phone).replace(/[^0-9]/g, '')}?text=Hello%20Lathe%20Pattarai,%20I%20have%20a%20requirement%20similar%20to%20${encodeURIComponent(project.title)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-[4px] bg-[#6a5d34] text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-[#7e6f3e] transition-colors"
                >
                  Quote Similar Component
                </a>
                <Link
                  href="/contact"
                  className="px-5 py-3 rounded-[4px] bg-surface-container text-on-surface border border-outline-variant font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-surface-container-high transition-colors"
                >
                  Enquire at Workshop
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* RELATED WORKS: Horizontal row of 3 images, not cards */}
        {relatedProjects.length > 0 && (
          <section className="w-full bg-surface-container-low px-4 sm:px-6 lg:px-8 py-16 border-t border-outline-variant/40">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
              <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
                <h3 className="font-headline-sm text-lg sm:text-xl uppercase tracking-tight text-on-surface font-bold">
                  Related Machined Works
                </h3>
                <Link
                  href="/portfolio"
                  className="font-label-technical text-xs text-primary font-bold uppercase tracking-wider hover:underline"
                >
                  Full Catalog
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedProjects.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/portfolio/${rel.slug}`}
                    className="group flex flex-col gap-2"
                  >
                    <div className="relative w-full aspect-[4/3] rounded-[6px] overflow-hidden border border-outline-variant/50 bg-surface-container">
                      <Image
                        src={rel.image}
                        alt={rel.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-technical text-[11px] text-primary uppercase font-bold">
                        {rel.material}
                      </span>
                      <span className="font-headline-sm text-sm uppercase tracking-tight text-on-surface font-bold group-hover:text-primary transition-colors line-clamp-1">
                        {rel.title}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <CtaBand
          title="Need custom turning for your parts?"
          subtitle="Lathe Pattarai is a lathe workshop in Perundurai Road, Erode, Tamil Nadu, doing turning, threading, boring and repair work."
          phone={settings.phone}
          whatsapp={settings.whatsapp}
        />
      </main>

      <Footer settings={settings} />
    </>
  );
}
