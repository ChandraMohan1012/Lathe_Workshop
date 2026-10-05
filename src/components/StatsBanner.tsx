import { WorkshopSettings } from '@/types';
import { initialSettings } from '@/lib/mockData';

interface StatsBannerProps {
  settings?: WorkshopSettings;
}

export default function StatsBanner({ settings = initialSettings }: StatsBannerProps) {
  const statsList = [
    { label: 'Active Turning Bays', value: `${settings.activeBays} / ${settings.totalBays}` },
    { label: 'Standard Tolerance', value: settings.standardTolerance || '±0.005mm' },
    { label: 'Turnaround Time', value: '24-48 Hours' },
    { label: 'Industrial Hub', value: 'Erode & Western TN' },
  ];

  return (
    <section className="w-full bg-surface border-y border-outline-variant/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
        {statsList.map((stat, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-start sm:items-center justify-center py-2 px-4 md:px-6 ${
              idx !== statsList.length - 1 ? 'md:border-r md:border-outline-variant/40' : ''
            }`}
          >
            <span className="font-display-xl text-2xl sm:text-3xl lg:text-4xl text-on-surface font-bold tracking-tight">
              {stat.value}
            </span>
            <span className="font-label-technical text-[11px] text-on-surface-variant uppercase tracking-widest mt-1">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
