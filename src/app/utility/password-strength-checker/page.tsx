import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

import ToolPageScaffold from '@/components/tools/ToolPageScaffold';
import PasswordChecker from './components/PasswordChecker';

const PAGE_PATH = '/utility/password-strength-checker';
const PAGE_URL = 'https://findbest.tools/utility/password-strength-checker';
const LAST_UPDATED_ISO = '2026-05-01T00:00:00.000Z';

export const metadata: Metadata = {
  title: 'Best Password Strength Checker — Free Strong Password Tester & Complexity Analyzer (2026)',
  description:
    'The best password strength checker online. Test password security with entropy calculation, crack time estimation, common password detection, and complexity analysis. Check your password strength instantly — no data sent to servers.',
  keywords: [
    'best password strength checker',
    'password strength test',
    'strong password checker',
    'password complexity checker',
    'check my password strength',
    'check your password strength',
    'password security checker',
    'password entropy calculator',
    'how strong is my password',
    'password strength meter',
    'secure password tester',
    'password crack time estimator',
    'password analyzer',
    'password safety check',
    'online password checker',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Best Free Password Strength Checker — Test & Analyze Password Security',
    description: 'Check your password strength with entropy calculation, crack time estimation, and breach detection. Includes strong password generator.',
    url: PAGE_URL,
    siteName: 'FindBest Tools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Password Strength Checker — Free Online',
    description: 'Test password security with entropy, crack time, and complexity analysis. No data leaves your browser.',
  },
  other: {
    'article:modified_time': LAST_UPDATED_ISO,
  },
};

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Password Strength Checker',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },

    featureList: [
      'Real-time password strength scoring (0-5 scale)',
      'Entropy calculation in bits',
      'Estimated time to crack',
      'Common password database detection',
      'Keyboard sequence detection',
      'Character type analysis',
      'Leetspeak substitution detection',
      'Date and PII pattern detection',
      'Strong password generator',
      'Client-side only processing',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Check Your Password Strength',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Enter Your Password',
        text: 'Type or paste your password into the secure input field. All analysis happens in your browser — your password is never transmitted.',
      },
      {
        '@type': 'HowToStep',
        name: 'Review the Strength Score',
        text: 'Examine the 0-5 strength rating, entropy in bits, and estimated crack time to understand your password resilience.',
      },
      {
        '@type': 'HowToStep',
        name: 'Read Security Warnings',
        text: 'Check for detected issues such as common passwords, keyboard sequences, repeated characters, or date patterns.',
      },
      {
        '@type': 'HowToStep',
        name: 'Apply Improvement Suggestions',
        text: 'Follow the actionable recommendations to increase length, add character variety, and eliminate predictable patterns.',
      },
      {
        '@type': 'HowToStep',
        name: 'Generate a Strong Alternative',
        text: 'Use the built-in generator to create a cryptographically strong 16-character password with full character variety.',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the best password strength checker?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The best password strength checker combines entropy calculation, estimated crack time, common password detection, keyboard sequence analysis, and leetspeak pattern recognition. It operates entirely client-side for privacy, provides actionable improvement suggestions, and includes a strong password generator. Our tool meets all these criteria with a 0-5 scoring system backed by cryptographic math.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does a password strength test work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A password strength test calculates entropy — the measure of unpredictability — based on password length and character pool size (lowercase, uppercase, numbers, symbols). It then estimates crack time assuming an attacker uses a distributed GPU cluster capable of 10 billion guesses per second. Advanced tests also check against common password databases, detect keyboard sequences like "qwerty", identify repeated characters, and flag date patterns or leetspeak substitutions.',
        },
      },
      {
        '@type': 'Question',
        name: 'What makes a strong password?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A strong password is at least 12-16 characters long, contains all four character types (lowercase, uppercase, numbers, and special symbols), avoids dictionary words and personal information, does not use keyboard sequences or repeated characters, and has never appeared in a known data breach. Password entropy above 60 bits is considered strong; above 80 bits is very strong.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is it safe to check my password strength online?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It is safe only if the tool processes your password entirely in your browser using client-side JavaScript, never transmitting it to a server. Our strong password checker uses pure client-side analysis — no network requests, no logging, no storage. Your password never leaves your device. Never enter passwords into tools that require server-side processing or lack clear privacy policies.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is password entropy and why does it matter?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Password entropy measures unpredictability in bits. It is calculated as: length × log₂(character pool size). A password with 50 bits of entropy requires 2^50 guesses to crack on average. Higher entropy means exponentially more combinations for attackers to try. Entropy above 50 bits is decent, 60+ bits is strong, and 80+ bits is very strong against brute-force attacks.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long should my password be?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Minimum 12 characters for general accounts, 16+ for sensitive accounts like banking or email, and 20+ for high-value targets. Length is the single most important factor in password strength. A 16-character password with mixed character types has roughly 95 bits of entropy and would take centuries to crack with current technology.',
        },
      },
    ],
  },
];

