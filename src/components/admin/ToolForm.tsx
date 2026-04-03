'use client';

import { useState } from 'react';
import { Tool, AIInsights, ToolCategory } from '@/types/database';
import { createTool, updateTool, generateFullToolProfile } from '@/app/admin/actions';
import { Sparkles, Save, Loader2, AlertCircle } from 'lucide-react';

interface ToolFormProps {
  initialData?: Tool;
  categories: ToolCategory[];
  isEdit?: boolean;
}

const emptyAiInsights = (): AIInsights => ({
  whyThisToolFits: '',
  pros: [],
  cons: [],
  bestFor: '',
  antiRecommendation: '',
  comparisonSummary: '',
});

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function ToolForm({ initialData, categories, isEdit }: ToolFormProps) {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<Partial<Tool>>(initialData || {
    name: '',
    slug: '',
    category: categories.length > 0 ? categories[0].name : '',
    pricing: 'Freemium',
    pricingRange: '',
    difficulty: 'Intermediate',
    description: '',
    status: 'draft',
    useCases: [],
    features: [],
    platforms: [],
    integrations: [],
    website: '',
    aiInsights: undefined
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Tool) => {
    const value = e.target.value;
    const arrayValues = value.split(',').map(s => s.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: arrayValues }));
  };

  const handleAiInsightsChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, field: keyof AIInsights) => {
    const value = e.target.value;
    const parsedValue: AIInsights[keyof AIInsights] =
      field === 'pros' || field === 'cons'
        ? value.split('\n').map(s => s.trim()).filter(Boolean)
        : value;
    
    setFormData(prev => ({
      ...prev,
      aiInsights: {
        ...(prev.aiInsights ?? emptyAiInsights()),
        [field]: parsedValue
      }
    }));
  };

  const updateAiInsightList = (field: 'pros' | 'cons', updater: (values: string[]) => string[]) => {
    setFormData(prev => {
      const currentInsights = prev.aiInsights ?? emptyAiInsights();
      return {
        ...prev,
        aiInsights: {
          ...currentInsights,
          [field]: updater(currentInsights[field]),
        },
      };
    });
  };

  const handleGenerateAI = async () => {
    if (!formData.name) {
      setError("Please enter a Tool Name first.");
      return;
    }
    setAiLoading(true);
    setError('');
    try {
      const profile = await generateFullToolProfile(formData.name, { 
        categories: categories.map(c => c.name) 
      });
      
      const pricingMapping: Record<string, Tool["pricing"]> = { free: 'Free', freemium: 'Freemium', paid: 'Paid' };
      const diffMapping: Record<string, Tool["difficulty"]> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };

      setFormData(prev => ({
        ...prev,
        slug: profile.slug || prev.slug,
        category: profile.category || prev.category,
        pricing: pricingMapping[profile.pricing_model?.toLowerCase()] || 'Freemium',
        difficulty: diffMapping[profile.difficulty_level?.toLowerCase()] || 'Intermediate',
        pricingRange: profile.price_range || prev.pricingRange,
        description: profile.description || prev.description,
        useCases: profile.use_cases?.length ? profile.use_cases : prev.useCases,
        features: profile.features?.length ? profile.features : prev.features,
        platforms: profile.platforms?.length ? profile.platforms : prev.platforms,
        aiInsights: {
          whyThisToolFits: profile.why_this_tool,
          bestFor: profile.best_for,
          antiRecommendation: profile.anti_recommendation,
          comparisonSummary: profile.comparison_summary,
          pros: profile.pros || [],
          cons: profile.cons || []
        },
        website: profile.website || prev.website
      }));
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to auto-generate tool profile.'));
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit && initialData?.slug) {
        await updateTool(initialData.slug, formData);
      } else {
        await createTool(formData);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'An error occurred while saving.'));
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
          <h2 className="text-xl font-bold mb-4">Basic Details</h2>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Tool Name *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Slug (URL)</label>
            <input type="text" name="slug" value={formData.slug || ''} onChange={handleChange} placeholder="auto-generated-if-empty" disabled={isEdit} className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 text-muted-foreground outline-none disabled:opacity-50" />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Category *</label>
            <select required name="category" value={formData.category as string} onChange={handleChange} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer">
              <option value="" disabled>Select a category</option>
              {categories.map(cat => (
                <option key={cat.slug} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
            <select name="status" value={formData.status as string} onChange={handleChange} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none appearance-none">
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Pricing Model</label>
              <select name="pricing" value={formData.pricing as string} onChange={handleChange} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none appearance-none">
                <option>Free</option>
                <option>Freemium</option>
                <option>Paid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Difficulty</label>
              <select name="difficulty" value={formData.difficulty as string} onChange={handleChange} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none appearance-none">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Pricing Range</label>
            <input type="text" name="pricingRange" value={formData.pricingRange} onChange={handleChange} placeholder="$0 - $15/mo" className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Description *</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Website / Affiliate Link</label>
            <input type="url" name="website" value={formData.website || ''} onChange={handleChange} placeholder="https://example.com" className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold mb-4">Arrays & Metadata</h2>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Use Cases (comma separated)</label>
            <input type="text" value={formData.useCases?.join(', ') || ''} onChange={(e) => handleArrayChange(e, 'useCases')} placeholder="Note taking, Project management" className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Features (comma separated)</label>
            <input type="text" value={formData.features?.join(', ') || ''} onChange={(e) => handleArrayChange(e, 'features')} placeholder="Databases, Real-time sync" className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Platforms (comma separated)</label>
            <input type="text" value={formData.platforms?.join(', ') || ''} onChange={(e) => handleArrayChange(e, 'platforms')} placeholder="Web, iOS, Android" className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Integrations (comma separated)</label>
            <input type="text" value={formData.integrations?.join(', ') || ''} onChange={(e) => handleArrayChange(e, 'integrations')} placeholder="Slack, GitHub" className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none" />
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col gap-6">
        <div className="flex justify-between items-center z-10 relative">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> AI Insights Context
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Automatically generate the in-depth review using OpenRouter, or write it manually.
            </p>
          </div>
          <button 
            type="button" 
            onClick={handleGenerateAI}
            disabled={aiLoading || !formData.name}
            className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {aiLoading ? 'Generating...' : 'Auto-Generate Insights'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 z-10 relative">
          <div>
             <label className="block text-sm font-medium text-muted-foreground mb-1">Why This Tool Fits</label>
             <textarea value={formData.aiInsights?.whyThisToolFits || ''} onChange={(e) => handleAiInsightsChange(e, 'whyThisToolFits')} rows={2} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none resize-none" />
          </div>
          <div>
             <label className="block text-sm font-medium text-muted-foreground mb-1">Comparison Summary</label>
             <textarea value={formData.aiInsights?.comparisonSummary || ''} onChange={(e) => handleAiInsightsChange(e, 'comparisonSummary')} rows={2} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none resize-none" />
          </div>
          <div>
             <label className="block text-sm font-medium text-muted-foreground mb-1">Best For</label>
             <input type="text" value={formData.aiInsights?.bestFor || ''} onChange={(e) => handleAiInsightsChange(e, 'bestFor')} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
             <label className="block text-sm font-medium text-muted-foreground mb-1">Anti-Recommendation</label>
             <input type="text" value={formData.aiInsights?.antiRecommendation || ''} onChange={(e) => handleAiInsightsChange(e, 'antiRecommendation')} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-muted-foreground">Pros List</label>
                <button type="button" onClick={() => {
                  updateAiInsightList('pros', (current) => [...current, '']);
                }} className="text-xs text-primary hover:text-primary/80 cursor-pointer">+ Add Pro</button>
              </div>
              <div className="space-y-2">
                {(formData.aiInsights?.pros || []).map((pro, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" value={pro} onChange={(e) => {
                      const newPros = [...(formData.aiInsights?.pros || [])];
                      newPros[i] = e.target.value;
                      updateAiInsightList('pros', () => newPros);
                    }} className="flex-1 bg-background border border-white/10 rounded-lg px-3 py-1.5 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none" />
                    <button type="button" onClick={() => {
                      const newPros = (formData.aiInsights?.pros || []).filter((_, index) => index !== i);
                      updateAiInsightList('pros', () => newPros);
                    }} className="text-muted-foreground hover:text-red-400 font-bold px-2 cursor-pointer">&times;</button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-muted-foreground">Cons List</label>
                <button type="button" onClick={() => {
                  updateAiInsightList('cons', (current) => [...current, '']);
                }} className="text-xs text-red-500 hover:text-red-400 cursor-pointer">+ Add Con</button>
              </div>
              <div className="space-y-2">
                {(formData.aiInsights?.cons || []).map((con, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" value={con} onChange={(e) => {
                      const newCons = [...(formData.aiInsights?.cons || [])];
                      newCons[i] = e.target.value;
                      updateAiInsightList('cons', () => newCons);
                    }} className="flex-1 bg-background border border-white/10 rounded-lg px-3 py-1.5 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none" />
                    <button type="button" onClick={() => {
                       const newCons = (formData.aiInsights?.cons || []).filter((_, index) => index !== i);
                       updateAiInsightList('cons', () => newCons);
                    }} className="text-muted-foreground hover:text-red-400 font-bold px-2 cursor-pointer">&times;</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background glow for AI section */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
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
          {isEdit ? 'Save Changes' : 'Create Tool'}
        </button>
      </div>
    </form>
  );
}
