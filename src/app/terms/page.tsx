import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-gradient-primary">Terms of Service</h1>
      
      <div className="glass-card p-8 rounded-2xl space-y-6 text-muted-foreground leading-relaxed">
        <p>Last Updated: March 21, 2026</p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Acceptable Use</h2>
        <p>
          By using findbesttool, you agree to use the platform for informational and research purposes only. 
          Scraping our database or AI-generated insights for commercial resale is strictly prohibited.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. AI Content Disclaimer</h2>
        <p>
          The tool reviews, pros, cons, and comparisons on this site are generated or assisted by Artificial Intelligence. 
          While we strive for 100% accuracy, we do not guarantee the completeness or reliability of any information. 
          Always verify tool pricing and features on the official vendor websites before making a purchase.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Intellectual Property</h2>
        <p>
          All trademarks and logos of third-party tools featured on this site belong to their respective owners. 
          findbesttool is an independent research platform and is not necessarily affiliated with every tool featured.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Limitation of Liability</h2>
        <p>
          findbesttool shall not be held liable for any decisions made or actions taken based on the information provided 
          on this website. Your use of the service is at your own risk.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of the site constitutes acceptance 
          of the updated terms.
        </p>
      </div>
    </div>
  );
}
