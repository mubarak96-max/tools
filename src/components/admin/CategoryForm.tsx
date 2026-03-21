'use client';

import { useState } from 'react';
import { ToolCategory } from '@/types/database';
import { createCategory, updateCategory } from '@/app/admin/actions';
import { Save, Loader2, AlertCircle } from 'lucide-react';

interface CategoryFormProps {
  initialData?: ToolCategory;
  isEdit?: boolean;
}

export default function CategoryForm({ initialData, isEdit }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<Partial<ToolCategory>>(initialData || {
    name: '',
    slug: '',
    description: '',
    iconId: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Auto-generate slug if empty
    if (!isEdit && !formData.slug && formData.name) {
      formData.slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    try {
      if (isEdit && initialData?.slug) {
        await updateCategory(initialData.slug, formData);
      } else {
        await createCategory(formData);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 glass-card p-6 md:p-10 rounded-2xl max-w-3xl">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Category Name *</label>
          <input required type="text" name="name" value={formData.name || ''} onChange={handleChange} placeholder="e.g. Video Editing" className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Slug (URL) {isEdit ? '' : '*'}</label>
          <input type="text" required={!isEdit} name="slug" value={formData.slug || ''} onChange={handleChange} placeholder="video-editing" disabled={isEdit} className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 text-muted-foreground outline-none disabled:opacity-50" />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">SEO Description *</label>
          <textarea required name="description" value={formData.description || ''} onChange={handleChange} rows={3} placeholder="Explore the best video editing software..." className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Icon ID (Optional)</label>
          <input type="text" name="iconId" value={formData.iconId || ''} onChange={handleChange} placeholder="lucide-icon-name" className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none" />
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
          {isEdit ? 'Save Changes' : 'Create Category'}
        </button>
      </div>
    </form>
  );
}
