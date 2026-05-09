import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-slate-900 mb-4">Terms of Service</h1>
      <p className="text-slate-500 mb-12">Last Updated: May 10, 2026</p>

      <div className="prose prose-slate max-w-none space-y-12 text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the website findbest.tools (the "Site"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily use the tools and utilities on FindBest Tools for personal or commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Modify or copy the source code of the tools;</li>
            <li>Use the materials for any automated scraping or unauthorized data collection;</li>
            <li>Attempt to decompile or reverse engineer any software contained on the Site;</li>
            <li>Remove any copyright or other proprietary notations from the materials; or</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by FindBest Tools at any time.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Disclaimer of Accuracy</h2>
          <p>
            The tools on FindBest Tools are provided on an 'as is' basis. FindBest Tools makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          <p>
            Further, FindBest Tools does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Limitations of Liability</h2>
          <p>
            In no event shall FindBest Tools or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on FindBest Tools, even if FindBest Tools or a FindBest Tools authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Intellectual Property</h2>
          <p>
            The Site and its original content, features, and functionality are and will remain the exclusive property of FindBest Tools and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of FindBest Tools.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Third-Party Links</h2>
          <p>
            FindBest Tools has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by FindBest Tools of the site. Use of any such linked website is at the user's own risk.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Advertising and Cookie Consent</h2>
          <p>
            We use third-party advertising companies to serve ads when you visit our website. These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you. Consent for these services is managed according to our Privacy Policy and relevant regional regulations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of Uganda, where the site owner is based. You irrevocably submit to the jurisdiction of the courts in that location for any disputes arising from use of this site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Changes to Terms</h2>
          <p>
            FindBest Tools may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>
      </div>
    </div>
  );
}

