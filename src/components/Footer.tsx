import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-card/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
              Decision-ready discovery
            </p>
            <h2 className="section-heading text-3xl text-foreground">
              Find the right tool with structure, not listicle noise.
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              findmytool is being rebuilt into a software decision engine with stronger facts, better comparisons, and a real publishing workflow.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/about" className="text-slate-700 hover:text-primary">About</Link>
            <Link href="/privacy" className="text-slate-700 hover:text-primary">Privacy</Link>
            <Link href="/terms" className="text-slate-700 hover:text-primary">Terms</Link>
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-5">
          <p className="text-xs leading-5 text-muted-foreground">
            &copy; {new Date().getFullYear()} findmytool. Structured discovery, editorial review, and Firebase-backed publishing.
          </p>
        </div>
      </div>
    </footer>
  );
}
