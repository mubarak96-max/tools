import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-gradient-primary">Privacy Policy</h1>

      <div className="glass-card p-8 rounded-2xl space-y-6 text-muted-foreground leading-relaxed">
        <p>Last Updated: April 21, 2026</p>

        <p className="text-lg text-foreground">
          At <strong className="text-primary">FindBest Tools</strong> (findbest.tools), the privacy of
          our visitors is a top priority. This policy explains what information may be processed when you
          use the site and which third-party services we rely on for advertising and analytics.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. How the tools handle your input</h2>
        <p>
          Most text and calculator tools process data locally in your browser. We do not intentionally
          store the text, images, or numbers you enter into those tools unless a page explicitly says it
          sends data to a third-party service.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Analytics and advertising</h2>
        <p>
          We use Google AdSense to fund the site through advertising and Google Analytics to understand
          aggregate site usage. These services may set or read cookies, process IP address information,
          and collect browser or device data needed for measurement, fraud prevention, and ad delivery.
        </p>
        <p>
          Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits
          to this website or other websites. Google's use of advertising cookies enables Google and its
          partners to serve ads based on visits to this site and other sites on the Internet.
        </p>
        <p>
          In regions where Google requires consent for ads or analytics, you may see a Google-managed
          consent message configured through Google AdSense privacy settings.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Cookies and related technologies</h2>
        <p>
          Google and other service providers may use cookies, local storage, or similar technologies to
          measure traffic, limit abuse, personalize experiences where permitted, and serve ads.
        </p>
        <p>
          You can opt out of personalized advertising by visiting{" "}
          <a className="text-primary hover:underline" href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>
          . You can also learn about opting out of some third-party vendors' personalized advertising at{" "}
          <a className="text-primary hover:underline" href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer">
            aboutads.info
          </a>
          .
        </p>
        <p>
          For more information about how Google uses data on partner sites, visit{" "}
          <a className="text-primary hover:underline" href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
            How Google uses information from sites or apps that use our services
          </a>
          .
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Server logs and operational data</h2>
        <p>
          Like most websites, our hosting and application stack may process operational data such as IP
          address, browser type, referring page, timestamps, and error logs. We use that information to
          secure the site, debug issues, and keep the service running.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Other third-party services</h2>
        <p>
          Some tools may rely on third-party providers for specific functionality, such as OCR or AI text
          processing. Where that happens, the page or workflow should make it clear that external
          processing is involved. Those providers may process submitted data according to their own terms
          and privacy notices.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">6. Your options</h2>
        <p>
          You can use your browser controls to limit cookies or tracking, use Google's ad personalization
          controls, or contact us if you have questions about data handling.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">7. Contact</h2>
        <p>
          If you have privacy questions, contact us at{" "}
          <a className="text-primary hover:underline" href="mailto:mubarakmmm5@gmail.com">
            mubarakmmm5@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
