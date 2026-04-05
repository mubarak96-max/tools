import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-3xl items-center justify-center">
      <div className="glass-card w-full rounded-[2rem] p-8 text-center sm:p-12">
        <p className="primary-chip mx-auto inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
          404 Error
        </p>
        <h1 className="section-heading mt-6 text-4xl text-foreground sm:text-5xl">
          This page does not exist
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          The link may be outdated, the page may have moved, or the URL may be incorrect.
          You can return to the directory or go back to the homepage.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/tools"
            className="inline-flex min-w-[12rem] items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_16px_30px_-20px_rgba(79,70,229,0.65)] transition-colors hover:bg-primary-hover"
          >
            Browse all tools
          </Link>
          <Link
            href="/"
            className="inline-flex min-w-[12rem] items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/25 hover:text-primary"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
