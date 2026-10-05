export default function IndustrialMarquee() {
  const sectors = [
    'Textile Spinning & Weaving Mills',
    'Agricultural Borewell Pumps',
    'Electric Motor Drive Systems',
    'Industrial Gear & Transmission Units',
    'Automotive & Hydraulic Components',
    'Foundry & Valve Machine Works',
    'Erode • Tiruppur • Coimbatore • Salem',
  ];

  return (
    <section className="w-full bg-[#181c22] text-white py-6 overflow-hidden border-y border-[#2d3037]">
      <div className="relative w-full flex items-center overflow-hidden">
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
          {sectors.concat(sectors).map((sector, idx) => (
            <div key={idx} className="flex items-center gap-12 flex-shrink-0">
              <span className="font-label-technical text-xs uppercase tracking-widest text-[#d7dae3]">
                {sector}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#cab988]"></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
