import { mockStats } from '@/lib/mockData';

export default function StatsBanner() {
  return (
    <section className="w-full bg-surface-container-high border-y border-outline-variant/40 px-gutter py-space-md">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-space-md text-center">
        {mockStats.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-space-sm border-r last:border-r-0 border-outline-variant/30"
          >
            <span className="font-display-xl text-headline-lg text-primary uppercase font-bold tracking-tight">
              {stat.value}
            </span>
            <span className="font-label-technical text-label-technical text-on-surface-variant uppercase tracking-widest mt-1">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
