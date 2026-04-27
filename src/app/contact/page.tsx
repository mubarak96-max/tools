import React from 'react';
import { Mail, MessageSquare, Bug, Lightbulb, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
          Get in <span className="text-primary">Touch</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-500 leading-relaxed">
          Have a suggestion, found a bug, or want to partner with us? We&apos;re always listening to our users to make FindBest Tools better every day.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        {/* Support Categories */}
        <div className="lg:col-span-1 space-y-4">
          {[
            { icon: <Bug className="w-5 h-5" />, title: "Report a Bug", desc: "Found something broken? Let us know so we can fix it." },
            { icon: <Lightbulb className="w-5 h-5" />, title: "Suggest a Tool", desc: "Missing a specific utility? We love new ideas." },
            { icon: <MessageSquare className="w-5 h-5" />, title: "General Inquiry", desc: "For partnerships, media, or other questions." },
          ].map((item, i) => (
            <div key={i} className="p-6 bg-white border border-slate-100 rounded-2xl flex gap-4 items-start shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Method */}
        <div className="lg:col-span-2">
          <div className="glass-card p-8 rounded-3xl border border-white/40 shadow-sm h-full flex flex-col justify-center bg-white/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Mail className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Email Our Team</h3>
                <p className="text-slate-500">Official support and business channel</p>
              </div>
            </div>

            <div className="space-y-6">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const subject = formData.get('subject');
                  const body = formData.get('message');
                  window.location.href = `mailto:mubarakmmm5@gmail.com?subject=${encodeURIComponent(subject as string)}&body=${encodeURIComponent(body as string)}`;
                }}
                className="space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Subject</label>
                    <select name="subject" className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                      <option>General Inquiry</option>
                      <option>Bug Report</option>
                      <option>Tool Suggestion</option>
                      <option>Partnership</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Message</label>
                  <textarea 
                    name="message"
                    required
                    placeholder="Tell us how we can help..."
                    className="w-full p-4 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[120px]"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Open Email Client
                </button>
              </form>

              <div className="flex items-center gap-3 text-slate-500 text-sm bg-slate-100/50 p-4 rounded-xl inline-flex w-full justify-center">
                <Clock className="w-4 h-4 text-primary" />
                <span>Typical response time: <strong>Within 24-48 hours</strong></span>
              </div>
            </div>

            <div className="mt-12 text-sm text-slate-400">
              <p>Looking for technical documentation? Please visit our <a href="/blog" className="text-primary hover:underline font-medium">Developer Blog</a> for deep dives into how our tools work.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 pt-8 border-t border-slate-100">
        <p>FindBest Tools is a global platform. While our main communication is in English, we welcome inquiries in any language and will do our best to assist you using translation services.</p>
      </div>
    </div>
  );
}

