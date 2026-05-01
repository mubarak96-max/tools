'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  Copy,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Hash,
  Smile,
  Link as LinkIcon,
  Type,
  FileText,
  AlignLeft,
  ChevronDown
} from 'lucide-react';

// ─── Platform Data ────────────────────────────────────────────────────────────
const PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    color: "#E1306C",
    icon: Instagram,
    limits: {
      caption:     { max: 2200, label: "Caption",         warn: 125,  note: "Only first 125 chars show without 'more'" },
      bio:         { max: 150,  label: "Bio",             warn: 130,  note: "Shown on profile page" },
      username:    { max: 30,   label: "Username",        warn: 25,   note: "Letters, numbers, periods, underscores only" },
      name:        { max: 30,   label: "Display Name",    warn: 25,   note: "Shown above posts" },
      comment:     { max: 2200, label: "Comment",         warn: 2000, note: "Same limit as captions" },
      hashtags:    { max: 30,   label: "Hashtags",        warn: 25,   note: "Max 30 hashtags per post (count, not chars)" },
      story_link:  { max: 2048, label: "Story Link",      warn: 1800, note: "Link sticker URL max" },
      alt_text:    { max: 100,  label: "Alt Text",        warn: 80,   note: "Image accessibility description" },
    }
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    color: "#000000",
    icon: Twitter,
    limits: {
      tweet:       { max: 280,  label: "Tweet / Post",    warn: 260,  note: "URLs count as 23 chars regardless of length" },
      bio:         { max: 160,  label: "Bio",             warn: 140,  note: "Profile description" },
      name:        { max: 50,   label: "Display Name",    warn: 40,   note: "Shown on profile" },
      username:    { max: 15,   label: "Username (@)",    warn: 12,   note: "Letters, numbers, underscores only" },
      dm:          { max: 10000,label: "Direct Message",  warn: 9000, note: "Twitter Blue subscribers" },
      poll_option: { max: 25,   label: "Poll Option",     warn: 20,   note: "Each poll choice" },
      location:    { max: 30,   label: "Location",        warn: 25,   note: "Profile location field" },
      website_url: { max: 100,  label: "Website URL",     warn: 90,   note: "Profile website field" },
    }
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    color: "#0A66C2",
    icon: Linkedin,
    limits: {
      post:        { max: 3000, label: "Post",            warn: 2800, note: "Only first 210 chars show before 'see more'" },
      headline:    { max: 220,  label: "Headline",        warn: 200,  note: "Shown under your name everywhere" },
      summary:     { max: 2600, label: "About / Summary", warn: 2400, note: "First 300 chars visible without expanding" },
      name:        { max: 100,  label: "Name",            warn: 80,   note: "First + last name combined" },
      connection_note:{ max: 300, label: "Connect Note",  warn: 280,  note: "Message when sending connection request" },
      comment:     { max: 1250, label: "Comment",         warn: 1100, note: "Post comment limit" },
      company_name:{ max: 100,  label: "Company Name",    warn: 80,   note: "Company page name" },
      article_title:{ max: 150, label: "Article Title",   warn: 130,  note: "LinkedIn newsletter/article title" },
      job_title:   { max: 100,  label: "Job Title",       warn: 80,   note: "Position title" },
      skills:      { max: 50,   label: "Skill Tag",       warn: 40,   note: "Individual skill entry" },
    }
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "#1877F2",
    icon: Facebook,
    limits: {
      post:        { max: 63206,label: "Post",            warn: 50000,note: "Technically up to 63,206 chars" },
      bio:         { max: 101,  label: "Bio (Intro)",     warn: 90,   note: "Short intro on profile" },
      about:       { max: 50000,label: "About Section",   warn: 45000,note: "Extended about page" },
      name:        { max: 75,   label: "Name",            warn: 60,   note: "First + last name" },
      page_name:   { max: 75,   label: "Page Name",       warn: 60,   note: "Business page name" },
      page_desc:   { max: 255,  label: "Page Description",warn: 230,  note: "Short description below page name" },
      comment:     { max: 8000, label: "Comment",         warn: 7000, note: "Post comment" },
      group_desc:  { max: 3000, label: "Group Description",warn:2700, note: "Facebook Group description" },
      event_desc:  { max: 1000, label: "Event Description",warn:900,  note: "Event details" },
      story_text:  { max: 100,  label: "Story Text",      warn: 80,   note: "Text overlay on Facebook Story" },
    }
  },
  {
    id: "tiktok",
    name: "TikTok",
    color: "#000000",
    icon: Music,
    limits: {
      caption:     { max: 2200, label: "Video Caption",   warn: 150,  note: "First 150 chars shown; max 2,200 total" },
      bio:         { max: 80,   label: "Bio",             warn: 70,   note: "Profile description" },
      username:    { max: 24,   label: "Username",        warn: 20,   note: "Shown as @username" },
      name:        { max: 30,   label: "Nickname",        warn: 25,   note: "Display name on profile" },
      comment:     { max: 150,  label: "Comment",         warn: 130,  note: "Comment on videos" },
      stitch_text: { max: 300,  label: "Stitch Caption",  warn: 280,  note: "Caption when stitching a video" },
      live_title:  { max: 32,   label: "LIVE Title",      warn: 28,   note: "TikTok LIVE stream title" },
    }
  },
  {
    id: "pinterest",
    name: "Pinterest",
    color: "#E60023",
    icon: Pin,
    limits: {
      pin_title:   { max: 100,  label: "Pin Title",       warn: 80,   note: "Title appears above description" },
      pin_desc:    { max: 500,  label: "Pin Description", warn: 450,  note: "First 50 chars shown in feed" },
      board_name:  { max: 50,   label: "Board Name",      warn: 40,   note: "Name of your collection" },
      board_desc:  { max: 500,  label: "Board Description",warn:450,  note: "Board details" },
      bio:         { max: 160,  label: "Bio",             warn: 140,  note: "Profile description" },
      name:        { max: 50,   label: "Display Name",    warn: 40,   note: "Shown on your profile" },
      username:    { max: 15,   label: "Username",        warn: 12,   note: "Part of your Pinterest URL" },
      story_title: { max: 100,  label: "Story Pin Title", warn: 80,   note: "Story Pin page title" },
    }
  },
  {
    id: "youtube",
    name: "YouTube",
    color: "#FF0000",
    icon: Youtube,
    limits: {
      title:       { max: 100,  label: "Video Title",     warn: 70,   note: "Only ~60 chars show in search results" },
      description: { max: 5000, label: "Description",     warn: 4500, note: "First 157 chars shown in search snippet" },
      tags:        { max: 500,  label: "Tags (total)",    warn: 450,  note: "Combined character count for all tags" },
      channel_desc:{ max: 1000, label: "Channel Description",warn:900,note: "About section of your channel" },
      channel_name:{ max: 100,  label: "Channel Name",    warn: 80,   note: "Your YouTube channel name" },
      comment:     { max: 10000,label: "Comment",         warn: 9000, note: "Video comment limit" },
      community:   { max: 5000, label: "Community Post",  warn: 4500, note: "YouTube Community tab post" },
      chapter:     { max: 100,  label: "Chapter Title",   warn: 80,   note: "Video chapter name in description" },
    }
  },
  {
    id: "threads",
    name: "Threads",
    color: "#101010",
    icon: AtSign,
    limits: {
      post:        { max: 500,  label: "Post",            warn: 450,  note: "Threads posts max 500 characters" },
      bio:         { max: 150,  label: "Bio",             warn: 130,  note: "Same as Instagram bio — shared account" },
      name:        { max: 30,   label: "Display Name",    warn: 25,   note: "Synced from Instagram" },
    }
  },
  {
    id: "bluesky",
    name: "Bluesky",
    color: "#0085FF",
    icon: Cloud,
    limits: {
      post:        { max: 300,  label: "Post",            warn: 270,  note: "300 grapheme limit (some emoji count as 2)" },
      bio:         { max: 256,  label: "Bio",             warn: 230,  note: "Profile description" },
      name:        { max: 64,   label: "Display Name",    warn: 55,   note: "Shown on your profile" },
      username:    { max: 253,  label: "Handle",          warn: 200,  note: "Your @handle.bsky.social" },
    }
  },
  {
    id: "mastodon",
    name: "Mastodon",
    color: "#563ACC",
    icon: MessageSquare,
    limits: {
      post:        { max: 500,  label: "Post / Toot",     warn: 450,  note: "Default; some instances allow more" },
      bio:         { max: 500,  label: "Bio",             warn: 450,  note: "Profile description" },
      name:        { max: 30,   label: "Display Name",    warn: 25,   note: "Shown above handle" },
      cw:          { max: 500,  label: "Content Warning", warn: 450,  note: "CW/Spoiler text field" },
    }
  },
  {
    id: "snapchat",
    name: "Snapchat",
    color: "#FFFC00",
    icon: Ghost,
    limits: {
      story_caption:{ max: 250, label: "Story Caption",   warn: 220,  note: "Caption on Snap stories" },
      bio:          { max: 150, label: "Bio",             warn: 130,  note: "Profile description" },
      username:     { max: 15,  label: "Username",        warn: 12,   note: "Your Snapchat username" },
      name:         { max: 30,  label: "Display Name",    warn: 25,   note: "Shown to friends" },
      chat:         { max: 1000,label: "Chat Message",    warn: 900,  note: "Direct chat message" },
    }
  },
];

