'use client';

import { useState } from 'react';
import { CustomPage, Tool } from '@/types/database';
import { createPage, updatePage } from '@/app/admin/actions';
import { Save, Loader2, AlertCircle } from 'lucide-react';

interface PageFormProps {
  initialData?: CustomPage;
  availableTools: Tool[];
  isEdit?: boolean;
}

export default function PageForm({ initialData, availableTools, isEdit }: PageFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<Partial<CustomPage>>(initialData || {
    slug: '',
    title: '',
    metaDescription: '',
    templateType: 'curated-list',
    toolSlugs: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToolToggle = (toolSlug: string) => {
    setFormData(prev => {
      const currentSlugs = prev.toolSlugs || [];
      if (currentSlugs.includes(toolSlug)) {
        return { ...prev, toolSlugs: currentSlugs.filter(s => s !== toolSlug) };
      } else {
        return { ...prev, toolSlugs: [...currentSlugs, toolSlug] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!formData.slug) {
      setError('Slug is required');
      setLoading(false);
      return;
    }

    try {
      if (isEdit && initialData?.slug) {
        await updatePage(initialData.slug, formData);
      } else {
        await createPage(formData);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold mb-4">Page Meta details</h2>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Page Title (H1 & Meta) *</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Best AI Writing Tools in 2026" className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">URL Slug *</label>
            <input required type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="best-ai-writing-tools" disabled={isEdit} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground outline-none disabled:bg-background/50 disabled:opacity-50" />
            <p className="text-xs text-muted-foreground mt-1">Will be hosted at `/p/[slug]`</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Meta Description *</label>
            <textarea required name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={3} placeholder="Discover the top rated AI writing assistants..." className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Editorial Verdict (Optional HTML)</label>
            <textarea name="editorialVerdict" placeholder="<p>An AI-generated or custom written deep-dive overview...</p>" value={formData.editorialVerdict || ''} onChange={handleChange} rows={5} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none resize-none font-mono text-xs" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Template Layout</label>
            <select name="templateType" value={formData.templateType} onChange={handleChange} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer">
              <option value="curated-list">Curated List / Use Case (Hero + Grid)</option>
              <option value="comparison">Head-to-Head Comparison (2 Tools)</option>
              <option value="alternatives">Alternatives Highlight (1 Target + Grid)</option>
            </select>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-4 max-h-[500px] flex flex-col">
          <h2 className="text-xl font-bold mb-2">Select Tools</h2>
          <p className="text-sm text-muted-foreground mb-4">Pick exactly which tools should appear on this custom page.</p>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {availableTools.map(tool => {
              const checked = formData.toolSlugs?.includes(tool.slug || '');
              return (
                <label key={tool.slug} className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${checked ? 'bg-primary/10 border-primary/30' : 'bg-background/50 border-white/5 hover:border-white/10'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToolToggle(tool.slug || '')}
                      className="w-4 h-4 rounded border-gray-600 text-primary focus:ring-primary focus:ring-offset-background bg-background cursor-pointer"
                    />
                    <div>
                      <div className="font-medium text-sm text-foreground">{tool.name}</div>
                      <div className="text-xs text-muted-foreground">{tool.category}</div>
                    </div>
                  </div>
                  {checked && <div className="w-2 h-2 rounded-full bg-primary" />}
                </label>
              );
            })}
            
            {availableTools.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No tools available to select.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t border-white/10 pt-6">
        <button 
          type="button" 
          onClick={() => window.history.back()}
          className="px-6 py-3 rounded-xl font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-70 flex items-center gap-2 cursor-pointer"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isEdit ? 'Save Changes' : 'Create Page'}
        </button>
      </div>
    </form>
  );
}
