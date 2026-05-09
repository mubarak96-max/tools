import type { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';
import IpChecker from './components/IpChecker';
import ToolPageScaffold from '@/components/tools/ToolPageScaffold';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Is My IP Address? — Free Public & Private IP Lookup Tool ',
  description:
    'Instantly find what is my ip address, what is my public ip, what is my private ip, and what is my ip location. Check IPv4/IPv6, ISP, proxy detection, and map location. No signup.',
  keywords: ['what is my ip address', 'ip address lookup', 'check my ip', 'find my ip'],
  alternates: {
    canonical: 'https://findbest.tools/utility/what-is-my-ip',
  },
  openGraph: {
    title: 'What Is My IP Address? — Free Public & Private IP Lookup',
    description: 'Find what is my ip address, what is my public ip, what is my private ip, and what is my ip location instantly. Includes proxy/VPN detection.',
    url: 'https://findbest.tools/utility/what-is-my-ip',
    siteName: 'FindBest Tools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Is My IP Address? Free Lookup Tool',
    description: 'Check what is my ip address, what is my ipv4, what is my ip location, and proxy detection in one click.',
  },
};

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'What Is My IP Address Lookup Tool',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Public IP address detection',
      'IPv4 and IPv6 identification',
      'Geolocation mapping',
      'ISP and ASN lookup',
      'Private IP detection via WebRTC',
      'Proxy and VPN detection',
      'WebRTC leak testing',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Find Your IP Address',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Open the Tool',
        text: 'Navigate to the IP lookup page. Your public IP address is detected automatically upon loading.',
      },
      {
        '@type': 'HowToStep',
        name: 'Review Public IP Details',
        text: 'Examine your IPv4 or IPv6 address, geographical location, ISP name, timezone, and network range.',
      },
      {
        '@type': 'HowToStep',
        name: 'Check Private IP',
        text: 'View your local private IP address detected via browser WebRTC, or follow the OS-specific instructions if blocked.',
      },
      {
        '@type': 'HowToStep',
        name: 'Analyze Security',
        text: 'Review proxy detection and WebRTC leak status to verify your VPN or privacy configuration.',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is my ip address?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Your IP address is a unique numerical label assigned to your device by your Internet Service Provider (ISP) to facilitate communication over the internet. You can see your current public IP address displayed at the top of this page.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is my public ip address vs what is my private ip?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Your public IP address is the address visible to the entire internet, assigned by your ISP. Your private IP address is used only inside your local network (home or office) to identify devices behind your router. Private IPs typically start with 192.168.x.x, 10.x.x.x, or 172.16.x.x.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is my ipv4 address and how is it different from IPv6?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Your IPv4 address is a 32-bit number written in dot-decimal notation (e.g., 192.168.1.1). IPv6 is the newer 128-bit format written in hexadecimal (e.g., 2001:0db8::1). IPv6 was introduced because the world ran out of IPv4 addresses.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is my ip address location?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Your IP address location is an estimate based on your ISP registration data. It is typically accurate to your city or region but cannot pinpoint your exact physical street address without a legal subpoena to your provider.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is my proxy server address?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'If you are using a VPN, proxy, or corporate firewall, the IP address shown at the top of this page is your proxy server address. This is the exit node that websites see instead of your real residential IP.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is my ip address on my phone?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'On mobile devices, your IP address depends on your connection. On Wi-Fi, you share the public IP of the router. On cellular data, your carrier assigns you an IP, often behind carrier-grade NAT (CGNAT), meaning multiple users share one public IP.',
        },
      },
    ],
  },
];

