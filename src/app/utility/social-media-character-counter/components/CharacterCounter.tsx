'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AtSign,
  CheckCircle2,
  ClipboardPaste,
  Copy,
  FileText,
  Hash,
  Link as LinkIcon,
  Scissors,
  Smile,
  Trash2,
  Type,
  AlignLeft,
} from 'lucide-react';

import {
  PLATFORMS,
  calculateFieldCount,
  countTextStats,
  getDefaultFieldId,
  getLimitUnitLabel,
  getStatus,
  removeHashtagsFromText,
  removeUrlsFromText,
  trimTextToLimit,
  type PlatformLimit,
} from '../platforms';

type Feedback = {
  tone: 'success' | 'error';
  message: string;
} | null;

function Ring({
  count,
  max,
  warn,
  size = 52,
  stroke = 5,
}: {
  count: number;
  max: number;
  warn: number;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(count / max, 1);
  const status = count > max ? 'over' : count >= warn ? 'warn' : count > 0 ? 'ok' : 'empty';
  const color =
    status === 'over'
      ? '#ef4444'
      : status === 'warn'
        ? '#f59e0b'
        : status === 'ok'
          ? '#22c55e'
          : '#cbd5e1';

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: 'rotate(-90deg)' }}
      className="drop-shadow-sm"
      aria-hidden="true"
    >
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${progress * circumference} ${circumference}`}
        className="transition-all duration-500 ease-out"
      />
    </svg>
  );
}

function statusClasses(status: string) {
  if (status === 'over') {
    return {
      badge: 'bg-rose-50 border-rose-100 text-rose-600',
      text: 'text-rose-500',
      bar: 'bg-rose-500',
    };
  }

  if (status === 'warn') {
    return {
      badge: 'bg-amber-50 border-amber-100 text-amber-600',
      text: 'text-amber-500',
      bar: 'bg-amber-500',
    };
  }

  if (status === 'ok') {
    return {
      badge: 'bg-emerald-50 border-emerald-100 text-emerald-600',
      text: 'text-emerald-500',
      bar: 'bg-emerald-500',
    };
  }

  return {
    badge: 'bg-slate-50 border-slate-100 text-slate-400',
    text: 'text-slate-400',
    bar: 'bg-slate-200',
  };
}

export default function CharacterCounter() {
  const [text, setText] = useState('');
  const [activePlatformId, setActivePlatformId] = useState('instagram');
  const [activeFieldId, setActiveFieldId] = useState('caption');
  const [feedback, setFeedback] = useState<Feedback>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setFeedback(null), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  const platform = PLATFORMS.find((item) => item.id === activePlatformId) ?? PLATFORMS[0];
  const activeLimit = platform.limits[activeFieldId] ?? platform.limits[getDefaultFieldId(platform)];
  const activeCount = calculateFieldCount(text, activeLimit);
  const activeStatus = getStatus(activeCount, activeLimit);
  const activeStatusClasses = statusClasses(activeStatus);
  const activePercent = Math.min((activeCount / activeLimit.max) * 100, 100);
  const stats = countTextStats(text);
  const limitUnit = getLimitUnitLabel(activeLimit);
  const remaining = activeLimit.max - activeCount;

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setFeedback({ tone: 'success', message: 'Copied to clipboard.' });
    } catch {
      textareaRef.current?.focus();
      textareaRef.current?.select();
      setFeedback({ tone: 'error', message: 'Clipboard access was blocked. The text is selected for manual copy.' });
    }
  }

  async function pasteText() {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      setFeedback({ tone: 'success', message: 'Pasted from clipboard.' });
      textareaRef.current?.focus();
    } catch {
      setFeedback({ tone: 'error', message: 'Clipboard paste is not available in this browser context.' });
    }
  }

  function trimToLimit() {
    const trimmed = trimTextToLimit(text, activeLimit);
    setText(trimmed);
    setFeedback({ tone: 'success', message: `Trimmed to the ${activeLimit.label.toLowerCase()} limit.` });
    textareaRef.current?.focus();
  }

  function stripHashtags() {
    setText(removeHashtagsFromText(text));
    setFeedback({ tone: 'success', message: 'Removed hashtags from the draft.' });
    textareaRef.current?.focus();
  }

  function stripUrls() {
    setText(removeUrlsFromText(text));
    setFeedback({ tone: 'success', message: 'Removed URLs from the draft.' });
    textareaRef.current?.focus();
  }

  function clearText() {
    setText('');
    setFeedback({ tone: 'success', message: 'Cleared the draft.' });
    textareaRef.current?.focus();
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-[1fr_430px] gap-8 items-start">
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Select Platform</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {PLATFORMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={activePlatformId === item.id}
                  aria-label={`Switch to ${item.name} limits`}
                  onClick={() => {
                    setActivePlatformId(item.id);
                    setActiveFieldId(getDefaultFieldId(item));
                    textareaRef.current?.focus();
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    activePlatformId === item.id
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <item.icon size={14} style={{ color: activePlatformId === item.id ? item.color : undefined }} />
                  {item.name}
                </button>
              ))}
            </div>

            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Field Type</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(platform.limits).map(([fieldId, limit]) => (
                <button
                  key={fieldId}
                  type="button"
                  aria-pressed={activeFieldId === fieldId}
                  aria-label={`Use ${platform.name} ${limit.label} limit`}
                  onClick={() => {
                    setActiveFieldId(fieldId);
                    textareaRef.current?.focus();
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    activeFieldId === fieldId
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {limit.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <platform.icon size={20} className="text-slate-900 shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900 truncate">
                    {platform.name} - {activeLimit.label}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {limitUnit === 'hashtags' ? 'Counts hashtags, not characters' : 'Counts visible text against the selected limit'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-medium italic bg-white px-2 py-1 rounded-md border border-slate-200">
                {activeLimit.note}
              </span>
            </div>

            <textarea
              ref={textareaRef}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={`Write your ${platform.name} ${activeLimit.label.toLowerCase()} here...`}
              className="w-full min-h-[400px] p-6 text-slate-800 placeholder-slate-400 focus:outline-none text-base leading-relaxed resize-none"
              aria-label={`${platform.name} ${activeLimit.label} editor`}
            />

            <div className="h-1.5 bg-slate-100">
              <div
                className={`h-full transition-all duration-500 ${activeStatusClasses.bar}`}
                style={{ width: `${activePercent}%` }}
              />
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-lg font-black font-mono ${activeStatusClasses.text}`}>
                    {activeCount.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    / {activeLimit.max.toLocaleString()} {limitUnit}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {remaining >= 0 ? `${remaining.toLocaleString()} left` : `${Math.abs(remaining).toLocaleString()} over`}
                  </span>
                </div>

                <div
                  aria-live="polite"
                  className={`text-xs font-bold rounded-full px-3 py-1 border ${
                    feedback
                      ? feedback.tone === 'success'
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                        : 'bg-rose-50 border-rose-100 text-rose-700'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  {feedback ? feedback.message : 'Tip: trim or clean the text before publishing.'}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyText}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-slate-300 transition-all shadow-sm active:scale-95"
                >
                  <Copy size={14} /> Copy
                </button>
                <button
                  type="button"
                  onClick={pasteText}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-slate-300 transition-all shadow-sm active:scale-95"
                >
                  <ClipboardPaste size={14} /> Paste
                </button>
                <button
                  type="button"
                  onClick={trimToLimit}
                  disabled={activeCount <= activeLimit.max}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-slate-300 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Scissors size={14} /> Trim to limit
                </button>
                <button
                  type="button"
                  onClick={stripHashtags}
                  disabled={stats.hashtags === 0}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-slate-300 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Hash size={14} /> Remove hashtags
                </button>
                <button
                  type="button"
                  onClick={stripUrls}
                  disabled={stats.urls === 0}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-slate-300 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LinkIcon size={14} /> Remove URLs
                </button>
                <button
                  type="button"
                  onClick={clearText}
                  disabled={text.length === 0}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-rose-100 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={14} /> Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:sticky lg:top-8">
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: stats.characters, label: 'Characters', icon: Type },
              { value: stats.words, label: 'Words', icon: AlignLeft },
              { value: stats.lines, label: 'Lines', icon: FileText },
              { value: stats.sentences, label: 'Sentences', icon: CheckCircle2 },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-sm">
                <div className="text-xl font-black text-slate-900 leading-none mb-2">{stat.value.toLocaleString()}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { value: stats.hashtags, label: 'Hashtags', icon: Hash },
              { value: stats.mentions, label: 'Mentions', icon: AtSign },
              { value: stats.emojis, label: 'Emojis', icon: Smile },
              { value: stats.urls, label: 'URLs', icon: LinkIcon },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <stat.icon size={20} />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900 leading-none">{stat.value.toLocaleString()}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Selected Platform Status</h3>

            <div
              className={`relative bg-white p-6 rounded-3xl border transition-all ${
                activeStatus === 'over' ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <Ring count={activeCount} max={activeLimit.max} warn={activeLimit.warn} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <platform.icon size={20} style={{ color: platform.color }} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <h4 className="font-bold text-slate-900 truncate">
                      {platform.name} - {activeLimit.label}
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeStatusClasses.badge}`}>
                      {activeStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-lg font-black font-mono leading-none ${activeStatusClasses.text}`}>
                      {activeCount.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      / {activeLimit.max.toLocaleString()} {limitUnit}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{activeLimit.note}</span>
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries(platform.limits).map(([fieldId, limit]) => {
                  const fieldCount = calculateFieldCount(text, limit as PlatformLimit);
                  const fieldStatus = getStatus(fieldCount, limit as PlatformLimit);
                  const fieldClasses = statusClasses(fieldStatus);
                  const fieldPercent = Math.min((fieldCount / limit.max) * 100, 100);
                  const fieldUnit = getLimitUnitLabel(limit as PlatformLimit);

                  return (
                    <div key={fieldId} className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold gap-4">
                        <span className={fieldId === activeFieldId ? 'text-slate-900' : 'text-slate-500'}>{limit.label}</span>
                        <span className={fieldClasses.text}>
                          {fieldCount > limit.max
                            ? `${(fieldCount - limit.max).toLocaleString()} over`
                            : `${(limit.max - fieldCount).toLocaleString()} ${fieldUnit} left`}
                        </span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${fieldClasses.bar}`}
                          style={{ width: `${fieldPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
