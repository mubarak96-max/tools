'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Check, History, LayoutGrid, List, Trash2, ExternalLink, AlertCircle } from 'lucide-react';

interface UtmParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
}

interface SavedCampaign {
  id: string;
  url: string;
  params: UtmParams;
  createdAt: string;
}

const PRESETS = {
  sources: [
    { label: 'Google', value: 'google' },
    { label: 'Facebook', value: 'facebook' },
    { label: 'Instagram', value: 'instagram' },
    { label: 'Twitter / X', value: 'twitter' },
    { label: 'LinkedIn', value: 'linkedin' },
    { label: 'YouTube', value: 'youtube' },
    { label: 'TikTok', value: 'tiktok' },
    { label: 'Pinterest', value: 'pinterest' },
    { label: 'Newsletter', value: 'newsletter' },
    { label: 'Partner / Affiliate', value: 'partner' },
    { label: 'Direct Mail', value: 'direct' },
    { label: 'QR Code', value: 'qr' },
  ],
  mediums: [
    { label: 'Paid Search (CPC)', value: 'cpc' },
    { label: 'Organic Social', value: 'organic_social' },
    { label: 'Paid Social', value: 'paid_social' },
    { label: 'Email', value: 'email' },
    { label: 'Display / Banner', value: 'display' },
    { label: 'Video', value: 'video' },
    { label: 'Referral', value: 'referral' },
    { label: 'Affiliate', value: 'affiliate' },
    { label: 'Native Ad', value: 'native' },
    { label: 'Push Notification', value: 'push' },
    { label: 'SMS', value: 'sms' },
    { label: 'Podcast', value: 'podcast' },
  ],
};

const STORAGE_KEY = 'utm_builder_history';

