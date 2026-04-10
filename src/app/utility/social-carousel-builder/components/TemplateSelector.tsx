'use client';

import React, { useState } from 'react';
import { TemplateSelectorProps } from '../types';
import { getTemplateCategories } from '../constants/templates';
import { TemplatePreview } from './TemplatePreview';

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
    templates,
    onTemplateSelect,
    selectedTemplate
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

    const categories = ['All', ...getTemplateCategories()];

    const filteredTemplates = selectedCategory === 'All'
        ? templates
        : templates.filter(template => template.category === selectedCategory);

    return (
        <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`
              px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === category
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
            `}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredTemplates.map((template) => (
                    <div
                        key={template.id}
                        className={`
              relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-lg group
              ${selectedTemplate?.id === template.id
                                ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                                : 'border-gray-200 hover:border-gray-300'
                            }
            `}
                        onClick={() => onTemplateSelect(template)}
                        onMouseEnter={() => setHoveredTemplate(template.id)}
                        onMouseLeave={() => setHoveredTemplate(null)}
                    >
                        {/* Template Preview */}
                        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg overflow-hidden">
                            <TemplatePreview
                                template={template}
                                isHovered={hoveredTemplate === template.id}
                                isSelected={selectedTemplate?.id === template.id}
                            />
                        </div>

                        {/* Template Info */}
                        <div className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                        {template.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {template.category}
                                    </p>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <span className="flex items-center mr-3">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                                            </svg>
                                            {template.elements.length} elements
                                        </span>
                                        <span className="flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                            </svg>
                                            {template.defaultDimensions.width}×{template.defaultDimensions.height}
                                        </span>
                                    </div>
                                </div>

                                {/* Selection Indicator */}
                                {selectedTemplate?.id === template.id && (
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hover Overlay */}
                        {hoveredTemplate === template.id && (
                            <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center transition-opacity">
                                <div className="bg-white rounded-lg shadow-lg p-3">
                                    <p className="text-sm font-medium text-gray-900">Click to select</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* No Templates Message */}
            {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                    <p className="text-gray-600">
                        No templates match the selected category. Try selecting a different category.
                    </p>
                </div>
            )}

            {/* Template Count */}
            <div className="text-center text-sm text-gray-500">
                Showing {filteredTemplates.length} of {templates.length} templates
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </div>
        </div>
    );
};