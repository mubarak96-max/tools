import React from 'react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-gradient-primary">About FindBest Tools</h1>

      <div className="glass-card p-8 rounded-2xl space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-lg text-foreground">
          <strong className="text-primary">FindBest Tools</strong> is a browser-based utility site built
          around practical tasks people need to finish quickly: text cleanup, OCR, finance calculations,
          and lightweight AI-assisted writing workflows.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Our Goal</h2>
        <p>
          We aim to make useful tools accessible without sign-up friction, bulky software, or confusing
          interfaces. Each page is designed to help users get one clear job done with as little setup as
          possible.
        </p>

        <p>
          We focus on three things: fast output, readable interfaces, and trustworthy behavior. Most
          tools run directly in the browser, and where third-party services are used, we explain that in
          our privacy policy.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">What You&apos;ll Find Here</h2>
        <p>
          The site currently includes text tools such as OCR, character counting, case conversion, ASCII
          art, and cleanup utilities, alongside finance calculators for salary, loans, VAT, discounts,
          and pricing workflows. We also maintain a smaller AI utility section for focused writing tasks.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">How We Sustain the Site</h2>
        <p>
          FindBest Tools is designed to be free to use. We may use advertising and analytics to support
          the site, and we keep public pages for privacy, terms, contact, and sitemap easy to access
          from the footer on every page.
        </p>
      </div>
    </div>
  );
}
