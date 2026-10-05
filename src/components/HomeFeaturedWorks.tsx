import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types';

interface HomeFeaturedWorksProps {
  projects: Project[];
}

export default function HomeFeaturedWorks({ projects }: HomeFeaturedWorksProps) {
  if (!projects || projects.length === 0) return null;

  const mainProject = projects[0];
  const secondaryProjects = projects.slice(1, 3);

  return (
    <section className="w-full bg-surface-container-low px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-outline-variant/40">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 sm:gap-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant/40 pb-6">
          <div className="flex flex-col gap-2">
            <span className="font-label-technical text-xs uppercase tracking-widest text-primary font-bold">
              Machined Portfolio
            </span>
            <h2 className="font-display-xl text-3xl sm:text-4xl uppercase tracking-tight text-on-surface font-bold">
              Featured Components
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="font-label-technical text-xs uppercase tracking-wider text-primary font-bold hover:underline inline-flex items-center gap-1.5"
          >
            <span>View All Machined Works</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* Editorial Layout: 1 Large + 2 Smaller Beside It */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Main Large Item (7 cols) */}
          {mainProject && (
            <div className="lg:col-span-7 flex flex-col justify-between bg-surface border border-outline-variant/50 rounded-[6px] overflow-hidden group">
              <div className="relative w-full aspect-[16/10] bg-surface-container overflow-hidden">
                <Image
                  src={mainProject.image}
                  alt={mainProject.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-between gap-4 flex-grow">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-label-technical uppercase tracking-wider text-on-surface-variant">
                    <span className="text-primary font-bold">{mainProject.category}</span>
                    <span>{mainProject.tolerance}</span>
                  </div>
                  <h3 className="font-headline-sm text-xl sm:text-2xl uppercase tracking-tight text-on-surface font-bold group-hover:text-primary transition-colors">
                    {mainProject.title}
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                    {mainProject.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between">
                  <span className="font-label-technical text-xs text-on-surface-variant uppercase">
                    Material: <strong className="text-on-surface font-semibold">{mainProject.material}</strong>
                  </span>
                  <Link
                    href={`/portfolio/${mainProject.slug}`}
                    className="font-label-technical text-xs text-primary font-bold uppercase tracking-wider hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Specs</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Secondary 2 Items (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8 justify-between">
            {secondaryProjects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col sm:flex-row lg:flex-col bg-surface border border-outline-variant/50 rounded-[6px] overflow-hidden group flex-1"
              >
                <div className="relative w-full sm:w-48 lg:w-full aspect-[16/9] sm:aspect-square lg:aspect-[16/9] bg-surface-container flex-shrink-0 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 450px"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                <div className="p-5 sm:p-6 flex flex-col justify-between gap-3 flex-grow">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-label-technical uppercase tracking-wider text-on-surface-variant">
                      <span className="text-primary font-semibold">{project.category}</span>
                      <span>{project.tolerance}</span>
                    </div>
                    <h4 className="font-headline-sm text-base sm:text-lg uppercase tracking-tight text-on-surface font-bold mt-1 group-hover:text-primary transition-colors">
                      {project.title}
                    </h4>
                  </div>
                  <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                    <span className="font-label-technical text-[11px] text-on-surface-variant uppercase truncate max-w-[180px]">
                      {project.material}
                    </span>
                    <Link
                      href={`/portfolio/${project.slug}`}
                      className="font-label-technical text-xs text-primary font-bold uppercase tracking-wider hover:underline inline-flex items-center gap-1 flex-shrink-0"
                    >
                      <span>Specs</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
