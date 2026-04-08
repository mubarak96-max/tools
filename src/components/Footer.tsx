import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-3">
            <Image
              src="/images/logo.svg"
              alt="findbesttool"
              width={182}
              height={42}
              className="h-9 w-auto sm:h-10"
            />
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/about" className="text-slate-700 hover:text-primary">About</Link>
            <Link href="/contact" className="text-slate-700 hover:text-primary">Contact</Link>
            <Link href="/sitemap" className="text-slate-700 hover:text-primary">Sitemap</Link>
            <Link href="/privacy" className="text-slate-700 hover:text-primary">Privacy</Link>
            <Link href="/terms" className="text-slate-700 hover:text-primary">Terms</Link>
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-5">
          <p className="text-xs leading-5 text-muted-foreground">
            &copy; {new Date().getFullYear()} findbesttool. Structured discovery, editorial review, and Firebase-backed publishing.
          </p>
        </div>
      </div>
    </footer>
  );
}
