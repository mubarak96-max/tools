'use client';

import React from 'react';
import { BuilderErrorBoundary } from '../social-carousel-builder/components/BuilderErrorBoundary';
import { CarouselBuilderApp } from '../social-carousel-builder/components/CarouselBuilderApp';

export default function FreeSocialSeamlessCarouselBuilderPage() {
    return (
        <div className="min-h-screen bg-slate-100">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 lg:px-6">
                <header className="rounded-[28px] border border-slate-200 bg-white px-5 py-4 shadow-sm">
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Free Social Seamless Carousel Builder
                    </h1>
                </header>
                <BuilderErrorBoundary>
                    <CarouselBuilderApp />
                </BuilderErrorBoundary>
            </div>
        </div>
    );
}