const getStatus = (count: number, limit: { max: number; warn: number }) => {
  if (count === 0)              return "empty";
  if (count > limit.max)        return "over";
  if (count >= limit.warn)      return "warn";
  return "ok";
};

function Ring({ count, max, warn, size = 48, stroke = 5 }: { count: number, max: number, warn: number, size?: number, stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(count / max, 1);
  const status = count > max ? "over" : count >= warn ? "warn" : count > 0 ? "ok" : "empty";
  const ringColor = status === "over" ? "#ef4444" : status === "warn" ? "#f59e0b" : status === "ok" ? "#22c55e" : "#e2e8f0";
  const dash = pct * circ;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }} className="drop-shadow-sm">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={ringColor} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        className="transition-all duration-500 ease-out"
      />
    </svg>
  );
}

export default function CharacterCounter() {
  const [text, setText] = useState("");
  const [activePlatform, setActivePlatform] = useState("instagram");
  const [activeField, setActiveField] = useState("caption");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const platform = PLATFORMS.find(p => p.id === activePlatform) || PLATFORMS[0];
  const limit = platform.limits[activeField as keyof typeof platform.limits] || Object.values(platform.limits)[0];
  const count = text.length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const lines = text.split("\n").length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const remaining = limit.max - count;
  const status = getStatus(count, limit);
  const pct = Math.min(count / limit.max * 100, 100);

  const hashtags = (text.match(/#\w+/g) || []).length;
  const mentions = (text.match(/@\w+/g) || []).length;
  const emojis = (text.match(/\p{Emoji}/gu) || []).length;
  const urls = (text.match(/https?:\/\/[^\s]+/g) || []).length;

  return (
    <div className="max-w-7xl mx-auto">

      <div className="grid lg:grid-cols-[1fr_450px] gap-8 items-start">
        {/* Left: Editor */}
        <div className="space-y-6">
          {/* Platform Selector */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Select Platform</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePlatform(p.id);
                    setActiveField(Object.keys(p.limits)[0]);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    activePlatform === p.id
                      ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <p.icon size={14} style={{ color: activePlatform === p.id ? p.color : undefined }} />
                  {p.name}
                </button>
              ))}
            </div>

            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Field Type</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(platform.limits).map(([key, lim]) => (
                <button
                  key={key}
                  onClick={() => setActiveField(key)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    activeField === key
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {lim.label}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea Panel */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
            <div className="bg-slate-50 border-bottom border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <platform.icon size={20} className="text-slate-900" />
                <span className="text-sm font-bold text-slate-900">{platform.name} — {limit.label}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium italic bg-white px-2 py-1 rounded-md border border-slate-200">{limit.note}</span>
            </div>
            
            <textarea
              ref={textareaRef}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={`Write your ${platform.name} ${limit.label.toLowerCase()} here...`}
              className="w-full min-h-[400px] p-6 text-slate-800 placeholder-slate-400 focus:outline-none text-base leading-relaxed resize-none"
            />

            {/* Progress Bar */}
            <div className="h-1.5 bg-slate-100 relative">
              <div 
                className={`h-full transition-all duration-500 ${
                  status === "over" ? "bg-rose-500" : status === "warn" ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className={`text-lg font-black font-mono ${
                  status === "over" ? "text-rose-500" : status === "warn" ? "text-amber-500" : "text-emerald-500"
                }`}>
                  {count.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-slate-400">/ {limit.max.toLocaleString()} chars</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => navigator.clipboard.writeText(text)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-slate-300 transition-all shadow-sm active:scale-95"
                >
                  <Copy size={14} /> Copy
                </button>
                <button 
                  onClick={() => setText("")}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-rose-100 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all shadow-sm active:scale-95"
                >
                  <Trash2 size={14} /> Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Stats & Status */}
        <div className="space-y-6 lg:sticky lg:top-8">
          {/* Counters Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { val: count, lbl: "Characters", icon: Type },
              { val: words, lbl: "Words", icon: AlignLeft },
              { val: lines, lbl: "Lines", icon: FileText },
              { val: sentences, lbl: "Sentences", icon: Search },
            ].map(s => (
              <div key={s.lbl} className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-sm">
                <div className="text-xl font-black text-slate-900 leading-none mb-2">{s.val.toLocaleString()}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.lbl}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { val: hashtags, lbl: "Hashtags", icon: Hash },
              { val: mentions, lbl: "Mentions", icon: AtSign },
              { val: emojis, lbl: "Emojis", icon: Smile },
              { val: urls, lbl: "URLs", icon: LinkIcon },
            ].map(s => (
              <div key={s.lbl} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <s.icon size={20} />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900 leading-none">{s.val}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.lbl}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Platform Detail */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Selected Platform Status
            </h3>
            
            {[platform].map(p => {
              const primaryKey = Object.keys(p.limits)[0] as keyof typeof p.limits;
              const primaryLimit = p.limits[primaryKey] as { max: number; warn: number; label: string };
              const pStatus = getStatus(count, primaryLimit);
              const isActive = activePlatform === p.id;

              return (
                <div 
                  key={p.id}
                  className={`relative bg-white p-6 rounded-3xl border transition-all ${
                    pStatus === "over" ? "border-rose-200 bg-rose-50/10" : "border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                      <Ring count={count} max={primaryLimit.max} warn={primaryLimit.warn} size={56} stroke={4} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p.icon size={20} style={{ color: p.color }} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-900 truncate">{p.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          pStatus === "over" ? "bg-rose-50 border-rose-100 text-rose-600" :
                          pStatus === "warn" ? "bg-amber-50 border-amber-100 text-amber-600" :
                          pStatus === "ok" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                          "bg-slate-50 border-slate-100 text-slate-400"
                        }`}>
                          {pStatus.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-lg font-black font-mono leading-none ${
                          pStatus === "over" ? "text-rose-500" : pStatus === "warn" ? "text-amber-500" : pStatus === "ok" ? "text-emerald-500" : "text-slate-400"
                        }`}>
                          {count.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-slate-300">/ {primaryLimit.max.toLocaleString()}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{primaryLimit.label}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(p.limits).slice(0, 4).map(([key, lim]) => {
                      const st = getStatus(count, lim as { max: number; warn: number });
                      const currentPct = Math.min(count / lim.max * 100, 100);
                      return (
                        <div key={key} className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-slate-500">{lim.label}</span>
                            <span className={st === "over" ? "text-rose-500" : st === "warn" ? "text-amber-500" : "text-slate-400"}>
                              {st === "over" ? `-${count - lim.max}` : `${lim.max - count} left`}
                            </span>
                          </div>
                          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                st === "over" ? "bg-rose-500" : st === "warn" ? "bg-amber-500" : st === "ok" ? "bg-emerald-500" : "bg-slate-200"
                              }`}
                              style={{ width: `${currentPct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