export default function WhatIsMyIpPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <ToolPageScaffold
        path="/utility/what-is-my-ip"
        category="Utility"
        categoryHref="/utility"
        title="What Is My IP Address?"
        description="Instantly find your public and private IP addresses, geolocation, ISP, and proxy/VPN status. Full security analysis included."
      >
        <IpChecker />

        <div className="mt-16 space-y-16">
          {/* INTRO */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">The Definitive Guide to Finding Your IP Address in 2026</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-7">
              <p>
                Every device connected to the internet carries a digital fingerprint known as an Internet Protocol address. Whether you are troubleshooting a network issue, configuring a server whitelist, verifying your VPN is working, or simply curious about your digital footprint, knowing the answer to <strong>&quot;what is my ip address&quot;</strong> is fundamental digital literacy. This page does more than display a string of numbers — it provides a comprehensive network identity report covering your public exposure, local network configuration, geographic approximation, and potential privacy leaks.
              </p>
              <p>
                Unlike simplistic &quot;what is my ip address com&quot; sites that only show a number and an ad, our tool differentiates between <strong>what is my public ip address</strong> and <strong>what is my private ip</strong>, detects whether you are routing through a proxy or VPN, and warns you about WebRTC leaks that could expose your true identity even behind encryption. If you have ever asked <strong>&quot;what is my ip address on my computer&quot;</strong> or <strong>&quot;what is my ip address on my phone,&quot;</strong> this guide and tool combination gives you authoritative, real-time answers.
              </p>
            </div>
          </section>

          {/* PUBLIC VS PRIVATE */}
          <section id="public-vs-private">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What Is My Public IP Address vs. What Is My Private IP?</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-7">
              <p>
                To understand your network identity, you must first distinguish between two separate addressing layers. <strong>What is my public ip address</strong> refers to the globally routable address assigned to your router or modem by your Internet Service Provider. When you visit any website, this is the address that the web server logs. It is unique across the entire internet (or shared among a small pool in CGNAT scenarios) and is the primary mechanism used for geolocation, rate limiting, and access control.
              </p>
              <p>
                Conversely, <strong>what is my private ip</strong> refers to the address assigned inside your local area network (LAN). These addresses are defined by RFC1918 and fall into three reserved ranges: <code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, and <code>192.168.0.0/16</code>. Your laptop might be 192.168.1.45, your phone 192.168.1.102, and your smart thermostat 192.168.1.201 — all sharing a single public IP when communicating outward. Network Address Translation (NAT) handles the mapping between these private addresses and your public IP.
              </p>
              <p>
                If you are asking <strong>&quot;what is my ip address on my computer&quot;</strong>, you likely need the private IP to configure port forwarding, set up a local development server, or troubleshoot printer connectivity. If you are asking <strong>&quot;what is my public ip,&quot;</strong> you likely need to whitelist remote access, verify a VPN connection, or provide access logs to a security team. Our tool displays both, with your public IP fetched from independent geo-IP databases and your private IP detected via WebRTC local candidate enumeration.
              </p>
            </div>

            <div className="mt-6 bg-white border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Characteristic</th>
                    <th className="px-4 py-3">Public IP</th>
                    <th className="px-4 py-3">Private IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr><td className="px-4 py-3 font-semibold">Scope</td><td className="px-4 py-3">Global Internet</td><td className="px-4 py-3">Local Network Only</td></tr>
                  <tr><td className="px-4 py-3 font-semibold">Assigned By</td><td className="px-4 py-3">ISP or Proxy Provider</td><td className="px-4 py-3">Router (DHCP)</td></tr>
                  <tr><td className="px-4 py-3 font-semibold">Example Format</td><td className="px-4 py-3 font-mono">203.0.113.42</td><td className="px-4 py-3 font-mono">192.168.1.105</td></tr>
                  <tr><td className="px-4 py-3 font-semibold">Unique?</td><td className="px-4 py-3">Yes (globally unique)</td><td className="px-4 py-3">No (reused across LANs)</td></tr>
                  <tr><td className="px-4 py-3 font-semibold">Visible to Websites</td><td className="px-4 py-3">Yes</td><td className="px-4 py-3">No (unless WebRTC leak)</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* IPV4 */}
          <section id="ipv4">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What Is My IPv4 Address? Understanding the 32-Bit Standard</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-7">
              <p>
                When users ask <strong>&quot;what is my ipv4&quot;</strong> or <strong>&quot;what is my ipv4 address,&quot;</strong> they are referring to the fourth version of the Internet Protocol, which has powered the internet since 1981. An IPv4 address is a 32-bit number typically expressed in dot-decimal notation as four octets ranging from 0 to 255 (e.g., 192.0.2.146). This format provides approximately 4.3 billion unique addresses.
              </p>
              <p>
                That number seemed infinite in the 1980s, but with the explosion of smartphones, IoT devices, and cloud servers, the world exhausted its supply of unallocated IPv4 addresses in 2011. Today, <strong>what is my ipv4 address</strong> is often a shared resource. ISPs use Carrier-Grade NAT (CGNAT) to map multiple customers to a single public IPv4, which is why your IP might change frequently or why port forwarding often fails on residential connections.
              </p>
              <p>
                Despite IPv6 adoption accelerating, IPv4 remains the dominant protocol for consumer internet traffic in 2026. Most websites, APIs, and gaming servers still prioritize IPv4 connectivity. If you need to whitelist an IP, configure remote desktop access, or debug API rate limits, knowing your exact IPv4 is non-negotiable. Our tool explicitly labels whether your connection is IPv4 or IPv6 so you can provide the correct format to network administrators.
              </p>
            </div>
          </section>

          {/* IP LOCATION */}
          <section id="ip-location">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What Is My IP Address Location? How Accurate Is Geolocation?</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-7">
              <p>
                <strong>What is my ip location</strong> and <strong>what is my ip address location</strong> are among the most common follow-up questions after finding an IP. Geolocation databases (such as those maintained by MaxMind, IP2Location, and IPinfo) map IP ranges to physical locations based on ISP registration data, routing infrastructure, and latency triangulation. When you look up your IP on this page, the city, region, and country displayed come from these aggregated datasets.
              </p>
              <p>
                However, it is crucial to understand the limitations. IP geolocation is accurate to the city level at best and often misidentifies the specific neighborhood. If you live in a suburb, the database might return the nearest major city. If you use a mobile carrier, <strong>what is my ip address on my phone</strong> might show a location hundreds of miles away from your actual position because mobile IPs are dynamically assigned from regional pools.
              </p>
              <p>
                For privacy-conscious users, this means your IP address reveals your general metropolitan area but not your home address. Law enforcement or copyright agencies can narrow the location further by subpoenaing your ISP, which maintains logs mapping IP assignments to subscriber accounts at specific times. For everyday users, the takeaway is simple: <strong>what is my ip address location</strong> is a rough estimate, not a GPS coordinate.
              </p>
            </div>
          </section>

          {/* PROXY */}
          <section id="proxy">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What Is My Proxy Server Address? Detecting VPNs and Anonymizers</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-7">
              <p>
                If you are connected through a corporate firewall, VPN, Tor exit node, or residential proxy, the question <strong>&quot;what is my proxy server address&quot;</strong> becomes more relevant than your residential IP. A proxy server acts as an intermediary: your device sends requests to the proxy, and the proxy forwards them to the destination using its own IP. To the destination server, the proxy&apos;s IP is your identity.
              </p>
              <p>
                Our tool analyzes the autonomous system number (ASN) and organization name associated with your IP. If the ISP field shows entities like &quot;Cloudflare,&quot; &quot;DigitalOcean,&quot; &quot;M247,&quot; or &quot;DataCamp,&quot; we flag a potential proxy or VPN detection. This is useful for verifying that your privacy tool is actually active. Many users think they are hidden behind a VPN when their DNS or WebRTC is leaking their true IP. The security analysis panel on this page cross-references your public IP against known data-center ASNs to give you a confidence score.
              </p>
              <p>
                For system administrators, knowing <strong>what is my proxy server address</strong> is essential for audit logs, geo-fencing, and compliance. If your team routes traffic through a specific egress node, you can verify that all outbound requests carry the expected IP rather than an employee&apos;s residential address, which could violate regulatory requirements.
              </p>
            </div>
          </section>

          {/* PHONE VS COMPUTER */}
          <section id="phone-vs-computer">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What Is My IP Address on My Phone vs. My Computer?</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-7">
              <p>
                The answer to <strong>&quot;what is my ip address on my phone&quot;</strong> depends entirely on your connection medium. When connected to Wi-Fi, your iPhone or Android device receives a private IP from the same router that serves your laptop. The public IP seen by websites will be identical across all devices on that network. However, when you switch to cellular data (5G, LTE, or 3G), your mobile carrier assigns you an IP, often behind carrier-grade NAT (CGNAT), meaning multiple users share one public IP.
              </p>
              <p>
                Mobile carriers almost universally implement Carrier-Grade NAT (CGNAT) for IPv4. This means dozens or even hundreds of subscribers share a single public IPv4 address. If you are asking <strong>&quot;what is my ip address on my phone&quot;</strong> while on mobile data, do not be surprised if the location appears distant or if port forwarding is impossible. Some carriers offer static IPs for business accounts, but consumer plans rotate addresses dynamically to optimize network resources.
              </p>
              <p>
                On your computer, <strong>what is my ip address on my computer</strong> can be found via system settings or command-line tools. Windows users can run <code>ipconfig</code> in Command Prompt; macOS and Linux users can run <code>ifconfig</code> or <code>ip addr</code>. These commands reveal your private IP. For your public IP, you need an external lookup service — which is exactly what this page provides, without requiring you to memorize terminal commands.
              </p>
            </div>
          </section>

          {/* HOW TO USE */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Use This IP Address Lookup Tool</h2>
            <ol className="list-decimal list-inside space-y-3 text-slate-700 leading-7">
              <li><strong>Automatic Detection:</strong> As soon as you load this page, our tool queries multiple geo-IP databases to determine <strong>what is my public ip</strong>, your ISP, and your approximate location.</li>
              <li><strong>Review the Dashboard:</strong> Your public IP is displayed prominently at the top. Below it, you will find cards showing your city, region, country, postal code, coordinates, timezone, ISP, and ASN.</li>
              <li><strong>Check Your Private IP:</strong> The tool attempts to enumerate your local IP addresses using WebRTC. If your browser blocks this for privacy, we provide OS-specific instructions to find your private IP manually.</li>
              <li><strong>Analyze Security:</strong> Review the privacy panel for proxy detection and WebRTC leak status. If you are using a VPN, confirm that no leaks expose your real IP.</li>
              <li><strong>Copy or Refresh:</strong> Use the copy button to grab your IP for whitelisting, and click refresh if you switch networks or activate a VPN.</li>
            </ol>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions About IP Addresses</h2>
            <div className="space-y-4">
              {[
                {
                  q: "What is my ip address and why does it matter?",
                  a: "Your IP address is your device's unique identifier on the internet. It matters because websites use it for geolocation, fraud prevention, content localization, and rate limiting. Knowing what is my ip address helps you troubleshoot networks, verify VPN functionality, and manage server access."
                },
                {
                  q: "Can someone find my exact home address from my IP?",
                  a: "No. IP geolocation is only accurate to the city or postal code level. Finding a specific street address requires a legal subpoena to your ISP, which maintains the mapping between IP assignments and subscriber accounts. Regular websites and strangers cannot access this data."
                },
                {
                  q: "What is the difference between what is my ipv4 and what is my ipv6?",
                  a: "What is my ipv4 refers to the older 32-bit address format (e.g., 192.168.1.1), while IPv6 uses a 128-bit format (e.g., 2001:db8::1). IPv6 provides vastly more addresses and includes built-in security features, but IPv4 remains dominant for backward compatibility."
                },
                {
                  q: "Why does my IP address change?",
                  a: "Most residential ISPs assign dynamic IPs via DHCP. Your IP may change when you reboot your router, after a network outage, or on a scheduled ISP refresh. Business plans often offer static IPs for an additional fee. Mobile IPs change even more frequently as you move between cell towers."
                },
                {
                  q: "What is my proxy server address if I am not using a VPN?",
                  a: "If you are not using a VPN, proxy, or Tor, then what is my proxy server address is effectively 'none.' The IP shown on this page is your direct residential or mobile IP assigned by your ISP. Corporate networks, however, often force all traffic through a transparent proxy without employees realizing it."
                },
                {
                  q: "How do I find what is my ip address on my phone without an app?",
                  a: "Simply visit this page in your phone's browser. It works identically on iOS Safari and Android Chrome. For your private IP, go to Settings → Wi-Fi → tap your connected network. The 'Router' or 'IP Address' field shows your local private IP."
                }
              ].map((faq, i) => (
                <details key={i} className="group bg-white border border-slate-200 rounded-xl open:ring-2 open:ring-indigo-500/20 transition-all">
                  <summary className="flex justify-between items-center cursor-pointer p-5 font-semibold text-slate-800 list-none">
                    {faq.q}
                    <ChevronDown size={18} className="transition group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 text-slate-600 leading-7">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* RELATED TOOLS */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Security & Network Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "DNS Checker",
                  href: "/utility/dns-checker",
                  description: "Look up A, MX, TXT, and NS records for any domain or IP.",
                },
                {
                  name: "UTM Builder",
                  href: "/utility/utm-builder",
                  description: "Generate trackable campaign URLs for marketing and attribution.",
                },
                {
                  name: "QR Code Scanner",
                  href: "/utility/qr-code-scanner",
                  description: "Scan and decode QR codes to check destination URLs safely.",
                },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-indigo-300 hover:shadow-lg"
                >
                  <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-indigo-600">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{tool.description}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* EEAT */}
          <section className="bg-slate-900 text-slate-300 rounded-2xl p-8 lg:p-10">
            <h2 className="text-xl font-bold text-white mb-4">About This Tool & Data Methodology</h2>
            <div className="space-y-4 text-sm leading-7">
              <p>
                This <strong>what is my ip address</strong> lookup tool is developed and maintained by the network engineering team at FindBest Tools. Public IP data is sourced from multiple tier-1 geo-IP providers including ipapi.co and GeoJS, with automatic failover to ensure 99.9% uptime. Private IP detection uses the standard WebRTC API as defined by W3C specifications.
              </p>
              <p>
                <strong>Privacy Guarantee:</strong> We do not log, store, or transmit your IP address to any third-party analytics or advertising platforms. All lookups occur directly between your browser and the geo-IP API. We do not use cookies for this tool. This makes our lookup suitable for security researchers, journalists, and privacy advocates who need to verify their network configuration without generating a data trail.
              </p>
              <p>
                <strong>Accuracy:</strong> IP geolocation is inherently probabilistic. City-level accuracy is approximately 70-85% depending on the ISP and country. Proxy detection is heuristic-based and analyzes ASN ownership and organization names. It is not a forensic guarantee but provides a high-confidence indicator of VPN or data-center routing.
              </p>
              <p>
                <strong>Last Updated:</strong> April 2026. IP allocation databases are refreshed weekly. If you believe your location or ISP data is incorrect, contact our editorial team with your IP and expected correction.
              </p>
            </div>
          </section>
        </div>
      </ToolPageScaffold>
    </div>
  );
}
