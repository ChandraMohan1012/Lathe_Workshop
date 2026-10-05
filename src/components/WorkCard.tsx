import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types';

interface WorkCardProps {
  project: Project;
}

export default function WorkCard({ project }: WorkCardProps) {
  return (
    <div className="bg-surface border border-outline-variant/50 rounded-[4px] overflow-hidden flex flex-col h-full group transition-colors hover:border-primary/60">
      {/* Image Preview Container */}
      <div className="relative aspect-[16/10] w-full bg-surface-container overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-label-technical uppercase tracking-wider">
            <span className="text-primary font-bold">{project.material}</span>
            <span>{project.tolerance}</span>
          </div>

          <h3 className="font-headline-sm text-base uppercase tracking-tight text-on-surface group-hover:text-primary transition-colors line-clamp-2 font-bold">
            {project.title}
          </h3>

          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Action Link */}
        <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between">
          <span className="font-label-technical text-xs text-primary uppercase font-bold tracking-wider group-hover:underline inline-flex items-center gap-1">
            <span>View Job Specs</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </span>
          <Link
            href={`/portfolio/${project.slug}`}
            className="absolute inset-0 z-10"
            aria-label={`View project details for ${project.title}`}
          />
        </div>
      </div>
    </div>
  );
}
