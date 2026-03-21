'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { autoCreateTool } from '@/app/admin/actions';
import { ToolCategory } from '@/types/database';

export default function AutoGenerateTool({ categories }: { categories: ToolCategory[] }) {
  const [toolName, setToolName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!toolName.trim()) return;
    setLoading(true);
    setError('');
    try {
      await autoCreateTool(toolName, { categories: categories.map(c => c.name) });
    } catch (err: any) {
      setError(err.message || "Failed to auto-generate tool");
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="flex-1 z-10">
        <h2 className="text-2xl font-extrabold flex items-center gap-3 text-foreground mb-2">
          <Sparkles className="w-6 h-6 text-primary" /> AI Tool Generator
        </h2>
        <p className="text-base text-muted-foreground">
          Bypass the manual form. Enter any software or AI tool name below and OpenRouter will instantly scaffold the complete database entry, including SEO metadata, lists, and pricing!
        </p>
        {error && <p className="text-sm font-medium text-red-500 mt-3">{error}</p>}
      </div>
      
      <div className="flex w-full md:w-auto gap-3 z-10">
        <input 
          type="text" 
          placeholder="e.g. ChatGPT, Airtable, Midjourney" 
          value={toolName} 
          onChange={e => setToolName(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && handleGenerate()}
          className="flex-1 w-full md:w-80 bg-background/80 backdrop-blur border border-white/20 rounded-xl px-4 py-3 text-foreground shadow-inner focus:ring-2 focus:ring-primary outline-none"
        />
        <button 
          onClick={handleGenerate}
          disabled={loading || !toolName.trim()}
          className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl flex items-center gap-2 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {loading ? "Generating..." : "Auto-Create"}
        </button>
      </div>
    </div>
  );
}