export default function UtmBuilder() {
  const [baseUrl, setBaseUrl] = useState('');
  const [params, setParams] = useState<UtmParams>({
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
  });
  const [history, setHistory] = useState<SavedCampaign[]>([]);
  const [copied, setCopied] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'builder' | 'bulk'>('builder');
  const [bulkUrls, setBulkUrls] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        // ignore corrupt storage
      }
    }
  }, []);

  const validation = React.useMemo(() => {
    const newErrors: Partial<Record<keyof UtmParams | 'baseUrl', string>> = {};
    if (baseUrl.trim()) {
      try {
        new URL(baseUrl);
      } catch {
        newErrors.baseUrl = 'Please enter a valid URL (include https://)';
      }
    }

    const build = () => {
      try {
        const url = new URL(baseUrl);
        const sp = url.searchParams;
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(k => sp.delete(k));
        if (params.utm_source) sp.set('utm_source', params.utm_source.trim());
        if (params.utm_medium) sp.set('utm_medium', params.utm_medium.trim());
        if (params.utm_campaign) sp.set('utm_campaign', params.utm_campaign.trim());
        if (params.utm_term) sp.set('utm_term', params.utm_term.trim());
        if (params.utm_content) sp.set('utm_content', params.utm_content.trim());
        return url.toString();
      } catch {
        return '';
      }
    };

    const isValid = baseUrl.trim() && 
                    params.utm_source.trim() && 
                    params.utm_medium.trim() && 
                    params.utm_campaign.trim() && 
                    !newErrors.baseUrl;

    return {
      errors: newErrors,
      url: isValid ? build() : '',
      isValid: !!isValid
    };
  }, [baseUrl, params]);

  const finalUrl = validation.url;

  const saveToHistory = useCallback((url: string) => {
    if (!url) return;
    const newEntry: SavedCampaign = {
      id: Date.now().toString(),
      url,
      params: { ...params },
      createdAt: new Date().toISOString(),
    };
    setHistory(prev => {
      const filtered = prev.filter(h => h.url !== url);
      const next = [newEntry, ...filtered].slice(0, 50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, [params]);

  const handleCopy = async (text: string) => {
    if (!validation.isValid) {
      setShowErrors(true);
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (text === finalUrl) saveToHistory(text);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      if (text === finalUrl) saveToHistory(text);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBulkGenerate = () => {
    const lines = bulkUrls.split('\n').filter(l => l.trim());
    if (lines.length === 0) return;
    
    let output = '';
    lines.forEach(line => {
      try {
        const url = new URL(line.trim());
        const sp = url.searchParams;
        if (params.utm_source) sp.set('utm_source', params.utm_source.trim());
        if (params.utm_medium) sp.set('utm_medium', params.utm_medium.trim());
        if (params.utm_campaign) sp.set('utm_campaign', params.utm_campaign.trim());
        if (params.utm_term) sp.set('utm_term', params.utm_term.trim());
        if (params.utm_content) sp.set('utm_content', params.utm_content.trim());
        output += url.toString() + '\n';
      } catch {
        output += `# INVALID: ${line}\n`;
      }
    });
    
    handleCopy(output);
  };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  const loadFromHistory = (entry: SavedCampaign) => {
    setBaseUrl(entry.url.split('?')[0]);
    setParams(entry.params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const inputClass = (field: keyof UtmParams | 'baseUrl') => {
    const hasError = showErrors && (
      (field === 'baseUrl' && (!baseUrl.trim() || validation.errors.baseUrl)) ||
      (field !== 'baseUrl' && ['utm_source', 'utm_medium', 'utm_campaign'].includes(field) && !params[field as keyof UtmParams].trim())
    );
    
    return `
      w-full px-4 py-3 rounded-xl border bg-white text-slate-900 placeholder-slate-400
      focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
      transition-all duration-200
      ${hasError ? 'border-red-300 bg-red-50/50' : 'border-slate-200 hover:border-slate-300'}
    `;
  };

  return (
    <div className="w-full bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
      {/* TABS */}
      <div className="flex border-b border-slate-200 bg-slate-50/50 p-1">
        <button
          onClick={() => setActiveTab('builder')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold uppercase tracking-wider rounded-t-xl transition-all ${
            activeTab === 'builder'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <LayoutGrid size={18} />
          Single URL Builder
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold uppercase tracking-wider rounded-t-xl transition-all ${
            activeTab === 'bulk'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <List size={18} />
          Bulk Generator
        </button>
      </div>

      <div className="grid lg:grid-cols-12 min-h-[600px]">
        {/* LEFT: Form */}
        <div className="lg:col-span-5 bg-slate-50/30 border-r border-slate-200 p-6 lg:p-8 space-y-6 overflow-y-auto max-h-[800px] custom-scrollbar">
          
          {activeTab === 'builder' ? (
            <>
              {/* Base URL */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  Website URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://example.com/landing-page"
                  className={inputClass('baseUrl')}
                />
                {showErrors && (!baseUrl.trim() || validation.errors.baseUrl) && (
                  <p className="flex items-center gap-1 text-xs text-red-600 font-medium">
                    <AlertCircle size={12} /> {validation.errors.baseUrl || 'Destination URL is required'}
                  </p>
                )}
                <p className="text-[11px] text-slate-400 font-medium">The full URL you want to track (include https://)</p>
              </div>

              {/* UTM Source */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  Campaign Source (utm_source) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={params.utm_source}
                  onChange={(e) => setParams(p => ({ ...p, utm_source: e.target.value }))}
                  placeholder="google, facebook, newsletter"
                  className={inputClass('utm_source')}
                />
                {showErrors && !params.utm_source.trim() && (
                  <p className="flex items-center gap-1 text-xs text-red-600 font-medium">
                    <AlertCircle size={12} /> Source is required by Google Analytics
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESETS.sources.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setParams(p => ({ ...p, utm_source: s.value }))}
                      className="px-3 py-1.5 text-[11px] font-bold bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm transition-all text-slate-600"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* UTM Medium */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  Campaign Medium (utm_medium) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={params.utm_medium}
                  onChange={(e) => setParams(p => ({ ...p, utm_medium: e.target.value }))}
                  placeholder="cpc, email, social, display"
                  className={inputClass('utm_medium')}
                />
                {showErrors && !params.utm_medium.trim() && (
                  <p className="flex items-center gap-1 text-xs text-red-600 font-medium">
                    <AlertCircle size={12} /> Medium is required by Google Analytics
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESETS.mediums.map(m => (
                    <button
                      key={m.value}
                      onClick={() => setParams(p => ({ ...p, utm_medium: m.value }))}
                      className="px-3 py-1.5 text-[11px] font-bold bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm transition-all text-slate-600"
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* UTM Campaign */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  Campaign Name (utm_campaign) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={params.utm_campaign}
                  onChange={(e) => setParams(p => ({ ...p, utm_campaign: e.target.value }))}
                  placeholder="spring_sale_2026, product_launch"
                  className={inputClass('utm_campaign')}
                />
                {showErrors && !params.utm_campaign.trim() && (
                  <p className="flex items-center gap-1 text-xs text-red-600 font-medium">
                    <AlertCircle size={12} /> Campaign is required by Google Analytics
                  </p>
                )}
                <p className="text-[11px] text-slate-400 font-medium">Use lowercase, no spaces. Example: summer_sale_2026</p>
              </div>

              {/* UTM Term */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-sm font-bold text-slate-700">
                  Campaign Term (utm_term) <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Optional</span>
                </label>
                <input
                  type="text"
                  value={params.utm_term}
                  onChange={(e) => setParams(p => ({ ...p, utm_term: e.target.value }))}
                  placeholder="running+shoes, best+crm"
                  className={inputClass('utm_term')}
                />
              </div>

              {/* UTM Content */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-sm font-bold text-slate-700">
                  Campaign Content (utm_content) <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Optional</span>
                </label>
                <input
                  type="text"
                  value={params.utm_content}
                  onChange={(e) => setParams(p => ({ ...p, utm_content: e.target.value }))}
                  placeholder="video_ad, text_link, hero_banner"
                  className={inputClass('utm_content')}
                />
              </div>
            </>
          ) : (
            /* BULK MODE */
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Paste URLs (one per line)
                </label>
                <textarea
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  placeholder="https://example.com/page1&#10;https://example.com/page2"
                  className="w-full h-64 px-4 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none font-mono text-xs leading-relaxed"
                />
                <div className="flex justify-between items-center px-1">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{bulkUrls.split('\n').filter(l => l.trim()).length} URLs detected</p>
                  <button onClick={() => setBulkUrls('')} className="text-[11px] text-red-500 font-bold hover:underline">Clear List</button>
                </div>
              </div>

              <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs mb-3 uppercase tracking-wider">
                  <LayoutGrid size={14} /> Shared Parameters
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 font-bold uppercase">Source:</span>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-indigo-100">{params.utm_source || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 font-bold uppercase">Medium:</span>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-indigo-100">{params.utm_medium || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 font-bold uppercase">Campaign:</span>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-indigo-100">{params.utm_campaign || '—'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBulkGenerate}
                disabled={!bulkUrls.trim() || !params.utm_source || !params.utm_medium || !params.utm_campaign}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl shadow-indigo-200/50 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <Copy size={18} />
                Generate & Copy All
              </button>
            </div>
          )}

          {activeTab === 'builder' && (
            <button
              onClick={() => handleCopy(finalUrl)}
              disabled={!finalUrl}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl shadow-indigo-200/50 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? 'Copied to Clipboard' : 'Copy Campaign URL'}
            </button>
          )}
        </div>

        {/* RIGHT: Preview */}
        <div className="lg:col-span-7 bg-slate-100/50 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto max-h-[800px] custom-scrollbar">
          {activeTab === 'builder' && (
            <>
              {/* URL Preview */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Live URL Preview</h3>
                  <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${
                    finalUrl ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {finalUrl ? 'Production Ready' : 'Incomplete'}
                  </span>
                </div>
                
                {finalUrl ? (
                  <div className="space-y-4">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 break-all font-mono text-sm text-slate-800 leading-relaxed shadow-inner">
                      <span className="text-slate-400">{baseUrl.split('?')[0]}</span>
                      <span className="text-indigo-600 font-black">?</span>
                      {new URL(finalUrl).searchParams.toString().split('&').map((param, i, arr) => (
                        <span key={i}>
                          <span className="text-emerald-700 font-bold">{param.split('=')[0]}</span>
                          <span className="text-slate-400">=</span>
                          <span className="text-slate-700 font-semibold">{decodeURIComponent(param.split('=')[1] || '')}</span>
                          {i < arr.length - 1 && <span className="text-slate-300">&</span>}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleCopy(finalUrl)}
                        className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                      >
                        <Copy size={16} /> Copy
                      </button>
                      <a
                        href={finalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2"
                      >
                        <ExternalLink size={16} /> Test Link
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 px-8">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <AlertCircle size={32} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-900 mb-1">Configuration Needed</p>
                    <p className="text-xs text-slate-400 leading-relaxed">Fill in the required fields (URL, Source, Medium, Campaign) to generate your trackable link.</p>
                  </div>
                )}
              </div>

              {/* Parameter Breakdown */}
              {finalUrl && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">Parameter Analysis</h3>
                  <div className="grid gap-3">
                    {Object.entries(params).filter(([, v]) => v).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-indigo-100 transition-all group">
                        <div className="w-28 shrink-0">
                          <span className="text-[10px] font-black font-mono text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
                            {key}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 break-all group-hover:text-indigo-600 transition-colors">{value}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">{getParamDescription(key)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* History Toggle */}
              <div className="mt-auto">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 transition-all mb-4 px-1"
                >
                  <History size={14} />
                  Recent Campaigns ({history.length})
                  <span className={`transition-transform duration-200 ${showHistory ? 'rotate-180' : ''}`}>▼</span>
                </button>
                
                {showHistory && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                    {history.length === 0 ? (
                      <div className="p-10 text-center text-slate-400 text-xs">
                        <History size={32} className="mx-auto mb-3 opacity-20" />
                        <p className="font-bold text-slate-600">No History Found</p>
                        <p className="mt-1">Generated URLs will appear here automatically.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto custom-scrollbar">
                        {history.map(entry => (
                          <div key={entry.id} className="p-4 hover:bg-slate-50 transition-all group relative">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => loadFromHistory(entry)}>
                                <p className="text-xs font-mono font-bold text-slate-500 truncate mb-2">{entry.url}</p>
                                <div className="flex flex-wrap gap-2">
                                  <span className="text-[9px] font-black px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded uppercase tracking-wider">
                                    {entry.params.utm_source}
                                  </span>
                                  <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded uppercase tracking-wider">
                                    {entry.params.utm_medium}
                                  </span>
                                  <span className="text-[9px] font-black px-2 py-0.5 bg-amber-50 text-amber-700 rounded uppercase tracking-wider truncate max-w-[150px]">
                                    {entry.params.utm_campaign}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleCopy(entry.url)}
                                className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                              >
                                <Copy size={16} />
                              </button>
                            </div>
                            <p className="text-[9px] font-bold text-slate-300 mt-2 uppercase tracking-widest">
                              {new Date(entry.createdAt).toLocaleDateString()} at {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    {history.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all border-t border-slate-100 flex items-center justify-center gap-2"
                      >
                        <Trash2 size={12} /> Clear Campaign History
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'bulk' && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-10 text-center">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                <List size={48} className="text-slate-100" />
              </div>
              <p className="text-xl font-black text-slate-900 mb-2">Bulk UTM Generation</p>
              <p className="text-sm max-w-sm text-slate-400 font-medium leading-relaxed">
                Paste multiple URLs on the left. The source, medium, and campaign parameters you've set will be applied to every URL in your list instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getParamDescription(key: string): string {
  const descriptions: Record<string, string> = {
    utm_source: 'Referrer: google, facebook, newsletter',
    utm_medium: 'Channel: cpc, email, social, display',
    utm_campaign: 'Promotion: spring_sale, launch_week',
    utm_term: 'Paid keywords: running+shoes',
    utm_content: 'A/B Test: video_ad, text_link',
  };
  return descriptions[key] || '';
}
