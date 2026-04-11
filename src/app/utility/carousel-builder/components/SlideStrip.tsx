'use client';

import React from 'react';
import { useEditorStore } from '../store/useEditorStore';

export const SlideStrip: React.FC = () => {
    const { slides, activeSlideIndex, selectedPalette, setActiveSlide } = useEditorStore();

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Slides</h3>
                <div className="text-sm text-gray-500">
                    {slides.length} slide{slides.length !== 1 ? 's' : ''}
                </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        onClick={() => setActiveSlide(index)}
                        className={`
              flex-shrink-0 cursor-pointer rounded-lg border-2 transition-all hover:shadow-md
              ${activeSlideIndex === index
                                ? 'border-blue-500 ring-2 ring-blue-200'
                                : 'border-gray-200 hover:border-gray-300'
                            }
            `}
                    >
                        {/* Slide Thumbnail */}
                        <div
                            className="w-24 h-30 rounded-lg overflow-hidden relative"
                            style={{ background: selectedPalette.background }}
                        >
                            <div className="absolute inset-0 p-2 flex flex-col justify-center">
                                <div
                                    className="text-xs font-bold leading-tight mb-1 line-clamp-3"
                                    style={{ color: selectedPalette.textPrimary }}
                                >
                                    {slide.headline || 'Empty slide'}
                                </div>
                                {slide.body && (
                                    <div
                                        className="text-xs leading-tight line-clamp-2"
                                        style={{ color: selectedPalette.textSecondary }}
                                    >
                                        {slide.body}
                                    </div>
                                )}
                            </div>

                            {/* Slide Number */}
                            <div className="absolute bottom-1 right-1">
                                <div
                                    className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                                    style={{
                                        backgroundColor: selectedPalette.accent,
                                        color: selectedPalette.background.includes('gradient') ? '#ffffff' : selectedPalette.textPrimary
                                    }}
                                >
                                    {index + 1}
                                </div>
                            </div>
                        </div>

                        {/* Slide Label */}
                        <div className="p-2 text-center">
                            <div className="text-xs text-gray-600">
                                Slide {index + 1}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Slide Button */}
                <div
                    onClick={() => useEditorStore.getState().addSlide()}
                    className="flex-shrink-0 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                >
                    <div className="w-24 h-30 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-1">
                                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="text-xs text-gray-500">Add Slide</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};