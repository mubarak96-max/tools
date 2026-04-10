'use client';

import React from 'react';
import { CarouselBuilderApp } from './components/CarouselBuilderApp';

export default function SocialCarouselBuilderPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Social Carousel Builder
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Create professional carousel content for Instagram, LinkedIn, and TikTok.
                        Choose from 8 beautiful templates and customize them for your brand.
                    </p>
                </div>

                <CarouselBuilderApp />
            </div>
        </div>
    );
}