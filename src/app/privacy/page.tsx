import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-gradient-primary">Privacy Policy</h1>
      
      <div className="glass-card p-8 rounded-2xl space-y-6 text-muted-foreground leading-relaxed">
        <p>Last Updated: March 21, 2026</p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Information We Collect</h2>
        <p>
          findmytool is designed to be a research-first platform. We do not require account creation for casual browsing. 
          We may collect anonymous usage data such as which tool pages are visited and general traffic patterns via Google Analytics.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Cookies</h2>
        <p>
          We use essential cookies to maintain site performance and analytics. Third-party partners (like Google Analytics) 
          may use cookies to track traffic patterns.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Affiliate Links</h2>
        <p>
          Some links on findmytool are affiliate links. If you click one of these links and make a purchase, we may receive 
          a small commission at no extra cost to you. This helps support our research and maintenance of the platform.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect the integrity of our platform and any data we manage.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Contact Us</h2>
        <p>
          If you have questions about this policy, please reach out via our official support channels.
        </p>
      </div>
    </div>
  );
}
