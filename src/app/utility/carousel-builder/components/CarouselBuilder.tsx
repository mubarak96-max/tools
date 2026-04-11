'use client';

import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { AIInput } from './AIInput';
import { TemplateSelector } from './TemplateSelector';
import { Canvas } from './Canvas';
import { Toolbar } from './Toolbar';
import { SavedProjects } from './SavedProjects';
import { PaletteSelector } from './PaletteSelector';
import { SlideStrip } from './SlideStrip';
import { getToolConfig } from '../utils/seo';

interface CarouselBuilderProps {
    niche?: string;
}

export const CarouselBuilder: React.FC<CarouselBuilderProps> = ({ niche }) => {
    const { slides, currentProject, savedProjects } = useEditorStore();

    // Get niche-specific configuration
    const toolConfig = niche ? getToolConfig(niche) : null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Only show if not embedded in niche page */}
            {!niche && (
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Carousel Builder</h1>
                                <p className="text-sm text-gray-600">Create viral social media carousels in 30 seconds</p>
                            </div>
                            <Toolbar />
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Show saved projects if user has any and no current project */}
                {savedProjects.length > 0 && !currentProject && (
                    <div className="mb-8">
                        <SavedProjects />
                    </div>
                )}

                {/* AI Input Section */}
                <div className="mb-8">
                    <AIInput
                        niche={niche}
                        defaultTopic={toolConfig?.defaultTopic}
                        placeholder={toolConfig?.placeholder}
                        suggestedTopics={toolConfig?.suggestedTopics}
                    />
                </div>

                {/* Template Selector */}
                <div className="mb-8">
                    <TemplateSelector
                        niche={niche}
                        recommendedTemplates={toolConfig?.templates}
                    />
                </div>

                {/* Main Editor */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Canvas - Takes up most space */}
                    <div className="lg:col-span-3">
                        <Canvas />
                    </div>

                    {/* Controls Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Slide Controls</h3>

                            {/* Slide management buttons */}
                            <div className="space-y-3 mb-6">
                                <button
                                    onClick={() => useEditorStore.getState().addSlide()}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add Slide
                                </button>

                                <button
                                    onClick={() => useEditorStore.getState().duplicateSlide(useEditorStore.getState().activeSlideIndex)}
                                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Duplicate Slide
                                </button>

                                {slides.length > 1 && (
                                    <button
                                        onClick={() => useEditorStore.getState().deleteSlide(useEditorStore.getState().activeSlideIndex)}
                                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Delete Slide
                                    </button>
                                )}
                            </div>

                            {/* Palette Selector */}
                            <PaletteSelector />
                        </div>
                    </div>
                </div>

                {/* Slide Strip */}
                <div className="mt-8">
                    <SlideStrip />
                </div>

                {/* Toolbar for niche pages */}
                {niche && (
                    <div className="mt-8 flex justify-center">
                        <Toolbar />
                    </div>
                )}
            </div>
        </div>
    );
};