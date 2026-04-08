import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-gradient-primary">Privacy Policy</h1>

      <div className="glass-card p-8 rounded-2xl space-y-6 text-muted-foreground leading-relaxed">
        <p>Last Updated: March 21, 2026</p>

        <p className="text-lg text-foreground">
          At <strong className="text-primary">FindBest Tools</strong> (findbest.tools), the privacy of
          our visitors is a top priority. This policy outlines the types of information collected and
          how it is used.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Data Usage</h2>
        <p>
          Most of our tools process data locally in your browser. We do not store or collect the data
          you input into these tools unless explicitly stated.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Log Files</h2>
        <p>
          Like most standard website servers, we use log files. This includes internet protocol (IP)
          addresses, browser type, Internet Service Provider (ISP), date/time stamps, and
          referring/exit pages. This data is used solely to analyze trends and administer the site.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Cookies and Google AdSense</h2>
        <p>
          Google, as a third-party vendor, uses cookies to serve ads on this site.
        </p>
        <p>
          Google&apos;s use of the DART cookie enables it to serve ads to our users based on their visit
          to this site and other sites on the Internet.
        </p>
        <p>
          Users may opt out of the use of the DART cookie by visiting the Google Ad and Content Network
          privacy policy.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Third-Party Privacy</h2>
        <p>
          Our Privacy Policy does not apply to other advertisers or websites. We advise you to consult
          the respective Privacy Policies of these third-party ad servers for more detailed information
          on their practices.
        </p>
      </div>
    </div>
  );
}
