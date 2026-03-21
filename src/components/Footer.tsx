import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:flex md:items-center md:justify-between">
        <div className="flex justify-center md:justify-start space-x-6 md:order-2">
          <Link href="/about" className="text-muted-foreground hover:text-foreground text-sm">About</Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground text-sm">Privacy</Link>
          <Link href="/terms" className="text-muted-foreground hover:text-foreground text-sm">Terms</Link>
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-xs leading-5 text-muted-foreground">
            &copy; {new Date().getFullYear()} findmytool. Programmatically generated with AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
