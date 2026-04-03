import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
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
            <Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
            <Link href="/admin" className="text-muted-foreground hover:text-foreground">Admin</Link>
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
