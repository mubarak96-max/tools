'use client';

import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { TEMPLATES } from '../data/templates';

interface TemplateSelectorProps {
    niche?: string;
    recommendedTemplates?: string[];
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
    niche,
    recommendedTemplates
}) => {
    const { selectedTemplate, applyTemplate } = useEditorStore();

    // Filter templates based on niche recommendations
    const displayTemplates = recommendedTemplates
        ? TEMPLATES.filter(template => recommendedTemplates.includes(template.id))
        : TEMPLATES;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {niche ? `${niche.replace('-', ' ')} Templates` : 'Choose a Template'}
                </h3>
                <p className="text-gray-600">
                    {niche
                        ? `Templates optimized for ${niche.replace('-', ' ')} content`
                        : 'Or start with a proven viral format'
                    }
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {displayTemplates.map((template) => (
                    <div
                        key={template.id}
                        onClick={() => applyTemplate(template)}
                        className={`
                            cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md
                            ${selectedTemplate?.id === template.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }
                        `}
                    >
                        {/* Template Preview */}
                        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-600 mb-1">
                                    {template.slideCount}
                                </div>
                                <div className="text-xs text-gray-500">slides</div>
                            </div>
                        </div>

                        {/* Template Info */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                                {template.name}
                            </h4>
                            <p className="text-xs text-gray-600 mb-2">
                                {template.description}
                            </p>

                            {/* Viral Score */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                    <span className="text-xs text-gray-500">
                                        {template.viralScore}% viral
                                    </span>
                                </div>

                                {selectedTemplate?.id === template.id && (
                                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Show all templates option for niche pages */}
            {niche && recommendedTemplates && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            // This would show all templates - for now just show message
                            alert('All templates feature coming soon!');
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        View all templates →
                    </button>
                </div>
            )}

            {/* Template Structure Preview */}
            {selectedTemplate && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Template Structure:</h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedTemplate.structure.map((step, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600"
                            >
                                {index + 1}. {step}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};