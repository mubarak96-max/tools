import React from 'react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-gradient-primary">About FindBest Tools</h1>

      <div className="glass-card p-8 rounded-2xl space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-lg text-foreground">
          <strong className="text-primary">FindBest Tools</strong> is a browser-based utility site built
          around practical tasks people need to finish quickly: text analysis, coding translations,
          real estate tax estimations, health tracking, and professional productivity.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Our Goal</h2>
        <p>
          We aim to make useful tools accessible without sign-up friction, bulky software, or confusing
          interfaces. Each page is designed to help users get one clear job done with as little setup as
          possible.
        </p>

        <p>
          We focus on three things: fast output, readable interfaces, and privacy-conscious behavior.
          Most tools run directly in your browser, meaning your data stays local unless explicitly needed
          for a specific service.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">What You&apos;ll Find Here</h2>
        <p>
          The site currently includes text tools for word frequency, Morse code, binary translation, and OCR
          alongside specialized calculators for NYC real estate transfer taxes and health tracking (BMR).
          We also provide professional utilities for building CVs/resumes and managing QR codes or barcodes.
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
