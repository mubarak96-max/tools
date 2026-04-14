import React from 'react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-gradient-primary">Contact Us</h1>

      <div className="glass-card p-8 rounded-2xl space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-lg text-foreground">
          At <strong className="text-primary">FindBest.Tools</strong>, we value user feedback and are
          always looking to improve our utility suite. If you have questions regarding our tools, have
          found a bug, or would like to suggest a new tool for us to build, please reach out.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Get in Touch</h2>

        <div className="space-y-3 rounded-2xl border border-border bg-background p-6">
          <p>
            <span className="font-semibold text-foreground">Email:</span>{" "}
            <a className="text-primary hover:underline" href="mailto:mubarakmmm5@gmail.com">
              mubarakmmm5@gmail.com
            </a>
          </p>
          <p>
            <span className="font-semibold text-foreground">Response Time:</span> We aim to respond to
            all inquiries within 48 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
