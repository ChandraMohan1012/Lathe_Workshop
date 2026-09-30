import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="w-full min-h-[75vh] pt-28 bg-surface flex items-center justify-center px-gutter py-space-2xl">
        <div className="max-w-2xl mx-auto bg-surface-container-lowest p-space-2xl rounded-2xl border border-outline-variant/60 shadow-xl flex flex-col items-center text-center gap-space-md">
          {/* Industrial Icon */}
          <div className="w-20 h-20 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl">error_med</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-surface-container px-3 py-1 rounded-full text-on-surface-variant font-label-technical text-xs uppercase tracking-widest font-semibold">
            STATUS CODE // 404 NOT FOUND
          </div>

          <h1 className="font-display-xl text-display-xl-mobile sm:text-display-xl uppercase tracking-tight text-on-surface">
            Tool Axis <span className="text-primary italic font-editorial-accent">Not Found</span>
          </h1>

          <p className="font-body-lg text-body-md text-on-surface-variant max-w-md">
            The requested drawing spec or page path does not exist on our workshop server. The tool axis may have drifted off-coordinate.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-space-md pt-space-md border-t border-outline-variant/30 w-full mt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-space-xs px-space-xl py-space-md rounded-full bg-primary text-on-primary font-headline-sm text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-base">home</span>
              <span>Return to Main Floor</span>
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center gap-space-xs px-space-lg py-space-md rounded-full bg-surface-container text-on-surface font-label-technical text-xs uppercase tracking-wider hover:bg-surface-container-high transition-colors border border-outline-variant"
            >
              <span>Explore Services</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
