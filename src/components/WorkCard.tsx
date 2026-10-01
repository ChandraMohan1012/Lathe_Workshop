import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types';

interface WorkCardProps {
  project: Project;
}

export default function WorkCard({ project }: WorkCardProps) {
  return (
    <div className="interactive-card bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden flex flex-col h-full group">
      {/* Image Preview Container */}
      <div className="relative h-56 w-full bg-surface-container overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>

      {/* Content */}
      <div className="p-space-lg flex flex-col flex-grow justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between text-xs text-on-surface-variant font-label-technical uppercase tracking-wider">
            <span>{project.material}</span>
            <span>{project.quantity}</span>
          </div>

          <h3 className="font-headline-sm text-lg uppercase tracking-tight text-on-surface group-hover:text-primary transition-colors line-clamp-2 mt-1">
            {project.title}
          </h3>

          <p className="font-body-md text-sm text-on-surface-variant line-clamp-2 mt-1">
            {project.description}
          </p>
        </div>

        {/* Action Link */}
        <div className="pt-space-sm border-t border-outline-variant/30 flex items-center justify-between">
          <span className="font-label-technical text-xs text-primary uppercase font-semibold tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            View Job Specs & Drawings
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
