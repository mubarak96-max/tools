'use client';

import React from 'react';
import { BuilderErrorBoundary } from '../social-carousel-builder/components/BuilderErrorBoundary';
import { CarouselBuilderApp } from '../social-carousel-builder/components/CarouselBuilderApp';

export default function FreeSocialSeamlessCarouselBuilderPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-gray-900">
                        Free Social Seamless Carousel Builder
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">
                        Create seamless multi-slide carousel designs for Instagram, LinkedIn, and TikTok.
                        Start with one of 10 template families, customize each slide, and export the full carousel for free.
                    </p>
                </div>

                <BuilderErrorBoundary>
                    <CarouselBuilderApp />
                </BuilderErrorBoundary>
            </div>
        </div>
    );
}
