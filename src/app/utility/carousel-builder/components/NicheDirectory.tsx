'use client';

import React from 'react';
import Link from 'next/link';
import { getAllNiches } from '../data/niches';

export const NicheDirectory: React.FC = () => {
    const niches = getAllNiches();

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Specialized Carousel Makers</h3>
                <p className="text-gray-600">
                    Choose a niche-specific tool for better results and templates
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {niches.map((niche) => (
                    <Link
                        key={niche.slug}
                        href={`/utility/carousel-builder/${niche.slug}`}
                        className="block border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                        <h4 className="font-semibold text-gray-900 mb-2">
                            {niche.seoContent.h1}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                            {niche.description}
                        </p>
                        <div className="flex items-center text-blue-600 text-sm font-medium">
                            Create {niche.slug.replace('-', ' ')} →
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};