const faqs = [
  {
    question: 'What is the best password strength checker available?',
    answer: 'Our tool is among the best password strength checkers because it combines entropy calculation, realistic crack time estimation, common password detection, keyboard sequence analysis, leetspeak normalization, and pattern recognition — all with zero server-side processing. Unlike basic meters that only count character types, we model actual attacker behavior.',
  },
  {
    question: 'Can I safely check my password strength on this website?',
    answer: 'Yes. All analysis runs entirely in your browser using client-side JavaScript. Your password is never transmitted to our servers, logged, or stored. You can verify this by checking your browser\'s Network tab — no requests are sent when you type. This makes our password strength test safe even for active passwords.',
  },
  {
    question: 'What is a good password strength test score?',
    answer: 'Aim for "Strong" (4/5) or "Very Strong" (5/5). This corresponds to 60+ bits of entropy and centuries of estimated crack time. "Good" (3/5) is acceptable for low-priority accounts but should be paired with MFA. Anything below "Good" should be changed immediately.',
  },
  {
    question: 'How is password crack time calculated?',
    answer: 'We assume an attacker with a distributed GPU cluster capable of 10 billion guesses per second — a realistic 2026 benchmark for well-funded adversaries. Crack time = 2^(entropy-1) / guesses_per_second. The "-1" accounts for finding the password on average halfway through the search space.',
  },
  {
    question: 'Are passphrases better than random passwords?',
    answer: 'Often yes. A five-word passphrase like "correct-horse-battery-staple-apple" has ~65 bits of entropy and is easier to memorize than a 12-character random string. However, the words must be truly random — not a famous quote or song lyric. Our password complexity checker evaluates both random passwords and passphrases accurately.',
  },
  {
    question: 'What should I do if my password scores "Very Weak"?',
    answer: 'Change it immediately on every account where it is used. Use our built-in generator to create a replacement. Enable 2FA before changing the password if possible, to prevent account lockout. Then check Have I Been Pwned to see if the password has already appeared in breaches.',
  },
];

export default function PasswordStrengthCheckerPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Utility"
        categoryHref="/utility"
        title="Password Strength Checker"
        description="The best password strength checker for security-conscious users. Run a password strength test with entropy calculation, crack time estimation, and pattern detection. Check your password strength instantly — no data ever leaves your browser."
      >
        <PasswordChecker />

        <div className="mt-16 space-y-16">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Password Strength Testing Is Non-Negotiable in 2026</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-7">
              <p>
                In an era where credential stuffing attacks account for over 80% of web application breaches, knowing how to <strong>check your password strength</strong> is not optional — it is a fundamental survival skill. A single weak password can cascade into account takeovers, identity theft, corporate data breaches, and financial ruin. Our <strong>password complexity checker</strong> goes far beyond basic length checks to deliver a comprehensive security assessment based on cryptographic entropy, real-world attack patterns, and behavioral analysis of how humans actually create passwords.
              </p>
              <p>
                Most online <strong>password strength test</strong> tools give you a colored bar and call it a day. That is dangerously insufficient. A password like <code>Password123!</code> might pass a naive checker because it has uppercase, lowercase, numbers, and a symbol. But our <strong>strong password checker</strong> recognizes it as one of the most commonly used patterns on Earth, assigns it near-zero entropy, and flags it for immediate replacement. We analyze over 500 common passwords, detect leetspeak substitutions, identify keyboard walks, and estimate realistic crack times using modern GPU cluster benchmarks.
              </p>
            </div>
          </section>

          <section id="how-it-works">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How Our Password Strength Test Works</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-7">
              <p>
                Our <strong>password complexity checker</strong> uses a multi-layered analysis engine that evaluates your password across six independent dimensions. Each dimension contributes to a final 0-5 strength score that correlates directly with real-world attack resistance.
              </p>
              <p>
                <strong>Layer 1: Entropy Calculation.</strong> We compute Shannon entropy based on password length and character pool diversity. A password using only lowercase letters draws from a pool of 26 characters. Adding uppercase doubles the pool to 52. Numbers expand it to 62, and special characters push it to 95. The formula is simple but devastating for attackers: <code>entropy = length × log₂(pool_size)</code>. Every additional bit of entropy doubles the attacker&apos;s required effort.
              </p>
              <p>
                <strong>Layer 2: Common Password Detection.</strong> We maintain a database of the 500 most frequently breached passwords from Have I Been Pwned, RockYou, and NIST compromised credential lists. If your password matches or is a trivial variant (like adding &quot;123&quot; to a common base), we flag it immediately. This is why our <strong>strong password checker</strong> catches passwords that other tools miss.
              </p>
              <p>
                <strong>Layer 3: Pattern Recognition.</strong> Humans are predictable. We check for keyboard sequences (qwerty, asdf, 1234), repeated characters (aaa, 1111), date formats (1990, 12/05/2023), and leetspeak substitutions (a→@, e→3, o→0, s→5). Attackers run these patterns in their first million guesses, so any password containing them is effectively compromised before the attack even begins.
              </p>
              <p>
                <strong>Layer 4: Crack Time Estimation.</strong> We model a motivated attacker with access to a distributed GPU cluster capable of 10 billion guesses per second — a realistic benchmark for 2026. We then calculate the average time required to brute-force your password at that speed. A password scoring &quot;Very Strong&quot; on our scale would require millennia to crack, making it effectively unbreakable with current technology.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Password Entropy & Crack Time Reference</h2>
            <p className="text-slate-700 mb-6 leading-7">
              Use this table to understand what your <strong>password strength test</strong> results mean in practical terms. All estimates assume a 10 billion guesses/second attack.
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Entropy (bits)</th>
                    <th className="px-4 py-3">Strength Rating</th>
                    <th className="px-4 py-3">Estimated Crack Time</th>
                    <th className="px-4 py-3">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  <tr>
                    <td className="px-4 py-3 font-mono">&lt; 28</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">Very Weak</span></td>
                    <td className="px-4 py-3">Instantly — seconds</td>
                    <td className="px-4 py-3">Do not use. Change immediately.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono">28–35</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">Weak</span></td>
                    <td className="px-4 py-3">Minutes to hours</td>
                    <td className="px-4 py-3">Unacceptable for any account.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono">36–50</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Fair</span></td>
                    <td className="px-4 py-3">Days to months</td>
                    <td className="px-4 py-3">Minimum for low-priority accounts.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono">51–60</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Good</span></td>
                    <td className="px-4 py-3">Years to decades</td>
                    <td className="px-4 py-3">Acceptable for general accounts.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono">61–80</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Strong</span></td>
                    <td className="px-4 py-3">Centuries</td>
                    <td className="px-4 py-3">Recommended for email, banking.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono">&gt; 80</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">Very Strong</span></td>
                    <td className="px-4 py-3">Millennia+</td>
                    <td className="px-4 py-3">Ideal for high-security targets.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Password Mistakes That Even Smart People Make</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                  <span>❌</span> Dictionary Words + Numbers
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <code>Dragon123</code>, <code>Password2026</code>, and <code>Welcome1</code> are structurally identical to attackers. Our <strong>password complexity checker</strong> flags these instantly because they appear in every password cracking dictionary.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                  <span>❌</span> Leetspeak Substitutions
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <code>P@ssw0rd</code> and <code>1l0v3y0u</code> feel clever but are automated in modern cracking rules. Our <strong>strong password checker</strong> normalizes leetspeak and compares against common bases.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                  <span>❌</span> Keyboard Walks
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <code>qwerty</code>, <code>1qaz2wsx</code>, and <code>!@#$%^</code> are the first sequences attackers try. They require virtually no computational effort to crack. <strong>Check my password strength</strong> — if it contains these, change it now.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                  <span>❌</span> Personal Information
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Birthdays, pet names, addresses, and phone numbers are trivial to discover via social engineering or public records. Never use them in passwords, even with numbers appended.
                </p>
              </div>
            </div>
          </section>

          <section id="password-managers">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Why You Should Use a Password Manager Instead of Memorizing</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-7">
              <p>
                The human brain is incapable of generating and remembering truly random 16-character passwords for every account. Studies show that even security professionals fall back to predictable patterns when forced to memorize complex credentials. A password manager eliminates this vulnerability by generating cryptographically random passwords, storing them in an encrypted vault, and auto-filling them across devices. When you <strong>check your password strength</strong> with our tool and it recommends a 20-character random string, a password manager is the only practical way to use it.
              </p>
              <p>
                Leading password managers like Bitwarden, 1Password, and Proton Pass use AES-256 or equivalent encryption with zero-knowledge architecture — meaning the provider cannot access your vault even under legal compulsion. They also alert you when a password appears in known data breaches, a feature that complements our <strong>password strength test</strong> by monitoring your credentials over time. If you are still reusing passwords across sites or writing them in notes apps, you are one breach away from total account compromise.
              </p>
            </div>

            <div className="mt-6 bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
              <p className="font-semibold text-indigo-900 m-0">Security Best Practice</p>
              <p className="text-indigo-800 m-0 mt-1 text-sm leading-relaxed text-slate-700">
                Generate a unique 16-20 character password for every account using our built-in generator. Store them in a password manager. Enable two-factor authentication (2FA) everywhere possible. <strong>Check my password strength</strong> quarterly for critical accounts and rotate any that score below &quot;Good.&quot;
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Passwords Alone Are Not Enough: The Case for MFA</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-7">
              <p>
                Even a &quot;Very Strong&quot; password can be compromised through phishing, keyloggers, or database breaches. Multi-factor authentication (MFA) — also called two-factor authentication (2FA) — adds a second verification layer that renders stolen passwords useless. The three factor categories are: something you know (password), something you have (phone or hardware key), and something you are (biometric).
              </p>
              <p>
                <strong>SMS-based 2FA</strong> is better than nothing but vulnerable to SIM swapping attacks. <strong>Authenticator apps</strong> like Google Authenticator, Authy, and Microsoft Authenticator generate time-based one-time passwords (TOTP) locally on your device, eliminating SIM swap risk. <strong>Hardware security keys</strong> like YubiKey provide the strongest protection using FIDO2/WebAuthn standards, resistant to phishing because they cryptographically verify the domain before authenticating.
              </p>
              <p>
                When you <strong>check your password strength</strong> and achieve a top score, treat that as the baseline, not the finish line. Pair strong passwords with app-based or hardware MFA for all email, banking, cloud storage, and social media accounts. According to Microsoft, MFA blocks 99.9% of automated credential stuffing attacks.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions About Password Security</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="group bg-white border border-slate-200 rounded-xl open:ring-2 open:ring-indigo-500/20 transition-all">
                  <summary className="flex justify-between items-center cursor-pointer p-5 font-semibold text-slate-800 list-none">
                    {faq.question}
                    <ChevronDown size={18} className="transition group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 text-slate-600 leading-7">{faq.answer}</div>
                </details>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Marketing and Utility Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: 'UTM Builder',
                  href: '/utility/utm-builder',
                  description: 'Generate campaign tracking URLs with validation for Google Analytics 4.',
                },
                {
                  name: 'What Is My IP Address?',
                  href: '/utility/what-is-my-ip',
                  description: 'Quickly find your public and private IP for whitelisting and security checks.',
                },
                {
                  name: 'QR Code Generator',
                  href: '/utility/create-qr-code-online',
                  description: 'Create trackable QR codes for your physical marketing materials.',
                },
                {
                  name: 'DNS Checker',
                  href: '/utility/dns-checker',
                  description: 'Verify your tracking domain and MX records for email marketing.',
                },
                {
                  name: 'Barcode Generator',
                  href: '/utility/barcode-generator',
                  description: 'Generate professional barcodes in multiple formats for inventory.',
                },
                {
                  name: 'GPA Calculator',
                  href: '/utility/gpa-calculator',
                  description: 'Calculate your cumulative GPA quickly with our academic tool.',
                },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-indigo-300 hover:shadow-lg"
                >
                  <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-indigo-600">{tool.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{tool.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-slate-900 text-slate-300 rounded-2xl p-8 lg:p-10">
            <h2 className="text-xl font-bold text-white mb-4">About This Password Strength Checker & Security Methodology</h2>
            <div className="space-y-4 text-sm leading-7">
              <p>
                This <strong>password strength checker</strong> is developed and maintained by the security engineering team at FindBest Tools. Our analysis engine implements entropy calculation per Claude Shannon&apos;s information theory, crack time estimation based on NIST SP 800-63B guidelines, and pattern detection algorithms derived from academic research on human password behavior.
              </p>
              <p>
                <strong>Privacy Guarantee:</strong> All password analysis occurs client-side using pure JavaScript. No password data is transmitted to our servers, logged in databases, or shared with third parties. You can verify this by monitoring your browser&apos;s Network tab — zero outbound requests occur during analysis. This zero-trust architecture makes our <strong>password strength test</strong> suitable for evaluating production credentials without exposure risk.
              </p>
              <p>
                <strong>Common Password Database:</strong> Our detection list includes the top 500 most frequently breached passwords from Have I Been Pwned, RockYou, and NIST compromised credential corpuses. The database is updated quarterly as new breach datasets become available.
              </p>
              <p>
                <strong>Last Updated:</strong> May 1, 2026. Our crack time estimates assume a 10 billion guesses/second adversary, reflecting 2026 GPU cluster capabilities. As hardware advances, we adjust benchmarks to maintain accuracy.
              </p>
            </div>
          </section>
        </div>
      </ToolPageScaffold>
    </div>
  );
}
