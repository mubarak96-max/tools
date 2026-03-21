'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { autoCreateCustomPage } from '@/app/admin/actions';
import { Tool } from '@/types/database';

export default function AutoGeneratePage({ tools }: { tools: Tool[] }) {
  const [topic, setTopic] = useState('');
  const [templateType, setTemplateType] = useState<'comparison' | 'alternatives' | 'curated-list'>('curated-list');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    try {
      const minimalTools = tools.map(t => ({ slug: t.slug as string, name: t.name as string, category: t.category as string }));
      await autoCreateCustomPage(topic, templateType, minimalTools);
    } catch (err: any) {
      setError(err.message || "Failed to auto-generate page");
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="flex-1 z-10">
        <h2 className="text-2xl font-extrabold flex items-center gap-3 text-foreground mb-2">
          <Sparkles className="w-6 h-6 text-purple-400" /> AI SEO Page Builder
        </h2>
        <p className="text-base text-muted-foreground">
          Enter a search query (e.g. "Content Automators" or "Slack vs Discord"). The AI will write custom editorial and strictly match it to your database.
        </p>
        {error && <p className="text-sm font-medium text-red-500 mt-3">{error}</p>}
      </div>
      
      <div className="flex flex-col w-full md:w-auto gap-3 z-10">
        <select 
          value={templateType} 
          onChange={e => setTemplateType(e.target.value as any)}
          className="w-full bg-background/80 backdrop-blur border border-white/20 rounded-xl px-4 py-3 text-foreground shadow-inner focus:ring-2 focus:ring-purple-400 outline-none cursor-pointer appearance-none"
        >
          <option value="curated-list">Tools for Usecase (e.g. Best CRM Software)</option>
          <option value="comparison">Compare Tools (e.g. Figma vs Adobe XD)</option>
          <option value="alternatives">Alternatives To (e.g. Alternatives to Notion)</option>
        </select>
        
        <div className="flex w-full md:w-auto gap-3">
          <input 
            type="text" 
            placeholder={
              templateType === 'comparison' ? "e.g. ChatGpt vs Claude" :
              templateType === 'alternatives' ? "e.g. Alternatives to Airtable" :
              "e.g. Best Video Editors"
            }
            value={topic} 
            onChange={e => setTopic(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            className="flex-1 w-full md:w-64 bg-background/80 backdrop-blur border border-white/20 rounded-xl px-4 py-3 text-foreground shadow-inner focus:ring-2 focus:ring-purple-400 outline-none"
          />
          <button 
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="px-6 py-3 bg-purple-500 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-purple-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-purple-500/20 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? "Generating..." : "Auto-Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
