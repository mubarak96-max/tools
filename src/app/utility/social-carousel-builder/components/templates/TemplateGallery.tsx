'use client';

import React, { useState, useMemo } from 'react';
import { PremiumTemplate, TemplateCategory } from '../../types/premium';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../utils/cn';

interface TemplateGalleryProps {
    templates: PremiumTemplate[];
    categories: TemplateCategory[];
    onTemplateSelect: (template: PremiumTemplate) => void;
    selectedTemplate?: PremiumTemplate;
    loading?: boolean;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
    templates,
    categories,
    onTemplateSelect,
    selectedTemplate,
    loading = false
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'recent' | 'popular'>('recent');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredAndSortedTemplates = useMemo(() => {
        let filtered = templates;

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(template => template.category.id === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(template =>
                template.name.toLowerCase().includes(query) ||
                template.tags.some(tag => tag.toLowerCase().includes(query)) ||
                template.category.name.toLowerCase().includes(query)
            );
        }

        // Sort templates
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'popular':
                    return (b.metadata.downloads || 0) - (a.metadata.downloads || 0);
                case 'recent':
                default:
                    return new Date(b.metadata.updatedAt).getTime() - new Date(a.metadata.updatedAt).getTime();
            }
        });

        return filtered;
    }, [templates, selectedCategory, searchQuery, sortBy]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-neutral-600">Loading templates...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900">Choose a Template</h2>
                    <p className="text-neutral-600 mt-1">
                        Start with a professionally designed template and customize it to your needs
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        icon={
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        }
                    />
                    <Button
                        variant={viewMode === 'list' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        icon={
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        }
                    />
                </div>

                <div className="flex gap-2">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'name' | 'recent' | 'popular')}
                        className="premium-input w-auto min-w-32"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="popular">Most Popular</option>
                        <option value="name">Name A-Z</option>
                    </select>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                <Button
                    variant={selectedCategory === 'all' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                >
                    All Templates
                </Button>
                {categories.map((category) => (
                    <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className="flex items-center gap-2"
                    >
                        <span className="text-lg">{category.icon}</span>
                        {category.name}
                    </Button>
                ))}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-600">
                    {filteredAndSortedTemplates.length} template{filteredAndSortedTemplates.length !== 1 ? 's' : ''} found
                </p>
            </div>

            {/* Templates Grid/List */}
            {filteredAndSortedTemplates.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-neutral-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">No templates found</h3>
                    <p className="text-neutral-600 mb-4">
                        Try adjusting your search or filter criteria
                    </p>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('all');
                        }}
                    >
                        Clear Filters
                    </Button>
                </div>
            ) : (
                <div className={cn(
                    viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                        : 'space-y-4'
                )}>
                    {filteredAndSortedTemplates.map((template) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            selected={selectedTemplate?.id === template.id}
                            viewMode={viewMode}
                            onSelect={() => onTemplateSelect(template)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

interface TemplateCardProps {
    template: PremiumTemplate;
    selected: boolean;
    viewMode: 'grid' | 'list';
    onSelect: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
    template,
    selected,
    viewMode,
    onSelect
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    if (viewMode === 'list') {
        return (
            <Card
                className={cn(
                    'flex items-center gap-4 p-4 cursor-pointer transition-all',
                    selected && 'ring-2 ring-primary-500 border-primary-500'
                )}
                hover
                onClick={onSelect}
            >
                <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                    {!imageError ? (
                        <img
                            src={template.preview.thumbnail}
                            alt={template.name}
                            className={cn(
                                'w-full h-full object-cover transition-opacity',
                                imageLoaded ? 'opacity-100' : 'opacity-0'
                            )}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold text-neutral-900 truncate">{template.name}</h3>
                            <p className="text-sm text-neutral-600 mt-1">{template.category.name}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs bg-neutral-100 px-2 py-1 rounded-full">
                                    {template.slides.length} slide{template.slides.length !== 1 ? 's' : ''}
                                </span>
                                {template.premium && (
                                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                                        Premium
                                    </span>
                                )}
                            </div>
                        </div>

                        {selected && (
                            <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card
            className={cn(
                'cursor-pointer transition-all group',
                selected && 'ring-2 ring-primary-500 border-primary-500'
            )}
            hover
            onClick={onSelect}
            padding="none"
        >
            <div className="aspect-square bg-neutral-100 rounded-t-2xl overflow-hidden relative">
                {!imageError ? (
                    <img
                        src={template.preview.thumbnail}
                        alt={template.name}
                        className={cn(
                            'w-full h-full object-cover transition-all group-hover:scale-105',
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                        )}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}

                {selected && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}

                {template.premium && (
                    <div className="absolute top-3 left-3 bg-primary-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Premium
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                        {template.name}
                    </h3>
                </div>

                <p className="text-sm text-neutral-600 mb-3">{template.category.name}</p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs bg-neutral-100 px-2 py-1 rounded-full">
                            {template.slides.length} slide{template.slides.length !== 1 ? 's' : ''}
                        </span>
                        {template.metadata.rating && (
                            <div className="flex items-center gap-1">
                                <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-xs text-neutral-600">{template.metadata.rating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>

                    {template.metadata.downloads && (
                        <span className="text-xs text-neutral-500">
                            {template.metadata.downloads.toLocaleString()} uses
                        </span>
                    )}
                </div>
            </div>
        </Card>
    );
};