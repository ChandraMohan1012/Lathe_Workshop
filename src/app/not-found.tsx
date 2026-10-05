import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="w-full min-h-[70vh] pt-24 sm:pt-28 bg-surface flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-xl mx-auto flex flex-col items-center text-center gap-6">
          <span className="font-display-xl text-6xl sm:text-7xl font-bold text-primary font-mono">
            404
          </span>

          <h1 className="font-display-xl text-2xl sm:text-4xl uppercase tracking-tight text-on-surface font-bold">
            Page Not Found
          </h1>

          <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-md leading-relaxed">
            The page or component drawing you requested cannot be found. Return to the workshop home or explore our lathe services.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-outline-variant/40 w-full">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[4px] bg-[#6a5d34] text-white font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-[#7e6f3e] transition-colors"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              <span>Back to Home</span>
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[4px] bg-surface-container text-on-surface border border-outline-variant font-label-technical text-xs uppercase tracking-wider font-bold hover:bg-surface-container-high transition-colors"
            >
              <span>View Services</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
