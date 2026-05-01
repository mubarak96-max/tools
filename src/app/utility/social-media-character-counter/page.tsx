/**
 * Social Media Character Counter Page
 * The main entry point for the character counting utility.
 */
import type { Metadata } from 'next';
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Youtube, 
  Music, 
  Pin, 
  AtSign, 
  Cloud, 
  MessageSquare, 
  Ghost,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart3,
  BookOpen,
  Edit3
} from 'lucide-react';

import ToolPageScaffold from '@/components/tools/ToolPageScaffold';
import CharacterCounter from './components/CharacterCounter';

const PAGE_PATH = '/utility/social-media-character-counter';
const PAGE_URL = 'https://findbest.tools/utility/social-media-character-counter';

export const metadata: Metadata = {
  title: 'Social Media Character Counter — Check Limits for Instagram, X, LinkedIn & More',
  description: 'The ultimate social media character counter. Check character limits for Instagram, X (Twitter), LinkedIn, TikTok, and more. Real-time limit alerts and multi-platform comparison.',
  keywords: [
    'social media character counter',
    'instagram character limit',
    'twitter character count',
    'linkedin character limit',
    'tiktok character counter',
    'facebook character limit',
    'youtube title length checker',
    'character count for social media',
    'caption length checker',
    'social media manager tools'
  ],
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function SocialMediaCharacterCounterPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ToolPageScaffold
        path={PAGE_PATH}
        category="Utility"
        categoryHref="/utility"
        title="Social Media Character Counter"
        description="Write your content once and instantly see if it fits the character limits for Instagram, X, LinkedIn, TikTok, and every other major platform. No more trial and error with your social posts."
      >
        <CharacterCounter />

        <div className="mt-20 space-y-24">
          {/* Content Section: Platform Reference */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                <BookOpen size={20} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Platform Character Limits (2026)</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  name: "Instagram", 
                  icon: Instagram, 
                  color: "text-rose-500", 
                  limits: [
                    { label: "Caption", val: "2,200", note: "Truncates at 125" },
                    { label: "Bio", val: "150", note: "Profile description" },
                    { label: "Username", val: "30", note: "ID handle" }
                  ] 
                },
                { 
                  name: "X (Twitter)", 
                  icon: Twitter, 
                  color: "text-slate-900", 
                  limits: [
                    { label: "Post", val: "280", note: "Links = 23 chars" },
                    { label: "Bio", val: "160", note: "Profile text" },
                    { label: "Name", val: "50", note: "Display name" }
                  ] 
                },
                { 
                  name: "LinkedIn", 
                  icon: Linkedin, 
                  color: "text-blue-700", 
                  limits: [
                    { label: "Post", val: "3,000", note: "Truncates at 210" },
                    { label: "Headline", val: "220", note: "Under name" },
                    { label: "About", val: "2,600", note: "Profile summary" }
                  ] 
                },
                { 
                  name: "TikTok", 
                  icon: Music, 
                  color: "text-slate-900", 
                  limits: [
                    { label: "Caption", val: "2,200", note: "Truncates at 150" },
                    { label: "Bio", val: "80", note: "Short description" },
                    { label: "Username", val: "24", note: "Handle" }
                  ] 
                },
                { 
                  name: "YouTube", 
                  icon: Youtube, 
                  color: "text-red-600", 
                  limits: [
                    { label: "Title", val: "100", note: "Truncates at 60" },
                    { label: "Description", val: "5,000", note: "Video body" },
                    { label: "Tags", val: "500", note: "Total characters" }
                  ] 
                },
                { 
                  name: "Pinterest", 
                  icon: Pin, 
                  color: "text-rose-600", 
                  limits: [
                    { label: "Title", val: "100", note: "Pin heading" },
                    { label: "Description", val: "500", note: "Pin body" },
                    { label: "Bio", val: "160", note: "Profile" }
                  ] 
                }
              ].map(platform => (
                <div key={platform.name} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-6">
                    <platform.icon size={24} className={platform.color} />
                    <h3 className="text-xl font-bold text-slate-900">{platform.name}</h3>
                  </div>
                  <div className="space-y-4">
                    {platform.limits.map(l => (
                      <div key={l.label} className="flex justify-between items-baseline border-b border-slate-50 pb-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{l.label}</span>
                          <span className="text-[10px] text-slate-400 font-medium italic leading-none">{l.note}</span>
                        </div>
                        <span className="text-lg font-black text-slate-800 font-mono">{l.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Content Section: Detailed Guides */}
          <section className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                  <CheckCircle2 size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Platform Deep Dives</h2>
              </div>
              <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-relaxed">
                <h3 className="text-slate-900 font-bold">Instagram Character Counter</h3>
                <p>
                  Instagram's caption limit of <strong>2,200 characters</strong> sounds generous — but the critical number is <strong>125 characters</strong>. That's the preview shown in the feed before the "more" button. Your hook, your value proposition, and your most important information must fit in those first 125 characters. Write for the truncation, not the limit.
                </p>
                <p>
                  The Instagram bio is <strong>150 characters</strong> — one of the tightest bio limits of any platform. Every word must earn its place.
                </p>

                <h3 className="text-slate-900 font-bold">X (Twitter) Character Counter</h3>
                <p>
                  X (Twitter) enforces a strict <strong>280-character</strong> limit per tweet. What makes this particularly important to understand is that <strong>URLs are always counted as 23 characters</strong>, regardless of how long or short the actual URL is. A link to a 200-character URL and a link to a 10-character URL both consume 23 characters of your limit.
                </p>

                <h3 className="text-slate-900 font-bold">LinkedIn Character Counter</h3>
                <p>
                  LinkedIn posts allow up to <strong>3,000 characters</strong>, but only the first <strong>210 characters</strong> appear before "see more" in the feed. Your opening line on LinkedIn is arguably more important than anywhere else because the audience actively decides whether to expand.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                  <Edit3 size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Writing Strategy</h2>
              </div>
              <div className="grid gap-6">
                {[
                  {
                    title: "Write Long, Edit Short",
                    text: "Write your first draft without worrying about character count. Then edit ruthlessly: remove filler words, cut redundant phrases, and compress multi-word expressions into single words."
                  },
                  {
                    title: "Front-Load Your Hook",
                    text: "On Instagram, LinkedIn, and TikTok, content is truncated in the feed. Your hook must land in those first characters — not the second paragraph."
                  },
                  {
                    title: "Preview on Mobile",
                    text: "Over 80% of social media consumption happens on mobile. Always preview how your text renders on a phone screen before posting."
                  }
                ].map(tip => (
                  <div key={tip.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:border-indigo-200 transition-all">
                    <h4 className="font-bold text-slate-900 mb-2">{tip.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-600/10 blur-[120px] rounded-full -ml-48 -mb-48" />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shadow-sm border border-white/20 backdrop-blur-md">
                  <HelpCircle size={20} />
                </div>
                <h2 className="text-3xl font-black tracking-tight">Frequently Asked Questions</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                {[
                  {
                    q: "How many characters can an Instagram caption be?",
                    a: "Instagram captions can be up to 2,200 characters long. However, the critical threshold is 125 characters — this is how much of your caption is visible in the feed before truncation."
                  },
                  {
                    q: "What is the Twitter character limit?",
                    a: "Standard Twitter / X accounts are limited to 280 characters per tweet. All URLs are counted as 23 characters regardless of their actual length."
                  },
                  {
                    q: "Do emojis count as characters?",
                    a: "Yes, emojis count as characters. Simple emojis typically count as 2 characters, but complex combined emojis can count for more depending on how the platform handles Unicode."
                  },
                  {
                    q: "Does character count include spaces?",
                    a: "Yes — all social media platforms count spaces and line breaks as characters. A space between words consumes 1 character of your limit."
                  }
                ].map(faq => (
                  <div key={faq.q} className="space-y-4">
                    <h4 className="text-lg font-bold text-indigo-300">{faq.q}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shadow-sm border border-slate-200">
                <BarChart3 size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tools for Content Creators</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "UTM Builder", href: "/utility/utm-builder", desc: "Track campaign performance" },
                { name: "Image Resizer", href: "/utility/social-media-image-resizer", desc: "Fix image dimensions" },
                { name: "QR Generator", href: "/utility/qr-code-generator", desc: "Create scannable links" },
                { name: "DNS Checker", href: "/utility/dns-checker", desc: "Verify domain records" }
              ].map(tool => (
                <a key={tool.name} href={tool.href} className="group p-6 bg-white border border-slate-200 rounded-3xl hover:border-indigo-200 hover:shadow-lg transition-all">
                  <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">{tool.name}</h4>
                  <p className="text-xs text-slate-500 leading-none">{tool.desc}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </ToolPageScaffold>
    </div>
  );
}
